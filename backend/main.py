"""
XP Engine — Backend API Server
FastAPI service for video ingestion, frame extraction, and Gemma 4 multimodal analysis.

Usage:
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8100 --reload

Endpoints:
    GET  /health                    → Server health check
    GET  /api/ingest/status         → Gemma 4 / Ollama connection status
    POST /api/ingest/video          → Full pipeline: download → extract → analyze
    POST /api/ingest/video/upload   → Upload local video file for processing
    POST /api/ingest/frame/analyze  → Analyze a single frame (base64 image)
"""

import os
import shutil
import tempfile
import time
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.video_extractor import (
    check_ffmpeg,
    download_video,
    extract_keyframes,
    get_video_metadata,
)
from services.gemma_bridge import (
    check_ollama,
    analyze_frames_batch,
    analyze_single_frame,
)


# ── App Setup ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="XP Engine Ingest API",
    description="Video ingestion and Gemma 4 multimodal analysis for the XP Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store for background job results
JOBS: dict[str, dict] = {}

# Temp directory for processing
WORK_DIR = os.path.join(tempfile.gettempdir(), "xp_engine_ingest")
os.makedirs(WORK_DIR, exist_ok=True)

# Configurable via environment
OLLAMA_ENDPOINT = os.environ.get("OLLAMA_ENDPOINT", "http://localhost:11434")
GEMMA4_MODEL = os.environ.get("GEMMA4_MODEL", "gemma4:26b")


# ── Models ────────────────────────────────────────────────────────────────

class VideoIngestRequest(BaseModel):
    url: str
    course_id: Optional[str] = None
    course_context: Optional[str] = None
    chapter_title: Optional[str] = None
    frame_interval_seconds: int = 30
    max_frames: int = 20

class FrameAnalyzeRequest(BaseModel):
    image_base64: str
    prompt: Optional[str] = "Describe what you see in this lecture slide. Read all text, equations, and diagrams."


# ── Health & Status ───────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "xp-engine-ingest",
        "ffmpeg_available": check_ffmpeg(),
        "work_dir": WORK_DIR,
    }


@app.get("/api/ingest/status")
async def ingest_status():
    """Check Ollama/Gemma 4 connection and system readiness."""
    ollama_status = await check_ollama(OLLAMA_ENDPOINT, GEMMA4_MODEL)
    
    return {
        "ollama": ollama_status,
        "ffmpeg": check_ffmpeg(),
        "model_target": GEMMA4_MODEL,
        "endpoint": OLLAMA_ENDPOINT,
        "ready": (
            ollama_status.get("status") == "connected"
            and ollama_status.get("model_available", False)
            and check_ffmpeg()
        ),
    }


# ── Video Ingestion ──────────────────────────────────────────────────────

@app.post("/api/ingest/video")
async def ingest_video_url(request: VideoIngestRequest, background_tasks: BackgroundTasks):
    """
    Full pipeline: Download video → extract keyframes → send to Gemma 4 → return structured result.
    
    For long videos, this runs as a background job. Returns a job_id to poll for results.
    """
    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(WORK_DIR, f"job_{job_id}")
    os.makedirs(job_dir, exist_ok=True)
    
    JOBS[job_id] = {
        "id": job_id,
        "status": "accepted",
        "url": request.url,
        "course_id": request.course_id,
        "started_at": time.time(),
        "result": None,
        "error": None,
    }
    
    # Run the pipeline in the background
    background_tasks.add_task(
        _run_video_pipeline,
        job_id=job_id,
        url=request.url,
        job_dir=job_dir,
        course_context=request.course_context or f"{request.course_id} {request.chapter_title}",
        frame_interval=request.frame_interval_seconds,
        max_frames=request.max_frames,
    )
    
    return {
        "job_id": job_id,
        "status": "accepted",
        "message": f"Video ingestion started. Poll /api/ingest/jobs/{job_id} for results.",
    }


@app.get("/api/ingest/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Poll for background job results."""
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return JOBS[job_id]


@app.post("/api/ingest/video/upload")
async def ingest_video_upload(
    file: UploadFile = File(...),
    course_id: str = Form(default=""),
    course_context: str = Form(default=""),
    chapter_title: str = Form(default=""),
    frame_interval_seconds: int = Form(default=30),
    max_frames: int = Form(default=20),
    background_tasks: BackgroundTasks = None,
):
    """
    Upload a local video file for processing.
    Accepts MP4, WebM, MKV files.
    """
    allowed_types = {".mp4", ".webm", ".mkv", ".mov", ".avi"}
    ext = Path(file.filename).suffix.lower()
    
    if ext not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Allowed: {allowed_types}"
        )
    
    job_id = str(uuid.uuid4())[:8]
    job_dir = os.path.join(WORK_DIR, f"job_{job_id}")
    os.makedirs(job_dir, exist_ok=True)
    
    # Save uploaded file
    video_path = os.path.join(job_dir, f"upload{ext}")
    with open(video_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    JOBS[job_id] = {
        "id": job_id,
        "status": "accepted",
        "filename": file.filename,
        "course_id": course_id,
        "started_at": time.time(),
        "result": None,
        "error": None,
    }
    
    context = course_context or f"{course_id} {chapter_title}".strip()
    
    background_tasks.add_task(
        _run_video_pipeline,
        job_id=job_id,
        url=None,
        job_dir=job_dir,
        course_context=context,
        frame_interval=frame_interval_seconds,
        max_frames=max_frames,
        local_video_path=video_path,
    )
    
    return {
        "job_id": job_id,
        "status": "accepted",
        "filename": file.filename,
        "message": f"Video uploaded. Poll /api/ingest/jobs/{job_id} for results.",
    }


# ── Single Frame Analysis ────────────────────────────────────────────────

@app.post("/api/ingest/frame/analyze")
async def analyze_frame(request: FrameAnalyzeRequest):
    """
    Send a single base64 image to Gemma 4 for analysis.
    Useful for slide OCR, whiteboard reading, or diagram description.
    """
    try:
        result = await analyze_single_frame(
            frame_base64=request.image_base64,
            prompt=request.prompt,
            model=GEMMA4_MODEL,
            endpoint=OLLAMA_ENDPOINT,
        )
        return {"status": "success", "analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Background Pipeline ──────────────────────────────────────────────────

async def _run_video_pipeline(
    job_id: str,
    url: Optional[str],
    job_dir: str,
    course_context: str,
    frame_interval: int,
    max_frames: int,
    local_video_path: Optional[str] = None,
):
    """
    Complete video → Gemma 4 pipeline running in background.
    
    Steps:
    1. Download video (if URL provided)
    2. Extract metadata
    3. Extract keyframes as base64 images
    4. Send frames to Gemma 4 for multimodal analysis
    5. Return structured transcript + concepts
    """
    try:
        JOBS[job_id]["status"] = "downloading"
        
        # Step 1: Get video file
        if local_video_path and os.path.exists(local_video_path):
            video_path = local_video_path
        elif url:
            video_path = download_video(url, job_dir)
        else:
            raise ValueError("No video URL or file provided")
        
        JOBS[job_id]["status"] = "extracting_metadata"
        
        # Step 2: Get metadata
        metadata = get_video_metadata(video_path)
        JOBS[job_id]["metadata"] = metadata
        
        JOBS[job_id]["status"] = "extracting_frames"
        
        # Step 3: Extract keyframes
        frames_dir = os.path.join(job_dir, "frames")
        frames = extract_keyframes(
            video_path,
            frames_dir,
            interval_seconds=frame_interval,
            max_frames=max_frames,
        )
        
        JOBS[job_id]["frames_extracted"] = len(frames)
        JOBS[job_id]["status"] = "analyzing"
        
        # Step 4: Send to Gemma 4
        #   Process in batches of 5 frames to stay within context limits
        BATCH_SIZE = 5
        all_results = []
        
        for i in range(0, len(frames), BATCH_SIZE):
            batch = frames[i : i + BATCH_SIZE]
            JOBS[job_id]["status"] = f"analyzing_batch_{i // BATCH_SIZE + 1}"
            
            result = await analyze_frames_batch(
                frames=batch,
                model=GEMMA4_MODEL,
                endpoint=OLLAMA_ENDPOINT,
                course_context=course_context,
            )
            all_results.append(result)
        
        # Step 5: Merge results
        merged_result = _merge_analysis_results(all_results)
        
        JOBS[job_id]["status"] = "complete"
        JOBS[job_id]["result"] = merged_result
        JOBS[job_id]["completed_at"] = time.time()
        JOBS[job_id]["duration_seconds"] = (
            JOBS[job_id]["completed_at"] - JOBS[job_id]["started_at"]
        )
        
    except Exception as e:
        JOBS[job_id]["status"] = "error"
        JOBS[job_id]["error"] = str(e)
    
    finally:
        # Clean up large frame files (keep just the results)
        frames_path = os.path.join(job_dir, "frames")
        if os.path.exists(frames_path):
            shutil.rmtree(frames_path, ignore_errors=True)


def _merge_analysis_results(results: list[dict]) -> dict:
    """Merge multiple batch analysis results into one coherent output."""
    all_segments = []
    all_concepts = []
    concept_ids_seen = set()
    summaries = []
    
    for batch_result in results:
        if batch_result.get("status") != "success":
            continue
        
        inner = batch_result.get("result", {})
        
        for seg in inner.get("transcript_segments", []):
            all_segments.append(seg)
        
        for concept in inner.get("concepts", []):
            if concept.get("id") not in concept_ids_seen:
                all_concepts.append(concept)
                concept_ids_seen.add(concept.get("id"))
        
        if inner.get("summary"):
            summaries.append(inner["summary"])
    
    return {
        "transcript_segments": all_segments,
        "concepts": all_concepts,
        "summary": " ".join(summaries),
        "total_segments": len(all_segments),
        "total_concepts": len(all_concepts),
        "batches_processed": len(results),
    }



# ── Narrative Generation ──────────────────────────────────────────────

class NarrativeRequest(BaseModel):
    concept_graph: dict
    title: str = "Untitled Mission"
    setting: str = ""
    style_preset: str = "historical_adventure"
    target_nodes: int = 30
    max_nodes: int = 60
    course_id: str = ""
    chapter_id: str = ""


class SceneImageRequest(BaseModel):
    mission_json: dict
    art_style: str = "Cinematic illustration, warm golden-hour lighting, painterly style"


@app.post("/api/generate/narrative")
async def generate_narrative(request: NarrativeRequest):
    """
    Generate a branching narrative mission from a concept graph using Gemma 4.
    
    Input:  concept_graph with concepts + edges + misconceptions
    Output: Full mission JSON compatible with XPPlayer
    """
    concept_graph = request.concept_graph
    concepts = concept_graph.get("concepts", [])
    
    if not concepts:
        raise HTTPException(status_code=400, detail="No concepts provided in concept_graph")
    
    # Build the narrative generation prompt
    concept_summary = "\n".join([
        f"{i+1}. {c['name']} (id: {c['id']}, bloom: {c.get('bloom_level', 'understand')})\n"
        f"   Description: {c.get('description', '')}\n"
        f"   Misconceptions: {', '.join([m['text'] for m in c.get('misconceptions', [])])}"
        for i, c in enumerate(concepts)
    ])
    
    prompt = f"""Generate a branching-choice narrative mission for teaching these concepts:

{concept_summary}

Setting: {request.setting or 'Generate an engaging scenario appropriate for the concepts.'}
Target: {request.target_nodes}-{request.max_nodes} narrative nodes
Style: {request.style_preset}

Return ONLY valid JSON with this structure:
{{
  "title": "{request.title}",
  "subtitle": "descriptive subtitle",
  "setting": "detailed setting",
  "characters": [
    {{"id": "char_id", "name": "Name", "role": "mentor", "personality": "description", "voice_id": "voice_type"}}
  ],
  "entry_node_id": "n_opening",
  "nodes": [
    {{
      "id": "n_opening",
      "type": "scene",
      "scene_text": "narrative text",
      "character_dialogue": [{{"character": "char_id", "text": "dialogue"}}],
      "choices": [{{"id": "a", "text": "choice text", "next_node": "n_XX", "hidden_tag": "tag", "xp_bonus": 10}}],
      "hidden_pedagogy": {{
        "concepts_covered": ["concept_id"],
        "misconception_tested": null,
        "is_error_path": false,
        "correction_text": null
      }},
      "media": {{
        "scene_image_prompt": "detailed image prompt",
        "ambient_sound": "wind_coastal"
      }}
    }}
  ]
}}

Rules:
- Every concept must appear in at least 2 nodes
- Every common misconception needs an error_path node with correction_text
- All branches converge before introducing new concepts
- Formulas are revealed LAST, after experiential learning
- Error paths get xp_bonus: 5, correct paths get 15-25"""

    try:
        from services.gemma_bridge import query_ollama_text
        
        response = await query_ollama_text(
            OLLAMA_ENDPOINT,
            GEMMA4_MODEL,
            prompt,
            system_prompt="You are a master educational game designer. Output ONLY valid JSON.",
            temperature=0.7,
            max_tokens=16000,
        )
        
        # Extract JSON from response
        import json
        import re
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if not json_match:
            raise HTTPException(status_code=500, detail="LLM did not return valid JSON")
        
        narrative = json.loads(json_match.group())
        
        # Build mission package
        nodes = narrative.get("nodes", [])
        mission = {
            "course": {
                "id": request.course_id or "USAI-001",
                "title": request.title,
                "institution": "University School AI",
                "department": "",
            },
            "chapter": {
                "id": request.chapter_id or f"ch_{int(time.time())}",
                "title": narrative.get("title", request.title),
                "order": 1,
                "estimated_play_time": f"{len(nodes) * 2} min",
            },
            "narrative": {
                **narrative,
                "id": f"xp_{request.course_id}_{int(time.time())}",
                "total_nodes": len(nodes),
                "estimated_play_time": f"{len(nodes) * 2} min",
                "generation_model": GEMMA4_MODEL,
                "reviewed": False,
                "published": False,
                "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            },
        }
        
        return {
            "status": "complete",
            "mission": mission,
            "stats": {
                "node_count": len(nodes),
                "scene_nodes": len([n for n in nodes if n.get("type") == "scene"]),
                "decision_nodes": len([n for n in nodes if n.get("type") == "decision"]),
                "error_paths": len([n for n in nodes if n.get("hidden_pedagogy", {}).get("is_error_path")]),
            },
        }
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse narrative JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Narrative generation failed: {str(e)}")


@app.post("/api/generate/scene-images")
async def generate_scene_images(request: SceneImageRequest):
    """
    Extract scene image prompts from a mission JSON.
    Phase 1: Returns prompts for manual/batch generation.
    Phase 2: Will integrate with SDXL or Gemma 4 image gen.
    """
    nodes = request.mission_json.get("narrative", {}).get("nodes", [])
    art_style = request.art_style
    
    prompts = []
    for node in nodes:
        base_prompt = node.get("media", {}).get("scene_image_prompt", "")
        if not base_prompt:
            base_prompt = (node.get("scene_text", "") or "")[:200]
        
        prompts.append({
            "node_id": node.get("id"),
            "prompt": f"{art_style}, {base_prompt}" if base_prompt else None,
            "status": "prompt_ready",
            "image_url": None,
        })
    
    return {
        "status": "prompts_extracted",
        "prompts": [p for p in prompts if p["prompt"]],
        "total_prompts": len([p for p in prompts if p["prompt"]]),
    }


# ── Startup ───────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Log system status on startup."""
    print("=" * 60)
    print("  XP Engine Ingest API")
    print("=" * 60)
    print(f"  Ollama endpoint: {OLLAMA_ENDPOINT}")
    print(f"  Gemma 4 model:   {GEMMA4_MODEL}")
    print(f"  ffmpeg:          {'[OK] available' if check_ffmpeg() else '[X] NOT FOUND'}")
    print(f"  Work directory:  {WORK_DIR}")
    print("=" * 60)
    
    # Check Ollama
    status = await check_ollama(OLLAMA_ENDPOINT, GEMMA4_MODEL)
    if status.get("model_available"):
        print(f"  [OK] Gemma 4 ({GEMMA4_MODEL}) ready for inference")
    else:
        print(f"  [!] Gemma 4 not found. Available models: {status.get('models_available', [])}")
    print()

