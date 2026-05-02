import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase credentials not configured.\n' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.\n' +
        'Auth and data services will operate in mock/offline mode.'
    );
}

// Only create a real client if credentials exist; otherwise a stub that won't accidentally connect.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://localhost.invalid', 'offline-stub');

/**
 * Check if Supabase is properly configured for live operations.
 */
export const isSupabaseLive = () => !!(supabaseUrl && supabaseAnonKey);

/**
 * Fetch a user's full profile (with franchise/center bindings).
 */
export const getCurrentProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            franchise:franchises(id, name, slug, operating_config),
            center:centers(id, name)
        `)
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};
