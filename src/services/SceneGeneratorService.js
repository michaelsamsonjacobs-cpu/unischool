/**
 * SceneGeneratorService.js
 * Handles AI-generated visual and audio assets for XP narrative nodes.
 *
 * Phase 1: AI-generated 2D scene illustrations (DALL·E 3 / SDXL)
 * Phase 2: 3D navigable environments (World Labs Marble / Gaussian Splatting)
 * Phase 3: VR/AR support via WebXR
 */

// 3D World Generation technology options
const WORLD_GEN_MODELS = {
    'world-labs-marble': {
        name: 'World Labs Marble',
        type: '3d_gaussian_splatting',
        description: 'Text-to-3D persistent worlds. Exports Gaussian splats (.ply). Best for explorable environments.',
        status: 'production',
        outputFormat: '.ply',
    },
    'spatial-ai-echo': {
        name: 'Spatial AI Echo',
        type: '3d_gaussian_splatting',
        description: 'Spatial foundation model. Real-time explorable 3D from prompts.',
        status: 'emerging',
        outputFormat: '.ply',
    },
    'spline-ai': {
        name: 'Spline AI',
        type: 'web_3d',
        description: 'Web-based 3D design with AI generation. Good for interactive embeds.',
        status: 'production',
        outputFormat: 'web_embed',
    },
};

// Voice/narration providers
const TTS_PROVIDERS = {
    'elevenlabs': {
        name: 'ElevenLabs',
        quality: 'premium',
        description: 'Highest quality voice synthesis. Multiple voices, emotional control.',
        cost: 'paid',
    },
    'coqui': {
        name: 'Coqui TTS',
        quality: 'good',
        description: 'Open-source TTS. Runs locally. Good for offline use.',
        cost: 'free',
    },
    'browser-tts': {
        name: 'Browser Web Speech API',
        quality: 'basic',
        description: 'Built-in browser TTS. Zero cost, zero setup. Fallback option.',
        cost: 'free',
    },
};

/**
 * Generate a scene illustration for a narrative node.
 * Phase 1: Returns a prompt for manual/API image generation.
 *
 * @param {Object} node - Narrative node
 * @param {string} artStyle - Consistent art style prefix
 * @returns {Object} { nodeId, prompt, status }
 */
export async function generateSceneImage(node, artStyle = '') {
    const basePrompt = node.media?.scene_image_prompt || node.scene_text?.substring(0, 200);
    const fullPrompt = artStyle ? `${artStyle}, ${basePrompt}` : basePrompt;

    console.log(`[SceneGen] Generating image for node: ${node.id}`);

    // In production: call DALL·E 3 API or Stable Diffusion API
    // For now, return the prompt for manual generation
    return {
        nodeId: node.id,
        prompt: fullPrompt,
        status: 'prompt_ready', // prompt_ready → generating → complete → error
        imageUrl: null,
        model: 'dall-e-3',
        generatedAt: null,
    };
}

/**
 * Generate narration audio for a narrative node.
 * Uses character voice IDs for dialogue and a narrator voice for scene text.
 *
 * @param {Object} node - Narrative node
 * @param {Object} characters - Character map with voice_id
 * @param {string} provider - TTS provider key
 * @returns {Object} { nodeId, segments[], status }
 */
export async function generateNarration(node, characters = {}, provider = 'browser-tts') {
    const segments = [];

    // Scene text narration
    if (node.scene_text) {
        segments.push({
            type: 'narration',
            text: node.scene_text,
            voice: 'narrator',
            order: 0,
        });
    }

    // Character dialogue
    (node.character_dialogue || []).forEach((line, index) => {
        const character = characters[line.character] || {};
        segments.push({
            type: 'dialogue',
            text: line.text,
            character: line.character,
            voice: character.voice_id || 'default',
            order: index + 1,
        });
    });

    return {
        nodeId: node.id,
        segments,
        provider,
        status: 'ready',
        audioUrls: [], // Will be populated after generation
    };
}

/**
 * Speak text using browser's Web Speech API (Phase 1 fallback).
 * @param {string} text - Text to speak
 * @param {Object} options - { rate, pitch, voice }
 */
export function speakText(text, options = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('[SceneGen] Speech synthesis not available');
        return null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.0;

    if (options.voice) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.name.includes(options.voice));
        if (match) utterance.voice = match;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
}

/**
 * Stop all speech synthesis.
 */
export function stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Generate a 3D environment for a narrative node (Phase 2).
 * Uses World Labs Marble or Spatial AI Echo.
 *
 * @param {Object} node - Narrative node
 * @param {string} model - World generation model key
 * @returns {Object} { nodeId, prompt, model, status }
 */
export async function generate3DScene(node, model = 'world-labs-marble') {
    const modelInfo = WORLD_GEN_MODELS[model];
    if (!modelInfo) {
        throw new Error(`Unknown 3D generation model: ${model}`);
    }

    console.log(`[SceneGen] 3D generation requested for node ${node.id} using ${modelInfo.name}`);

    // Phase 2: Will integrate with World Labs / Spatial AI API
    return {
        nodeId: node.id,
        prompt: node.media?.scene_image_prompt || node.scene_text?.substring(0, 200),
        model: model,
        modelInfo,
        status: 'not_implemented',
        sceneUrl: null,
        format: modelInfo.outputFormat,
    };
}

/**
 * Ambient sound map — maps sound keys to audio files/URLs.
 */
const AMBIENT_SOUNDS = {
    wind_coastal: { name: 'Coastal Wind', category: 'nature' },
    wind_light: { name: 'Light Breeze', category: 'nature' },
    wind_calm: { name: 'Calm Air', category: 'nature' },
    sand_wind: { name: 'Wind Over Sand', category: 'nature' },
    sand_drawing: { name: 'Drawing in Sand', category: 'interaction' },
    sand_sliding: { name: 'Sliding on Sand', category: 'interaction' },
    sand_rolling: { name: 'Rolling on Sand', category: 'interaction' },
    sand_friction: { name: 'Sand Friction', category: 'interaction' },
    wood_creaking: { name: 'Wood Creaking', category: 'workshop' },
    tools_metal: { name: 'Metal Tools', category: 'workshop' },
    rope_tension: { name: 'Rope Under Tension', category: 'workshop' },
    rope_pulling: { name: 'Pulling Rope', category: 'workshop' },
    wheel_spinning: { name: 'Spinning Wheel', category: 'workshop' },
    propeller_slow: { name: 'Slow Propeller', category: 'machine' },
    propeller_wind: { name: 'Propeller Wind', category: 'machine' },
    propeller_wind_face: { name: 'Wind in Face', category: 'machine' },
    machine_tilting: { name: 'Machine Tilting', category: 'machine' },
    blocks_sliding: { name: 'Blocks Sliding', category: 'experiment' },
    effort_pushing: { name: 'Pushing Effort', category: 'interaction' },
    gliding_sand: { name: 'Gliding on Sand Rail', category: 'machine' },
    thinking_silence: { name: 'Contemplative Silence', category: 'atmosphere' },
    moment_clarity: { name: 'Moment of Clarity', category: 'atmosphere' },
    moment_revelation: { name: 'Revelation', category: 'atmosphere' },
    triumph_orchestral: { name: 'Orchestral Triumph', category: 'music' },
    triumph_quiet: { name: 'Quiet Triumph', category: 'music' },
    reflection_peaceful: { name: 'Peaceful Reflection', category: 'music' },
    sunset_wind_beautiful: { name: 'Beautiful Sunset Wind', category: 'nature' },
    silence_wind: { name: 'Silence with Wind', category: 'nature' },
    wind_shift: { name: 'Wind Shifting', category: 'nature' },
    wind_moderate: { name: 'Moderate Wind', category: 'nature' },
    wind_resistance: { name: 'Wind Resistance', category: 'nature' },
    wind_beautiful: { name: 'Beautiful Wind', category: 'nature' },
    approval_nod: { name: 'Approval', category: 'atmosphere' },
    correction_calm: { name: 'Calm Correction', category: 'atmosphere' },
    encouragement: { name: 'Encouragement', category: 'atmosphere' },
    formalization: { name: 'Formalization Sound', category: 'atmosphere' },
    understanding_calm: { name: 'Understanding', category: 'atmosphere' },
    understanding_deep: { name: 'Deep Understanding', category: 'atmosphere' },
};

/**
 * Get ambient sound metadata for a sound key.
 */
export function getAmbientSound(key) {
    return AMBIENT_SOUNDS[key] || null;
}

/**
 * Get all available ambient sounds.
 */
export function getAvailableSounds() {
    return AMBIENT_SOUNDS;
}

/**
 * Get available world generation models.
 */
export function getWorldGenModels() {
    return WORLD_GEN_MODELS;
}

/**
 * Get available TTS providers.
 */
export function getTTSProviders() {
    return TTS_PROVIDERS;
}

export default {
    generateSceneImage,
    generateNarration,
    speakText,
    stopSpeaking,
    generate3DScene,
    getAmbientSound,
    getAvailableSounds,
    getWorldGenModels,
    getTTSProviders,
};
