import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    console.log('📨 API /waitlist received request:', { email: email ? 'provided' : 'missing', phone: phone ? 'provided' : 'not provided' });

    // Validate input
    if (!email || typeof email !== 'string') {
      console.error('❌ Email validation failed: email is missing or not a string');
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!emailRegex.test(trimmedEmail)) {
      console.error('❌ Email validation failed: invalid format', trimmedEmail);
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get Supabase credentials from server-side env vars
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

    console.log('🔐 Supabase config check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase environment variables not configured on server');
      console.error('   SUPABASE_URL:', supabaseUrl ? 'present' : 'MISSING');
      console.error('   SUPABASE_ANON_KEY:', supabaseAnonKey ? 'present' : 'MISSING');
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Prepare phone number (optional)
    const trimmedPhone = phone && typeof phone === 'string' ? phone.trim() : null;

    // Insert into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: trimmedEmail,
          phone_number: trimmedPhone || null,
        },
      ] as any)
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Handle duplicate email error gracefully
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        console.log('✅ Email already on waitlist (duplicate):', trimmedEmail);
        return NextResponse.json(
          { success: true }, // Treat duplicate as success
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message || 'Failed to submit waitlist. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Waitlist submission successful:', { 
      email: trimmedEmail, 
      phone: trimmedPhone ? 'provided' : 'not provided' 
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Unexpected error submitting waitlist:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage || 'Failed to submit. Please try again later.' },
      { status: 500 }
    );
  }
}
