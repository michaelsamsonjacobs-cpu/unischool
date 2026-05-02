import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Video, Square, Circle, Monitor, Camera, RotateCcw, Download, CheckCircle, X, Play, Pause, Mic, MicOff } from 'lucide-react';

/**
 * BASICSVideoRecorder — Loom-style internal video recorder.
 * Records pitch videos using the student's webcam + optional screen share.
 * Built internally for quality control (no external Loom dependency).
 *
 * Features:
 * - Webcam recording with countdown timer
 * - Screen share + webcam overlay mode
 * - Re-record capability
 * - Preview before saving
 * - Exports to data room
 */

export const BASICSVideoRecorder = ({ onSave, onClose }) => {
    const [mode, setMode] = useState('setup'); // 'setup' | 'countdown' | 'recording' | 'preview'
    const [recordingType, setRecordingType] = useState('webcam'); // 'webcam' | 'screen'
    const [countdown, setCountdown] = useState(3);
    const [duration, setDuration] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const previewRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // Cleanup streams on unmount
    useEffect(() => {
        return () => {
            stopAllStreams();
            if (timerRef.current) clearInterval(timerRef.current);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    const stopAllStreams = () => {
        [streamRef.current, screenStreamRef.current].forEach(stream => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' },
                audio: audioEnabled,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            return stream;
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions and try again.');
            return null;
        }
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: 1920, height: 1080 },
                audio: false,
            });
            screenStreamRef.current = screenStream;

            // Get webcam for overlay
            const camStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240, facingMode: 'user' },
                audio: audioEnabled,
            });
            streamRef.current = camStream;

            // Combine streams
            const combined = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...camStream.getAudioTracks(),
            ]);
            return combined;
        } catch (err) {
            setError('Screen sharing was cancelled or denied.');
            return null;
        }
    };

    const handleStartRecording = async () => {
        setError(null);
        const stream = recordingType === 'webcam' ? await startCamera() : await startScreenShare();
        if (!stream) return;

        if (recordingType === 'webcam' && videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        // Countdown
        setMode('countdown');
        let count = 3;
        setCountdown(count);
        const countdownInterval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(countdownInterval);
                beginRecording(stream);
            }
        }, 1000);
    };

    const beginRecording = (stream) => {
        chunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm';

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mimeType });
            setRecordedBlob(blob);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setMode('preview');
            stopAllStreams();
        };

        recorder.start(1000); // Collect data every second
        setMode('recording');
        setDuration(0);
        timerRef.current = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleReRecord = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setRecordedBlob(null);
        setPreviewUrl(null);
        setMode('setup');
        setDuration(0);
    };

    const handleSave = () => {
        if (recordedBlob && onSave) {
            onSave(recordedBlob, previewUrl);
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Video size={16} className="text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-sm">Pitch Video Recorder</h2>
                            <p className="text-white/40 text-xs">Record your pitch for the data room</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Video Area */}
                <div className="relative aspect-video bg-black">
                    {(mode === 'setup' || mode === 'countdown' || mode === 'recording') && (
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    )}

                    {mode === 'preview' && previewUrl && (
                        <video ref={previewRef} src={previewUrl} controls className="w-full h-full object-contain" />
                    )}

                    {mode === 'setup' && !streamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a1a]">
                            <div className="text-center">
                                <Camera size={48} className="mx-auto text-white/20 mb-4" />
                                <p className="text-white/40 text-sm">Select a mode and start recording</p>
                            </div>
                        </div>
                    )}

                    {/* Countdown overlay */}
                    {mode === 'countdown' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                            <div className="text-8xl font-bold text-white animate-pulse">{countdown}</div>
                        </div>
                    )}

                    {/* Recording indicator */}
                    {mode === 'recording' && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white text-sm font-mono font-bold">{formatTime(duration)}</span>
                        </div>
                    )}

                    {error && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white text-sm p-3 rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="px-6 py-4 border-t border-white/10">
                    {mode === 'setup' && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Mode toggle */}
                                <button
                                    onClick={() => setRecordingType('webcam')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        recordingType === 'webcam' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                                    }`}
                                >
                                    <Camera size={14} /> Webcam
                                </button>
                                <button
                                    onClick={() => setRecordingType('screen')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        recordingType === 'screen' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                                    }`}
                                >
                                    <Monitor size={14} /> Screen + Cam
                                </button>

                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={`p-2 rounded-lg transition-all ${audioEnabled ? 'text-white/60 hover:text-white' : 'text-red-400'}`}
                                >
                                    {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                                </button>
                            </div>

                            <button
                                onClick={handleStartRecording}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/30"
                            >
                                <Circle size={14} /> Start Recording
                            </button>
                        </div>
                    )}

                    {mode === 'recording' && (
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleStopRecording}
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/30 animate-pulse"
                            >
                                <Square size={14} /> Stop Recording
                            </button>
                        </div>
                    )}

                    {mode === 'preview' && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleReRecord}
                                className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors"
                            >
                                <RotateCcw size={14} /> Re-record
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="text-white/40 text-xs">{formatTime(duration)} recorded</span>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-green-500/30"
                                >
                                    <CheckCircle size={14} /> Save to Data Room
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
