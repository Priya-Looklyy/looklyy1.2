import { NextRequest, NextResponse } from 'next/server';

// In production, you'd use a database or email service
// For now, we'll log to console and return success
// You can integrate with services like:
// - Vercel Postgres
// - Supabase
// - SendGrid
// - Resend
// - etc.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Here you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Add to email marketing service (e.g., Mailchimp, ConvertKit)
    
    // For now, log the registration
    console.log('New registration:', { email, name, timestamp: new Date().toISOString() });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        // In production, you might return a user ID or confirmation token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process registration. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
