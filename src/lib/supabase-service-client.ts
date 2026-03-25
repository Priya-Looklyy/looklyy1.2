/**
 * Supabase client with the **service role** key — server-side only.
 * Use for `visitor_logs` inserts/updates when RLS has no public policies.
 *
 * Env (Vercel / .env.local):
 *   SUPABASE_URL (or Project_URL / NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY — from Supabase → Project Settings → API (never expose to browser)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase-env';

export type VisitorLogInsert = {
  session_id?: string | null;
  visitor_id: string;
  is_unique: boolean;
  visit_timestamp?: string; // ISO 8601; omit to use DB default now()
  time_spent?: number;
  form_filled?: boolean;
  location_country?: string | null;
  location_city?: string | null;
  ip_address?: string | null;
  page_url?: string | null;
};

export type VisitorLogRow = VisitorLogInsert & {
  id: string;
  created_at: string;
};

/**
 * Returns null if URL or service role key is missing (caller should skip DB writes).
 */
export function getSupabaseServiceClient(): SupabaseClient | null {
  const { supabaseUrl } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Insert a visitor log row. Returns { data, error } from Supabase.
 */
export async function insertVisitorLog(row: VisitorLogInsert) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'),
    };
  }

  return supabase.from('visitor_logs').insert(row).select('id').single();
}

/**
 * Update time_spent (and optionally form_filled) for a row by id — e.g. after a beacon.
 */
export async function updateVisitorLogDuration(
  id: string,
  patch: { time_spent: number; form_filled?: boolean },
) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'),
    };
  }

  return supabase.from('visitor_logs').update(patch).eq('id', id).select('id').single();
}
