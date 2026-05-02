"""
video_extractor.py
Extracts keyframes and audio segments from video files using ffmpeg.
Outputs base64-encoded images ready for Gemma 4 multimodal inference.
"""

import subprocess
import base64
import os
import tempfile
import json
import shutil
from pathlib import Path
from typing import Optional


def check_ffmpeg() -> bool:
    """Verify ffmpeg is available on the system."""
    try:
        result = subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True, text=True, timeout=5
        )
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def extract_keyframes(
    video_path: str,
    output_dir: str,
    interval_seconds: int = 30,
    max_frames: int = 20,
    resolution: str = "768x432",
) -> list[dict]:
    """
    Extract keyframes from a video at regular intervals.
    
    Args:
        video_path: Path to the video file
        output_dir: Directory to save extracted frames
        interval_seconds: Extract one frame every N seconds
        max_frames: Maximum number of frames to extract
        resolution: Output resolution for frames
    
    Returns:
        List of dicts with {path, timestamp_seconds, base64}
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Get video duration first
    duration = get_video_duration(video_path)
    if duration is None:
        raise RuntimeError(f"Could not determine video duration: {video_path}")
    
    # Calculate timestamps
    timestamps = []
    t = 0.0
    while t < duration and len(timestamps) < max_frames:
        timestamps.append(t)
        t += interval_seconds
    
    frames = []
    for i, ts in enumerate(timestamps):
        frame_path = os.path.join(output_dir, f"frame_{i:04d}.jpg")
        
        cmd = [
            "ffmpeg", "-y",
            "-ss", str(ts),
            "-i", video_path,
            "-vframes", "1",
            "-s", resolution,
            "-q:v", "3",
            frame_path,
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and os.path.exists(frame_path):
            with open(frame_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
            
            frames.append({
                "index": i,
                "path": frame_path,
                "timestamp_seconds": ts,
                "base64": b64,
            })
    
    return frames


def extract_audio_segment(
    video_path: str,
    output_path: str,
    start_seconds: float = 0,
    duration_seconds: Optional[float] = None,
    sample_rate: int = 16000,
) -> str:
    """
    Extract audio from video file as WAV.
    
    Args:
        video_path: Path to video file
        output_path: Where to save the WAV
        start_seconds: Start offset
        duration_seconds: Duration to extract (None = full)
        sample_rate: Audio sample rate
    
    Returns:
        Path to extracted audio file
    """
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-ss", str(start_seconds),
        "-vn",  # No video
        "-acodec", "pcm_s16le",
        "-ar", str(sample_rate),
        "-ac", "1",  # Mono
    ]
    
    if duration_seconds:
        cmd.extend(["-t", str(duration_seconds)])
    
    cmd.append(output_path)
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    
    if result.returncode != 0:
        raise RuntimeError(f"Audio extraction failed: {result.stderr}")
    
    return output_path


def get_video_duration(video_path: str) -> Optional[float]:
    """Get video duration in seconds using ffprobe."""
    try:
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            video_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return float(data["format"]["duration"])
    except Exception:
        pass
    
    return None


def get_video_metadata(video_path: str) -> dict:
    """Get video metadata using ffprobe."""
    try:
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            video_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            fmt = data.get("format", {})
            
            video_stream = None
            audio_stream = None
            for stream in data.get("streams", []):
                if stream.get("codec_type") == "video" and not video_stream:
                    video_stream = stream
                elif stream.get("codec_type") == "audio" and not audio_stream:
                    audio_stream = stream
            
            return {
                "duration_seconds": float(fmt.get("duration", 0)),
                "size_bytes": int(fmt.get("size", 0)),
                "format": fmt.get("format_name", ""),
                "video": {
                    "codec": video_stream.get("codec_name", "") if video_stream else "",
                    "width": int(video_stream.get("width", 0)) if video_stream else 0,
                    "height": int(video_stream.get("height", 0)) if video_stream else 0,
                    "fps": eval(video_stream.get("r_frame_rate", "0/1")) if video_stream else 0,
                } if video_stream else None,
                "audio": {
                    "codec": audio_stream.get("codec_name", "") if audio_stream else "",
                    "sample_rate": int(audio_stream.get("sample_rate", 0)) if audio_stream else 0,
                    "channels": int(audio_stream.get("channels", 0)) if audio_stream else 0,
                } if audio_stream else None,
            }
    except Exception as e:
        return {"error": str(e)}


def download_video(url: str, output_dir: str) -> str:
    """
    Download a video from YouTube/Vimeo/Panopto using yt-dlp.
    
    Returns:
        Path to downloaded video file
    """
    os.makedirs(output_dir, exist_ok=True)
    output_template = os.path.join(output_dir, "lecture_%(id)s.%(ext)s")
    
    cmd = [
        "yt-dlp",
        "--no-playlist",
        "-f", "bestvideo[height<=720]+bestaudio/best[height<=720]",
        "--merge-output-format", "mp4",
        "-o", output_template,
        url,
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    
    if result.returncode != 0:
        raise RuntimeError(f"Video download failed: {result.stderr}")
    
    # Find the downloaded file
    for f in os.listdir(output_dir):
        if f.startswith("lecture_") and f.endswith(".mp4"):
            return os.path.join(output_dir, f)
    
    raise RuntimeError("Downloaded video file not found")
