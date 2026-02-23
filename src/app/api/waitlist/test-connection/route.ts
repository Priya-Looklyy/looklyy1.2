import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase-env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing environment variables',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });
  }

  try {
    // Test URL format
    const url = new URL(supabaseUrl);
    
    // Test Supabase client creation
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test a simple query to verify connectivity
    const { data, error } = await supabase
      .from('waitlist')
      .select('id')
      .limit(1);

    return NextResponse.json({
      success: true,
      url: {
        hostname: url.hostname,
        protocol: url.protocol,
        valid: true,
      },
      connection: {
        clientCreated: true,
        queryTest: error ? {
          success: false,
          error: error.message,
          code: error.code,
        } : {
          success: true,
          dataReceived: !!data,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
    });
  }
}
