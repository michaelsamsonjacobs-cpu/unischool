import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { pipeline as streamPipeline } from 'stream/promises';
import { execSync } from 'child_process';

const server = Fastify({ logger: true });

// ─── Config ──────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 4000;
const BAA_UPLOAD_DIR = path.resolve(process.cwd(), 'docs/procurement/baa_attachments');
const PIPELINE_DB_PATH = path.resolve(process.cwd(), 'web/src/data/procurementPipeline.json');
const GENERATED_DIR = path.resolve(process.cwd(), 'docs/procurement/generated');

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readPipeline(): any[] {
    try {
        return JSON.parse(fs.readFileSync(PIPELINE_DB_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

function writePipeline(data: any[]) {
    ensureDir(path.dirname(PIPELINE_DB_PATH));
    fs.writeFileSync(PIPELINE_DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Plugins ─────────────────────────────────────────────────────
server.register(async function (fastify) {
    fastify.register(multipart, {
        limits: { fileSize: 100 * 1024 * 1024, files: 5 }
    });

    // Serve static frontend
    const webDistPath = path.resolve(process.cwd(), 'web/dist');
    if (fs.existsSync(webDistPath)) {
        fastify.register(fastifyStatic, {
            root: webDistPath,
            prefix: '/',
        });
    }
});

// ─── API Routes ──────────────────────────────────────────────────

// GET /api/procurement/pipeline — Full pipeline state
server.get('/api/procurement/pipeline', async (req, reply) => {
    return readPipeline();
});

// GET /api/procurement/attachments/:solId — List uploaded files
server.get<{ Params: { solId: string } }>('/api/procurement/attachments/:solId', async (req, reply) => {
    const solDir = path.join(BAA_UPLOAD_DIR, req.params.solId);
    if (!fs.existsSync(solDir)) return [];
    const files = fs.readdirSync(solDir).filter(f => !f.startsWith('.'));
    return files.map(f => ({
        name: f,
        size: fs.statSync(path.join(solDir, f)).size,
        path: path.join(solDir, f)
    }));
});

// POST /api/procurement/upload-baa/:solId — Upload BAA/SOW attachments
server.post<{ Params: { solId: string } }>('/api/procurement/upload-baa/:solId', async (req, reply) => {
    const solId = req.params.solId;
    const solDir = path.join(BAA_UPLOAD_DIR, solId);
    ensureDir(solDir);

    const parts = req.parts();
    const uploadedFiles: string[] = [];

    for await (const part of parts) {
        if (part.type === 'file') {
            const safeName = part.filename.replace(/[^a-zA-Z0-9_.\-]/g, '_');
            const filePath = path.join(solDir, safeName);
            await streamPipeline(part.file, fs.createWriteStream(filePath));
            uploadedFiles.push(filePath);
        }
    }

    if (uploadedFiles.length === 0) {
        return reply.code(400).send({ error: 'No files uploaded.' });
    }

    // Update pipeline state
    const pipeline = readPipeline();
    const idx = pipeline.findIndex((x: any) => x.id === solId);
    if (idx !== -1) {
        pipeline[idx].status = 'ATTACHMENTS_RECEIVED';
        pipeline[idx].attachmentPaths = [
            ...(pipeline[idx].attachmentPaths || []),
            ...uploadedFiles
        ];
        writePipeline(pipeline);
    }

    return { status: 'ok', files: uploadedFiles.map(f => path.basename(f)) };
});

// POST /api/procurement/auto-draft/:solId — Trigger auto-draft pipeline
server.post<{ Params: { solId: string } }>('/api/procurement/auto-draft/:solId', async (req, reply) => {
    const solId = req.params.solId;
    const pipeline = readPipeline();
    const entry = pipeline.find((x: any) => x.id === solId);

    if (!entry) return reply.code(404).send({ error: `Solicitation ${solId} not found.` });

    const attachments = entry.attachmentPaths || [];
    if (attachments.length === 0) {
        return reply.code(400).send({ error: 'No attachments uploaded for this solicitation.' });
    }

    // Verify all attached files still exist
    for (const fp of attachments) {
        if (!fs.existsSync(fp)) {
            return reply.code(400).send({ error: `Attachment not found on disk: ${path.basename(fp)}` });
        }
    }

    // Update status to DRAFTING
    const idx = pipeline.findIndex((x: any) => x.id === solId);
    pipeline[idx].status = 'DRAFTING';
    writePipeline(pipeline);

    try {
        const scriptPath = path.resolve(process.cwd(), 'server/scripts/run_auto_draft.ts');
        const quotedPaths = attachments.map((f: string) => `"${f}"`).join(' ');
        const cmd = `npx tsx "${scriptPath}" "${solId}" "${entry.title}" ${quotedPaths}`;

        server.log.info(`Executing auto-draft: ${cmd}`);
        const output = execSync(cmd, {
            timeout: 120000,
            cwd: process.cwd()
        }).toString();
        server.log.info(output);

        // Update status
        pipeline[idx].status = 'DRAFT_COMPLETE';
        writePipeline(pipeline);

        return {
            status: 'ok',
            message: `Draft generated for ${solId} from ${attachments.length} file(s).`,
            output: output.substring(0, 2000)
        };
    } catch (err: any) {
        pipeline[idx].status = 'DRAFT_FAILED';
        writePipeline(pipeline);
        server.log.error(err);
        return reply.code(500).send({ error: err.message || 'Draft generation failed.' });
    }
});

// POST /api/procurement/reset-draft/:solId — Reset draft status for re-drafting
server.post<{ Params: { solId: string } }>('/api/procurement/reset-draft/:solId', async (req, reply) => {
    const pipeline = readPipeline();
    const idx = pipeline.findIndex((x: any) => x.id === req.params.solId);
    if (idx === -1) return reply.code(404).send({ error: 'Not found.' });

    pipeline[idx].status = pipeline[idx].attachmentPaths?.length > 0
        ? 'ATTACHMENTS_RECEIVED' : 'AWAITING_ATTACHMENTS';
    writePipeline(pipeline);
    return { status: 'ok', newStatus: pipeline[idx].status };
});

// ─── Settings Routes ─────────────────────────────────────────────

const SETTINGS_PATH = path.resolve(process.cwd(), 'server/scripts/settings.json');
const PROFILE_PATH = path.resolve(process.cwd(), 'server/scripts/past_performance.json');

server.get('/api/settings', async (req, reply) => {
    let settings = { search_keywords: [], training_data_path: "" };
    let profile = {};
    
    if (fs.existsSync(SETTINGS_PATH)) {
        try { settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8')); } catch {}
    }
    if (fs.existsSync(PROFILE_PATH)) {
        try { profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8')); } catch {}
    }
    
    return { settings, profile };
});

server.post('/api/settings', async (req, reply) => {
    try {
        const body = req.body as any;
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(body, null, 2));
        return { status: 'ok' };
    } catch (err: any) {
        return reply.code(500).send({ error: err.message });
    }
});

server.post('/api/company-profile', async (req, reply) => {
    try {
        const body = req.body as any;
        fs.writeFileSync(PROFILE_PATH, JSON.stringify(body, null, 2));
        return { status: 'ok' };
    } catch (err: any) {
        return reply.code(500).send({ error: err.message });
    }
});
// ─── Onyx Integration Routes ────────────────────────────────────

import { checkOnyxHealth, queryOnyxForVolume } from './onyx/onyx_client';

// GET /api/onyx/health — Check if local Onyx is reachable
server.get('/api/onyx/health', async (req, reply) => {
    const health = await checkOnyxHealth();
    return health;
});

// POST /api/onyx/query — Direct query proxy for frontend testing
server.post('/api/onyx/query', async (req, reply) => {
    try {
        const { section, context, guidance } = req.body as any;
        if (!section || !context) {
            return reply.code(400).send({ error: 'Missing required fields: section, context' });
        }
        const result = await queryOnyxForVolume(section, context, guidance || '');
        return { status: 'ok', content: result, length: result.length };
    } catch (err: any) {
        return reply.code(500).send({ error: err.message });
    }
});

// ─── Start ───────────────────────────────────────────────────────
server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) { server.log.error(err); process.exit(1); }
    console.log(`\n==========================================`);
    console.log(` 🚀 A-DIGER Server running at ${address}`);
    console.log(` 📊 Dashboard: ${address}/`);
    console.log(` 📂 Pipeline DB: ${PIPELINE_DB_PATH}`);
    console.log(`==========================================\n`);
});
