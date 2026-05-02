"""
gemma_bridge.py
Bridge between the video extractor and Gemma 4 via Ollama.
Sends extracted frames as base64 images + structured prompts to Gemma 4
for unified transcript + concept extraction in a single pass.
"""

import httpx
import json
import asyncio
from typing import Optional


OLLAMA_DEFAULT_ENDPOINT = "http://localhost:11434"
GEMMA4_DEFAULT_MODEL = "gemma4:26b"


TRANSCRIPTION_SYSTEM_PROMPT = """You are an expert lecture transcription and educational content analysis system.

You will be shown keyframes from a university lecture video. For each set of frames, you must:

1. **Transcribe**: Describe what is being taught, read any text/equations visible on slides or whiteboards, and reconstruct the lecture content as accurately as possible.
2. **Extract Concepts**: Identify all discrete academic concepts being taught.
3. **Identify Misconceptions**: Note any common student misconceptions related to these concepts.
4. **Suggest Narrative Scenarios**: For each concept, suggest a brief real-world scenario that could be used in a branching-choice RPG to teach this concept through experience.

Output valid JSON matching this schema:
{
    "transcript_segments": [
        {
            "timestamp": "0:00-0:30",
            "text": "The professor begins by...",
            "slide_text": "any text visible on slides",
            "key_points": ["point 1", "point 2"]
        }
    ],
    "concepts": [
        {
            "id": "c_concept_name",
            "name": "Human readable name",
            "description": "Brief description",
            "bloom_level": "understand",
            "misconceptions": [
                {
                    "id": "m_id",
                    "text": "What students commonly get wrong",
                    "correction": "The correct understanding"
                }
            ],
            "narrative_seed": "A scenario suggestion for RPG adaptation"
        }
    ],
    "summary": "Overall lecture summary",
    "estimated_concepts_coverage": "percentage of total course concepts covered"
}"""


async def check_ollama(
    endpoint: str = OLLAMA_DEFAULT_ENDPOINT,
    model: str = GEMMA4_DEFAULT_MODEL,
) -> dict:
    """Check if Ollama is running and the model is available."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            resp = await client.get(f"{endpoint}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                models = [m["name"] for m in data.get("models", [])]
                has_model = model in models or any(model in m for m in models)
                return {
                    "status": "connected",
                    "models_available": models,
                    "target_model": model,
                    "model_available": has_model,
                }
        except Exception as e:
            return {"status": "disconnected", "error": str(e)}


async def analyze_frames_batch(
    frames: list[dict],
    model: str = GEMMA4_DEFAULT_MODEL,
    endpoint: str = OLLAMA_DEFAULT_ENDPOINT,
    course_context: Optional[str] = None,
) -> dict:
    """
    Send a batch of keyframes to Gemma 4 for multimodal analysis.
    
    Args:
        frames: List of dicts with {base64, timestamp_seconds}
        model: Ollama model name
        endpoint: Ollama API endpoint
        course_context: Optional context about the course (e.g. "PHY-101 Physics I")
    
    Returns:
        Structured transcript + concept extraction result
    """
    # Build the prompt with frame context
    user_prompt_parts = []
    
    if course_context:
        user_prompt_parts.append(f"Course Context: {course_context}\n")
    
    user_prompt_parts.append(
        f"I'm showing you {len(frames)} keyframes from a university lecture video. "
        f"The frames are taken at regular intervals to capture the progression of the lecture.\n\n"
    )
    
    for frame in frames:
        ts = frame["timestamp_seconds"]
        minutes = int(ts // 60)
        seconds = int(ts % 60)
        user_prompt_parts.append(f"[Frame at {minutes}:{seconds:02d}]")
    
    user_prompt_parts.append(
        "\n\nAnalyze these frames and provide a complete structured output "
        "with transcript segments, concepts, misconceptions, and narrative seeds. "
        "Output ONLY valid JSON."
    )
    
    user_prompt = "\n".join(user_prompt_parts)
    
    # Collect all base64 images
    images = [f["base64"] for f in frames]
    
    # Call Ollama multimodal API
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": TRANSCRIPTION_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": user_prompt,
                "images": images,
            },
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 8192,
        },
    }
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        resp = await client.post(
            f"{endpoint}/api/chat",
            json=payload,
        )
        
        if resp.status_code != 200:
            raise RuntimeError(
                f"Ollama API error {resp.status_code}: {resp.text}"
            )
        
        data = resp.json()
        raw_content = data.get("message", {}).get("content", "")
        
        # Parse JSON from response
        try:
            # Try to find JSON in the response
            json_start = raw_content.find("{")
            json_end = raw_content.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                result = json.loads(raw_content[json_start:json_end])
                return {
                    "status": "success",
                    "model_used": model,
                    "frames_analyzed": len(frames),
                    "result": result,
                    "raw_response_length": len(raw_content),
                }
        except json.JSONDecodeError:
            pass
        
        # Return raw text if JSON parsing fails
        return {
            "status": "partial",
            "model_used": model,
            "frames_analyzed": len(frames),
            "raw_text": raw_content,
            "parse_error": "Could not extract structured JSON from model response",
        }


async def analyze_single_frame(
    frame_base64: str,
    prompt: str = "Describe what you see in this lecture slide. Read all text, equations, and diagrams.",
    model: str = GEMMA4_DEFAULT_MODEL,
    endpoint: str = OLLAMA_DEFAULT_ENDPOINT,
) -> str:
    """Send a single frame to Gemma 4 for OCR/description."""
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [frame_base64],
            },
        ],
        "stream": False,
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(f"{endpoint}/api/chat", json=payload)
        
        if resp.status_code != 200:
            raise RuntimeError(f"Ollama error: {resp.status_code}")
        
        data = resp.json()
        return data.get("message", {}).get("content", "")


async def query_ollama_text(
    endpoint: str = OLLAMA_DEFAULT_ENDPOINT,
    model: str = GEMMA4_DEFAULT_MODEL,
    prompt: str = "",
    system_prompt: str = "",
    temperature: float = 0.3,
    max_tokens: int = 8192,
) -> str:
    """
    Send a text-only query to Gemma 4 via Ollama (no images).
    Used for narrative generation, concept extraction, and other text tasks.
    
    Returns the raw text response.
    """
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }
    
    async with httpx.AsyncClient(timeout=600.0) as client:
        resp = await client.post(f"{endpoint}/api/chat", json=payload)
        
        if resp.status_code != 200:
            raise RuntimeError(f"Ollama API error {resp.status_code}: {resp.text}")
        
        data = resp.json()
        return data.get("message", {}).get("content", "")

