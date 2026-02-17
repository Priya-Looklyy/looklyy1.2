import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    // Trim both values
    const trimmedEmail = email?.trim() || '';
    const trimmedPhone = phone?.trim() || '';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Validate phone: 7-15 digits (allow + and spaces)
    const cleanedPhone = trimmedPhone.replace(/[\s-]/g, '');
    const phoneDigits = cleanedPhone.startsWith('+') 
      ? cleanedPhone.slice(1).replace(/\D/g, '')
      : cleanedPhone.replace(/\D/g, '');
    
    if (!trimmedPhone || phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase)
    const normalizedEmail = trimmedEmail.toLowerCase();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('registrations')
      .select('email')
      .eq('email', normalizedEmail)
      .maybeSingle() as any;

    if (existing) {
      return NextResponse.json(
        { success: true, duplicate: true },
        { status: 200 }
      );
    }

    // Insert into Supabase
    const { data, error: insertError } = await supabase
      .from('registrations')
      .insert([
        {
          email: normalizedEmail,
          phone_number: trimmedPhone,
          updatedAt: new Date().toISOString(),
        },
      ] as any)
      .select();

    if (insertError) {
      // Handle duplicate email error from Supabase
      if (insertError.code === '23505' || insertError.message.includes('duplicate')) {
        return NextResponse.json(
          { success: true, duplicate: true },
          { status: 200 }
        );
      }

      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to process registration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
