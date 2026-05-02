/**
 * XP Scene Image Registry
 * Maps scene art prompts to actual generated image files.
 * This enables the XP Player to show real illustrations instead of placeholder boxes.
 */

// Map scene keywords/prompts to image paths
const SCENE_IMAGE_MAP = {
    // Workshop scenes
    'workshop': '/xp-scenes/workshop.png',
    'bicycle shop': '/xp-scenes/workshop.png',
    'barn': '/xp-scenes/workshop.png',
    'wooden workshop': '/xp-scenes/workshop.png',
    
    // Inertia / bicycle scenes
    'bicycle': '/xp-scenes/bicycle_inertia.png',
    'wheel': '/xp-scenes/bicycle_inertia.png',
    'spinning': '/xp-scenes/bicycle_inertia.png',
    'inertia': '/xp-scenes/bicycle_inertia.png',
    'perpetual': '/xp-scenes/bicycle_inertia.png',
    
    // Sand dune / push scenes
    'sand': '/xp-scenes/sand_dune_push.png',
    'dune': '/xp-scenes/sand_dune_push.png',
    'push': '/xp-scenes/sand_dune_push.png',
    'kill devil': '/xp-scenes/sand_dune_push.png',
    'beach': '/xp-scenes/sand_dune_push.png',
    'machine on the sand': '/xp-scenes/sand_dune_push.png',
    
    // Wind / resistance scenes
    'wind': '/xp-scenes/wind_resistance.png',
    'resistance': '/xp-scenes/wind_resistance.png',
    'drag': '/xp-scenes/wind_resistance.png',
    'headwind': '/xp-scenes/wind_resistance.png',
    'atlantic': '/xp-scenes/wind_resistance.png',
    
    // Flight scenes
    'flight': '/xp-scenes/flight_attempt.png',
    'flying': '/xp-scenes/flight_attempt.png',
    'takeoff': '/xp-scenes/flight_attempt.png',
    'lift': '/xp-scenes/flight_attempt.png',
    'launch': '/xp-scenes/flight_attempt.png',
    'glider': '/xp-scenes/flight_attempt.png',
    'soar': '/xp-scenes/flight_attempt.png',
    
    // Force diagram / physics scenes
    'force': '/xp-scenes/force_diagram.png',
    'vector': '/xp-scenes/force_diagram.png',
    'diagram': '/xp-scenes/force_diagram.png',
    'net force': '/xp-scenes/force_diagram.png',
    'sigma': '/xp-scenes/force_diagram.png',
    'F=ma': '/xp-scenes/force_diagram.png',
    'newton': '/xp-scenes/force_diagram.png',
    
    // Wind tunnel / experiment scenes
    'experiment': '/xp-scenes/wing_experiment.png',
    'wind tunnel': '/xp-scenes/wing_experiment.png',
    'wing': '/xp-scenes/wing_experiment.png',
    'airflow': '/xp-scenes/wing_experiment.png',
    'tunnel': '/xp-scenes/wing_experiment.png',
    'notes': '/xp-scenes/wing_experiment.png',
    
    // Mass & acceleration scenes
    'mass': '/xp-scenes/mass_acceleration.png',
    'acceleration': '/xp-scenes/mass_acceleration.png',
    'heavy': '/xp-scenes/mass_acceleration.png',
    'heavier': '/xp-scenes/mass_acceleration.png',
    'cart': '/xp-scenes/mass_acceleration.png',
    'different masses': '/xp-scenes/mass_acceleration.png',
    
    // Dawn / establishing shot
    'dawn': '/xp-scenes/kitty_hawk_dawn.png',
    'sunrise': '/xp-scenes/kitty_hawk_dawn.png',
    'morning': '/xp-scenes/kitty_hawk_dawn.png',
    'december 17': '/xp-scenes/kitty_hawk_dawn.png',
    'kitty hawk': '/xp-scenes/kitty_hawk_dawn.png',
    'first day': '/xp-scenes/kitty_hawk_dawn.png',
    'horizon': '/xp-scenes/kitty_hawk_dawn.png',
    
    // Propeller / thrust scenes
    'propeller': '/xp-scenes/propeller_thrust.png',
    'thrust': '/xp-scenes/propeller_thrust.png',
    'engine': '/xp-scenes/propeller_thrust.png',
    'motor': '/xp-scenes/propeller_thrust.png',
    'chain': '/xp-scenes/propeller_thrust.png',
    'gear': '/xp-scenes/propeller_thrust.png',
};

/**
 * Find the best matching scene image for a given art prompt or scene description.
 * Uses keyword matching against the prompt text.
 * 
 * @param {string} artPrompt - The scene's art_prompt or narrative text
 * @returns {string|null} - Path to the image file, or null if no match
 */
export function resolveSceneImage(artPrompt) {
    if (!artPrompt) return null;
    
    const lowerPrompt = artPrompt.toLowerCase();
    
    // Try exact keyword matches, longest match first
    const sortedKeywords = Object.keys(SCENE_IMAGE_MAP).sort((a, b) => b.length - a.length);
    
    for (const keyword of sortedKeywords) {
        if (lowerPrompt.includes(keyword.toLowerCase())) {
            return SCENE_IMAGE_MAP[keyword];
        }
    }
    
    // Fallback: return workshop for any unmatched scene 
    return '/xp-scenes/workshop.png';
}

/**
 * Get all available scene images as an array.
 */
export function getAvailableScenes() {
    const uniquePaths = [...new Set(Object.values(SCENE_IMAGE_MAP))];
    return uniquePaths;
}

export default { resolveSceneImage, getAvailableScenes, SCENE_IMAGE_MAP };
