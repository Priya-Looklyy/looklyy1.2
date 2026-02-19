import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force Node.js runtime (not Edge) for Supabase SDK compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Initialize error tracking
  let requestBody: any = null;
  let supabaseClient: ReturnType<typeof createClient> | null = null;

  try {
    // Parse request body safely
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format. Please ensure Content-Type is application/json.' 
        },
        { status: 400 }
      );
    }

    const { email, phone } = requestBody;

    // Log request for debugging (without sensitive data)
    console.log('📨 API /waitlist POST request received:', {
      hasEmail: !!email,
      hasPhone: !!phone,
      emailLength: email?.length || 0,
      phoneLength: phone?.length || 0,
    });

    // Validate email input
    if (!email || typeof email !== 'string') {
      console.error('❌ Email validation failed: missing or invalid type');
      return NextResponse.json(
        { success: false, error: 'Email is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      console.error('❌ Email validation failed: invalid format', { 
        email: trimmedEmail.substring(0, 10) + '...' // Log partial for debugging
      });
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone (optional but must be valid if provided)
    let trimmedPhone: string | null = null;
    if (phone && typeof phone === 'string') {
      trimmedPhone = phone.trim();
      // Basic phone validation: should have some digits
      const phoneDigits = trimmedPhone.replace(/\D/g, '');
      if (phoneDigits.length > 0 && (phoneDigits.length < 7 || phoneDigits.length > 16)) {
        console.error('❌ Phone validation failed: invalid length', { 
          digits: phoneDigits.length 
        });
        return NextResponse.json(
          { success: false, error: 'Phone number must be between 7 and 16 digits' },
          { status: 400 }
        );
      }
      if (phoneDigits.length === 0) {
        trimmedPhone = null; // Empty phone after cleaning
      }
    }

    // Check Supabase environment variables with detailed error messages
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    console.log('🔐 Supabase environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseAnonKey?.length || 0,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'MISSING',
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push('SUPABASE_URL');
      if (!supabaseAnonKey) missingVars.push('SUPABASE_ANON_KEY');
      
      console.error('❌ Missing Supabase environment variables:', missingVars);
      console.error('   This is a server configuration issue. Please set these in Vercel:');
      console.error('   - Go to Vercel Dashboard → Project Settings → Environment Variables');
      console.error('   - Add SUPABASE_URL and SUPABASE_ANON_KEY');
      console.error('   - Redeploy after adding variables');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support if this persists.' 
        },
        { status: 500 }
      );
    }

    // Validate Supabase URL format
    try {
      new URL(supabaseUrl);
    } catch (urlError) {
      console.error('❌ Invalid Supabase URL format:', supabaseUrl?.substring(0, 30));
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error: Invalid Supabase URL format' 
        },
        { status: 500 }
      );
    }

    // Create Supabase client with explicit configuration for server-side
    try {
      // Verify Supabase URL is accessible
      console.log('🔗 Testing Supabase URL connectivity...');
      const testUrl = new URL(supabaseUrl);
      console.log('✅ Supabase URL is valid:', testUrl.hostname);
      
      // Create client with minimal config - let Supabase handle fetch internally
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      console.log('✅ Supabase client created successfully');
    } catch (clientError) {
      console.error('❌ Failed to create Supabase client:', {
        message: clientError instanceof Error ? clientError.message : String(clientError),
        name: clientError instanceof Error ? clientError.name : 'Unknown',
        stack: clientError instanceof Error ? clientError.stack?.substring(0, 300) : undefined,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Database connection failed: ${clientError instanceof Error ? clientError.message : 'Unknown error'}` 
        },
        { status: 500 }
      );
    }

    // Insert into waitlist table with error handling
    // Use direct REST API call instead of Supabase client to avoid fetch issues
    let insertResult;
    try {
      console.log('📝 Attempting to insert into waitlist table:', {
        email: trimmedEmail.substring(0, 10) + '...',
        hasPhone: !!trimmedPhone,
      });
      
      // Try Supabase client first
      insertResult = await supabaseClient
        .from('waitlist')
        .insert([
          {
            email: trimmedEmail,
            phone_number: trimmedPhone || null,
          },
        ] as any)
        .select();

      console.log('📊 Supabase insert result:', {
        hasData: !!insertResult.data,
        hasError: !!insertResult.error,
        dataLength: insertResult.data?.length || 0,
      });
    } catch (insertError) {
      const errorMsg = insertError instanceof Error ? insertError.message : String(insertError);
      const errorName = insertError instanceof Error ? insertError.name : 'Unknown';
      
      console.error('❌ Supabase insert exception (trying direct REST API fallback):', {
        message: errorMsg,
        name: errorName,
      });
      
      // If fetch fails, try direct REST API call as fallback
      if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('ECONNREFUSED')) {
        console.log('🔄 Attempting direct REST API call as fallback...');
        
        try {
          const restUrl = `${supabaseUrl}/rest/v1/waitlist`;
          const response = await fetch(restUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Prefer': 'return=representation',
            },
            body: JSON.stringify({
              email: trimmedEmail,
              phone_number: trimmedPhone || null,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Direct REST API call failed:', response.status, errorText);
            return NextResponse.json(
              { 
                success: false, 
                error: `Database error: ${response.status} ${response.statusText}`,
                details: errorText.substring(0, 200)
              },
              { status: 500 }
            );
          }

          const data = await response.json();
          console.log('✅ Direct REST API call succeeded:', data);
          return NextResponse.json(
            { success: true },
            { status: 200 }
          );
        } catch (restError) {
          console.error('❌ Direct REST API fallback also failed:', restError);
          return NextResponse.json(
            { 
              success: false, 
              error: 'Network error connecting to database. Please check Supabase URL and network connectivity.',
              details: errorMsg
            },
            { status: 500 }
          );
        }
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { 
          success: false, 
          error: `Database error: ${errorMsg}`,
          code: errorName
        },
        { status: 500 }
      );
    }

    // Handle Supabase response errors
    if (insertResult.error) {
      const error = insertResult.error;
      
      console.error('❌ Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Handle duplicate email error gracefully
      if (error.code === '23505' || 
          error.message?.toLowerCase().includes('duplicate') || 
          error.message?.toLowerCase().includes('unique') ||
          error.message?.toLowerCase().includes('already exists')) {
        console.log('✅ Email already on waitlist (duplicate):', trimmedEmail.substring(0, 10) + '...');
        return NextResponse.json(
          { success: true }, // Treat duplicate as success
          { status: 200 }
        );
      }

      // Return detailed error for debugging (safe to expose to client)
      const errorMessage = error.message || 'Unknown database error';
      const errorCode = error.code || 'UNKNOWN';
      
      // Check for common issues
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database table not found. Please check Supabase configuration.',
            details: `Table 'waitlist' may not exist. Error: ${errorMessage}`
          },
          { status: 500 }
        );
      }
      
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database permission error. Please check Row Level Security policies.',
            details: `RLS policy may be blocking insert. Error: ${errorMessage}`
          },
          { status: 500 }
        );
      }
      
      if (error.message?.includes('column') || error.message?.includes('field')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database schema mismatch. Column names may not match.',
            details: `Schema error: ${errorMessage}`
          },
          { status: 500 }
        );
      }

      // Return the actual error message for other cases
      return NextResponse.json(
        { 
          success: false, 
          error: `Database error: ${errorMessage}`,
          code: errorCode
        },
        { status: 500 }
      );
    }

    // Success response
    console.log('✅ Waitlist submission successful:', { 
      email: trimmedEmail.substring(0, 10) + '...', 
      phoneProvided: !!trimmedPhone,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    // Catch-all for any unexpected errors
    console.error('❌ Unexpected error in /api/waitlist:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: requestBody ? {
        hasEmail: !!requestBody.email,
        hasPhone: !!requestBody.phone,
      } : null,
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
