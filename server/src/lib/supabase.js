import { createClient } from '@supabase/supabase-js';

/**
 * @param {{ supabaseUrl: string; supabaseServiceKey: string }} config
 */
export function createSupabaseAdmin(config) {
  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * PostgreSQL unique violation (duplicate session_id)
 */
export function isUniqueViolation(error) {
  if (!error) return false;
  return error.code === '23505' || String(error.message || '').includes('duplicate key');
}
