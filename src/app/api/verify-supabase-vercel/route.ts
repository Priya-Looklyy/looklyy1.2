import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase-env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verification endpoint for Supabase ↔ Vercel (Looklyy.com).
 * Returns verified: true only when env, client, and a live table query all succeed.
 */
export async function GET() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  const projectIdMatch = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectId = projectIdMatch ? projectIdMatch[1] : null;

  const result = {
    verified: false,
    timestamp: new Date().toISOString(),
    site: 'Looklyy.com',
    checks: {
      envVars: false,
      urlValid: false,
      clientCreated: false,
      tableQuery: false,
    },
    projectId: projectId || 'unknown',
    reason: '',
    details: {} as Record<string, unknown>,
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    result.reason = 'Missing Supabase env. Set SUPABASE_URL + SUPABASE_ANON_KEY, or Project_URL + ANON_KEY.';
    result.details.action = 'Vercel Dashboard → Settings → Environment Variables → set for Production.';
    return NextResponse.json(result, { status: 200 });
  }

  result.checks.envVars = true;

  try {
    new URL(supabaseUrl);
    result.checks.urlValid = true;
  } catch {
    result.reason = 'Invalid SUPABASE_URL format.';
    return NextResponse.json(result, { status: 200 });
  }

  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    result.checks.clientCreated = true;
  } catch (e) {
    result.reason = 'Failed to create Supabase client.';
    result.details.error = e instanceof Error ? e.message : String(e);
    return NextResponse.json(result, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('id')
      .limit(1);

    if (error) {
      result.reason = 'Supabase table query failed (RLS, table missing, or network).';
      result.details.error = error.message;
      result.details.code = error.code;
      return NextResponse.json(result, { status: 200 });
    }
    result.checks.tableQuery = true;
    result.verified = true;
    result.reason = 'All checks passed. Supabase and Vercel connection verified.';
    result.details.note = 'Connection from Vercel serverless to Supabase is working.';
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    result.reason = 'Network or runtime error when querying Supabase (e.g. fetch failed, project paused).';
    result.details.error = e instanceof Error ? e.message : String(e);
    return NextResponse.json(result, { status: 200 });
  }
}
