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
      // Use minimal config - let Supabase handle defaults
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
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
    let insertResult;
    try {
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
      console.error('❌ Supabase insert exception:', {
        message: insertError instanceof Error ? insertError.message : String(insertError),
        name: insertError instanceof Error ? insertError.name : 'Unknown',
        stack: insertError instanceof Error ? insertError.stack?.substring(0, 200) : undefined,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save your information. Please try again later.' 
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

      // Handle other database errors
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save your information. Please try again later.' 
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
