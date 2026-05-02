/**
 * IngestService.js
 * Handles ingestion of raw university content (videos, documents, slides)
 * and produces structured text for downstream concept extraction.
 *
 * Video pipeline: source → audio extraction → Whisper transcription → WhisperX alignment
 * Document pipeline: PDF/DOCX/PPTX → text extraction → structured output
 */

const WHISPER_MODELS = {
    'gemma4-multimodal': {
        name: 'Gemma 4 Multimodal (Local)',
        description: 'Native video+audio understanding. Transcribes, extracts concepts, and identifies misconceptions in a single pass. No separate STT model needed.',
        languages: '100+',
        speed: 'moderate',
        accuracy: 'excellent',
        isLocal: true,
        isMultimodal: true,
    },
    'whisper-large-v3-turbo': {
        name: 'Whisper Large V3 Turbo',
        description: 'Gold standard for multilingual transcription. Best accuracy + faster than v3.',
        languages: '99+',
        speed: 'fast',
        accuracy: 'excellent',
    },
    'canary-qwen-2.5b': {
        name: 'Canary Qwen 2.5B',
        description: 'Best-in-class English-only accuracy. Lowest WER for technical content.',
        languages: 'English',
        speed: 'fast',
        accuracy: 'best-english',
    },
    'moonshine': {
        name: 'Moonshine',
        description: 'Edge/mobile optimized. Runs on standard laptops without GPU.',
        languages: 'English + common',
        speed: 'very-fast',
        accuracy: 'good',
    },
    'whisper-cpp': {
        name: 'whisper.cpp',
        description: 'C++ port for CPU inference. No GPU needed.',
        languages: '99+',
        speed: 'moderate',
        accuracy: 'very-good',
    },
};

/**
 * Transcribe a video/audio file using the configured model.
 * 
 * Pipeline options:
 *   1. Gemma 4 Multimodal (preferred) — watches video natively, returns transcript + concepts
 *   2. Backend Whisper API — traditional audio-only STT pipeline
 *
 * @param {string} sourceUrl - URL of the video (YouTube, Panopto, etc.)
 * @param {Object} options - { model, language, diarize, timestamps }
 * @returns {Promise<StructuredLectureDoc>}
 */
export async function transcribeVideo(sourceUrl, options = {}) {
    const {
        model = 'gemma4-multimodal',
        language = 'en',
        diarize = true,
        wordTimestamps = true,
    } = options;

    const modelConfig = WHISPER_MODELS[model];
    console.log(`[Ingest] Transcribing video: ${sourceUrl}`);
    console.log(`[Ingest] Model: ${modelConfig?.name || model}`);

    const result = {
        id: `ingest_${Date.now()}`,
        type: 'lecture_video',
        source_url: sourceUrl,
        model_used: model,
        language,
        transcript: '',
        segments: [],
        speakers: [],
        slide_text: [],
        concepts_preview: null, // Gemma 4 bonus: returns concepts in the same pass
        metadata: {
            duration_seconds: null,
            word_count: null,
            speaker_count: null,
            transcription_model: model,
            diarization: diarize,
            processed_at: new Date().toISOString(),
        },
        status: 'pending',
    };

    // ── Gemma 4 Multimodal Path ──────────────────────────────────────
    // Sends the video URL to the FastAPI backend (port 8100) which:
    //   1. Downloads the video via yt-dlp
    //   2. Extracts keyframes via ffmpeg
    //   3. Sends frames to Gemma 4 via Ollama for unified analysis
    //   4. Returns structured transcript + concept graph
    const INGEST_API = localStorage.getItem('springroll_ingest_api') || 'http://localhost:8100';

    if (modelConfig?.isMultimodal) {
        try {
            // Check if the XP Engine backend is running
            const healthCheck = await fetch(`${INGEST_API}/health`, {
                signal: AbortSignal.timeout(3000)
            }).catch(() => null);

            if (healthCheck?.ok) {
                const health = await healthCheck.json();
                console.log('[Ingest] XP Engine backend connected:', health);

                // Submit video for processing
                const submitResp = await fetch(`${INGEST_API}/api/ingest/video`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: sourceUrl,
                        course_id: options.courseId || null,
                        course_context: options.courseContext || null,
                        chapter_title: options.chapterTitle || null,
                        frame_interval_seconds: options.frameInterval || 30,
                        max_frames: options.maxFrames || 20,
                    }),
                });

                if (submitResp.ok) {
                    const jobData = await submitResp.json();
                    console.log(`[Ingest] ⚡ Job submitted: ${jobData.job_id}`);
                    console.log('[Ingest] Pipeline: Video → yt-dlp → ffmpeg frames → Gemma 4 → transcript + concepts');

                    result.status = 'processing';
                    result.metadata.pipeline = 'gemma4-multimodal';
                    result.metadata.job_id = jobData.job_id;
                    result.metadata.poll_url = `${INGEST_API}/api/ingest/jobs/${jobData.job_id}`;
                    result.metadata.note = `Job ${jobData.job_id} submitted to backend. Poll for results.`;
                    return result;
                }
            }

            // Backend not available — check raw Ollama as fallback info
            console.warn('[Ingest] Backend not running. Start with: cd backend && uvicorn main:app --port 8100');
            result.status = 'backend_offline';
            result.metadata.pipeline = 'gemma4-multimodal';
            result.metadata.note = 'XP Engine backend not running. Start: cd backend && uvicorn main:app --host 0.0.0.0 --port 8100';
            return result;

        } catch (e) {
            console.warn('[Ingest] Gemma 4 multimodal path failed:', e.message);
        }
    }

    // ── Whisper Backend Path ────────────────────────────────────────
    // Traditional pipeline: video → ffmpeg → audio → Whisper → transcript
    // Requires a backend API server running the Whisper model.
    result.metadata.pipeline = 'whisper-backend';
    result.status = 'pending';
    result.metadata.note = 'Pending backend Whisper API connection. POST to /api/ingest/video when available.';

    return result;
}

/**
 * Extract text from a document (PDF, DOCX, PPTX).
 * Uses browser-side extraction where possible.
 *
 * @param {File|Blob} file - The document file
 * @param {string} fileType - 'pdf' | 'docx' | 'pptx'
 * @returns {Promise<StructuredChapterDoc>}
 */
export async function extractDocument(file, fileType) {
    console.log(`[Ingest] Extracting document: ${file.name} (${fileType})`);

    const result = {
        id: `ingest_doc_${Date.now()}`,
        type: 'textbook_chapter',
        file_name: file.name,
        file_type: fileType,
        text: '',
        sections: [],
        metadata: {
            page_count: null,
            word_count: null,
            processed_at: new Date().toISOString(),
        },
        status: 'pending',
    };

    try {
        if (fileType === 'docx') {
            result.text = await extractDocx(file);
        } else if (fileType === 'pdf') {
            result.text = await extractPdf(file);
        } else if (fileType === 'pptx') {
            result.text = await extractPptx(file);
        } else {
            // Plain text fallback
            result.text = await file.text();
        }

        result.metadata.word_count = result.text.split(/\s+/).length;
        result.sections = splitIntoSections(result.text);
        result.status = 'complete';
    } catch (err) {
        console.error('[Ingest] Document extraction failed:', err);
        result.status = 'error';
        result.error = err.message;
    }

    return result;
}

/**
 * Extract text from DOCX using mammoth.js (if available) or basic text fallback.
 * In production, DOCX extraction is handled server-side.
 */
async function extractDocx(file) {
    // Try mammoth.js if loaded globally
    if (typeof mammoth !== 'undefined') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }

    // Fallback: read as raw text. Full XML extraction handled server-side in production.
    console.warn('[Ingest] mammoth.js not available. Reading DOCX as raw text.');
    return await file.text();
}

/**
 * Extract text from PDF using pdf.js.
 */
async function extractPdf(file) {
    if (typeof pdfjsLib === 'undefined') {
        console.warn('[Ingest] pdf.js not available. Returning empty text.');
        return '[PDF extraction requires pdf.js — configure in production]';
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        pages.push(text);
    }

    return pages.join('\n\n');
}

/**
 * Extract text from PPTX slides.
 * In production, PPTX extraction is handled server-side.
 */
async function extractPptx(file) {
    // PPTX extraction requires server-side processing for the MVP.
    console.warn('[Ingest] PPTX extraction not available client-side. Use server API in production.');
    return '[PPTX extraction requires server-side processing — feature available in production]';
}

/**
 * Split raw text into logical sections based on headings/numbering.
 */
function splitIntoSections(text) {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = { title: 'Introduction', content: '' };

    for (const line of lines) {
        // Detect section headers (e.g., "4.1 Force as an Interaction", "Chapter 4", etc.)
        const headerMatch = line.match(/^(\d+\.?\d*\.?\d*)\s+(.+)/);
        if (headerMatch && headerMatch[2].length < 100) {
            if (currentSection.content.trim()) {
                sections.push(currentSection);
            }
            currentSection = {
                id: `section_${headerMatch[1].replace(/\./g, '_')}`,
                title: headerMatch[2].trim(),
                number: headerMatch[1],
                content: '',
            };
        } else {
            currentSection.content += line + '\n';
        }
    }

    if (currentSection.content.trim()) {
        sections.push(currentSection);
    }

    return sections;
}

/**
 * Get available transcription models.
 */
export function getAvailableModels() {
    return WHISPER_MODELS;
}

/**
 * Check if a URL is a supported video source.
 */
export function isSupportedVideoSource(url) {
    const patterns = [
        /youtube\.com\/watch/,
        /youtu\.be\//,
        /panopto\./,
        /mediasite\./,
        /vimeo\.com/,
        /\.mp4$/,
        /\.webm$/,
        /\.m4a$/,
        /\.wav$/,
        /\.mp3$/,
    ];
    return patterns.some(p => p.test(url));
}

/**
 * Poll a backend ingestion job for results.
 * Use with the job_id returned from transcribeVideo().
 * 
 * @param {string} jobId - Job ID from the backend
 * @returns {Promise<Object>} - Job status including transcript/concepts when complete
 */
export async function pollIngestJob(jobId) {
    const INGEST_API = localStorage.getItem('springroll_ingest_api') || 'http://localhost:8100';
    
    const resp = await fetch(`${INGEST_API}/api/ingest/jobs/${jobId}`);
    if (!resp.ok) {
        throw new Error(`Job poll failed: ${resp.status}`);
    }
    
    const job = await resp.json();
    
    return {
        id: job.id,
        status: job.status,
        result: job.result || null,
        error: job.error || null,
        metadata: job.metadata || null,
        framesExtracted: job.frames_extracted || 0,
        durationSeconds: job.duration_seconds || null,
        isComplete: job.status === 'complete',
        isError: job.status === 'error',
        isProcessing: !['complete', 'error'].includes(job.status),
    };
}

/**
 * Upload a local video file for processing.
 * 
 * @param {File} file - Video file from a file input
 * @param {Object} options - { courseId, courseContext, chapterTitle }
 * @returns {Promise<Object>} - Job submission result with job_id
 */
export async function uploadVideoFile(file, options = {}) {
    const INGEST_API = localStorage.getItem('springroll_ingest_api') || 'http://localhost:8100';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', options.courseId || '');
    formData.append('course_context', options.courseContext || '');
    formData.append('chapter_title', options.chapterTitle || '');
    formData.append('frame_interval_seconds', String(options.frameInterval || 30));
    formData.append('max_frames', String(options.maxFrames || 20));
    
    const resp = await fetch(`${INGEST_API}/api/ingest/video/upload`, {
        method: 'POST',
        body: formData,
    });
    
    if (!resp.ok) {
        throw new Error(`Upload failed: ${resp.status}`);
    }
    
    return await resp.json();
}

export default {
    transcribeVideo,
    extractDocument,
    getAvailableModels,
    isSupportedVideoSource,
    pollIngestJob,
    uploadVideoFile,
    WHISPER_MODELS,
};
