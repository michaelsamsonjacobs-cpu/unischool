import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import multipart from '@fastify/multipart';
import path from 'path';
import fs from 'fs';
import { pipeline as streamPipeline } from 'stream/promises';
import { execSync } from 'child_process';

const BAA_UPLOAD_DIR = path.resolve(process.cwd(), 'docs/procurement/baa_attachments');
const PIPELINE_DB_PATH = path.resolve(process.cwd(), 'apps/web/src/data/procurementPipeline.json');

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

export default async function procurementRoutes(server: FastifyInstance) {
    // Register multipart support for this scope
    await server.register(multipart, {
        limits: {
            fileSize: 100 * 1024 * 1024, // 100MB max per PDF
            files: 5
        }
    });

    // ────────────────────────────────────────────────
    // GET /api/procurement/pipeline
    // Returns the full pipeline state for the dashboard
    // ────────────────────────────────────────────────
    server.get('/pipeline', async (_req: FastifyRequest, reply: FastifyReply) => {
        const pipeline = readPipeline();
        return reply.send(pipeline);
    });

    // ────────────────────────────────────────────────
    // POST /api/procurement/upload-baa/:solId
    // Accepts a PDF file upload and saves it to disk
    // ────────────────────────────────────────────────
    server.post('/upload-baa/:solId', async (req: FastifyRequest<{ Params: { solId: string } }>, reply: FastifyReply) => {
        const { solId } = req.params;
        const safeId = solId.replace(/[^a-zA-Z0-9_-]/g, '_');

        // Create upload directory for this solicitation
        const solDir = path.join(BAA_UPLOAD_DIR, safeId);
        ensureDir(solDir);

        const parts = req.parts();
        const savedFiles: string[] = [];

        for await (const part of parts) {
            if (part.type === 'file') {
                const safeName = part.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                const filePath = path.join(solDir, safeName);
                await streamPipeline(part.file, fs.createWriteStream(filePath));
                savedFiles.push(filePath);
                console.log(`  └─ Saved BAA attachment: ${filePath}`);
            }
        }

        if (savedFiles.length === 0) {
            return reply.code(400).send({ error: 'No PDF files were uploaded.' });
        }

        // Update the pipeline JSON to mark this solicitation as having attachments
        const pipelineData = readPipeline();
        const entry = pipelineData.find((item: any) => item.id === solId);
        if (entry) {
            entry.status = 'ATTACHMENTS_RECEIVED';
            entry.attachments = savedFiles;
            entry.attachmentCount = savedFiles.length;
            entry.attachmentUploadedAt = new Date().toISOString();
            writePipeline(pipelineData);
        }

        return reply.send({
            success: true,
            solId,
            filesUploaded: savedFiles.length,
            filePaths: savedFiles,
            message: `${savedFiles.length} BAA attachment(s) saved. Auto-Draft is now unlocked.`
        });
    });

    // ────────────────────────────────────────────────
    // POST /api/procurement/auto-draft/:solId
    // Triggers the full AI drafting pipeline using the uploaded PDF
    // ────────────────────────────────────────────────
    server.post('/auto-draft/:solId', async (req: FastifyRequest<{ Params: { solId: string } }>, reply: FastifyReply) => {
        const { solId } = req.params;

        // Read pipeline to get attachment paths
        const pipelineData = readPipeline();
        const entry = pipelineData.find((item: any) => item.id === solId);

        if (!entry) {
            return reply.code(404).send({ error: `Solicitation ${solId} not found in pipeline.` });
        }

        if (!entry.attachments || entry.attachments.length === 0) {
            return reply.code(400).send({ error: 'No BAA attachments uploaded yet. Upload the master BAA PDF first.' });
        }

        // Verify all attachments exist
        const validPaths = (entry.attachments as string[]).filter((p: string) => fs.existsSync(p));
        if (validPaths.length === 0) {
            return reply.code(404).send({ error: `No attachment files found on disk. Please re-upload.` });
        }

        // Update status to DRAFTING
        entry.status = 'DRAFTING';
        entry.draftStartedAt = new Date().toISOString();
        writePipeline(pipelineData);

        // Trigger the auto-draft script asynchronously
        const draftScript = path.resolve(process.cwd(), 'apps/api/scripts/run_auto_draft.ts');
        
        try {
            // Run synchronously for now (in production this would be a background job)
            const topic = (entry.title || solId).replace(/"/g, '\\"');
            const fileArgs = validPaths.map((p: string) => `"${p}"`).join(' ');
            const output = execSync(
                `npx tsx "${draftScript}" "${solId}" "${topic}" ${fileArgs}`,
                { cwd: process.cwd(), timeout: 120000 }
            ).toString();

            // Update status to DRAFTED
            entry.status = 'DRAFT_COMPLETE';
            entry.draftCompletedAt = new Date().toISOString();
            writePipeline(pipelineData);

            return reply.send({
                success: true,
                solId,
                status: 'DRAFT_COMPLETE',
                message: `White paper drafted from ${validPaths.length} file(s).`,
                output: output.substring(0, 500) // First 500 chars of output
            });
        } catch (err: any) {
            entry.status = 'DRAFT_FAILED';
            entry.draftError = err.message?.substring(0, 200);
            writePipeline(pipelineData);

            return reply.code(500).send({
                error: 'Auto-draft execution failed.',
                detail: err.message?.substring(0, 500)
            });
        }
    });

    // ────────────────────────────────────────────────
    // GET /api/procurement/attachments/:solId
    // List all uploaded attachments for a solicitation
    // ────────────────────────────────────────────────
    server.get('/attachments/:solId', async (req: FastifyRequest<{ Params: { solId: string } }>, reply: FastifyReply) => {
        const { solId } = req.params;
        const safeId = solId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const solDir = path.join(BAA_UPLOAD_DIR, safeId);

        if (!fs.existsSync(solDir)) {
            return reply.send({ solId, files: [] });
        }

        const files = fs.readdirSync(solDir).map(f => ({
            name: f,
            path: path.join(solDir, f),
            sizeMB: (fs.statSync(path.join(solDir, f)).size / (1024 * 1024)).toFixed(2)
        }));

        return reply.send({ solId, files });
    });
}
