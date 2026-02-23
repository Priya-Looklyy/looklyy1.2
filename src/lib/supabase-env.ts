/**
 * Resolve Supabase URL and anon key for server-side API routes.
 * Uses SUPABASE_URL / SUPABASE_ANON_KEY first, then falls back to
 * Project_URL / ANON_KEY (Vercel naming) and NEXT_PUBLIC_*.
 */
export function getSupabaseEnv(): {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
} {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.Project_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { supabaseUrl, supabaseAnonKey };
}
