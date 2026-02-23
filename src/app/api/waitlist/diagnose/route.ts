import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase-env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  // Extract project ID from URL for verification
  const projectIdMatch = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectId = projectIdMatch ? projectIdMatch[1] : 'UNKNOWN';
  
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseAnonKey?.length || 0,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
      keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
      // Show full URL and project ID for verification
      urlFull: supabaseUrl || 'MISSING',
      projectId: projectId,
      expectedProjectId: 'czxyxvfbddjrxnykfghh',
      isCorrectProject: projectId === 'czxyxvfbddjrxnykfghh',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
    },
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      ...diagnostics,
      error: 'Missing environment variables',
      action: 'Set SUPABASE_URL + SUPABASE_ANON_KEY (or Project_URL + ANON_KEY) in Vercel → Settings → Environment Variables',
    }, { status: 500 });
  }

  // Test URL format
  try {
    const url = new URL(supabaseUrl);
    diagnostics.urlValidation = {
      valid: true,
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname,
    };
  } catch (urlError) {
    diagnostics.urlValidation = {
      valid: false,
      error: urlError instanceof Error ? urlError.message : String(urlError),
    };
    return NextResponse.json(diagnostics, { status: 500 });
  }

  // Test Supabase client creation
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    diagnostics.clientCreation = { success: true };
  } catch (clientError) {
    diagnostics.clientCreation = {
      success: false,
      error: clientError instanceof Error ? clientError.message : String(clientError),
    };
    return NextResponse.json(diagnostics, { status: 500 });
  }

  // Test REST API endpoint
  try {
    const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    const restUrl = `${baseUrl}/rest/v1/waitlist`;
    
    diagnostics.restApiTest = {
      url: restUrl,
      attempting: true,
    };

    const response = await fetch(`${baseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    diagnostics.restApiTest.response = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    };

    if (!response.ok) {
      const errorText = await response.text();
      diagnostics.restApiTest.error = errorText.substring(0, 500);
    }
  } catch (fetchError) {
    diagnostics.restApiTest = {
      ...diagnostics.restApiTest,
      error: {
        name: fetchError instanceof Error ? fetchError.name : 'Unknown',
        message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        stack: fetchError instanceof Error ? fetchError.stack?.substring(0, 500) : undefined,
      },
    };
  }

  // Test table query
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('waitlist')
      .select('id')
      .limit(1);

    diagnostics.tableQuery = {
      success: !error,
      hasData: !!data,
      error: error ? {
        message: error.message,
        code: error.code,
        details: error.details,
      } : null,
    };
  } catch (queryError) {
    diagnostics.tableQuery = {
      success: false,
      error: {
        name: queryError instanceof Error ? queryError.name : 'Unknown',
        message: queryError instanceof Error ? queryError.message : String(queryError),
      },
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
