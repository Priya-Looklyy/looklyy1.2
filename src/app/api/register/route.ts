import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.registration.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already registered!',
          alreadyRegistered: true 
        },
        { status: 200 }
      );
    }

    // Save to database
    const registration = await prisma.registration.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
      },
    });

    console.log('New registration saved:', { 
      id: registration.id, 
      email: registration.email, 
      name: registration.name,
      timestamp: registration.createdAt 
    });

    // TODO: In production, you might want to:
    // 1. Send confirmation email (using Resend, SendGrid, etc.)
    // 2. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 3. Send webhook notification

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registration.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint error (duplicate email)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already registered!',
          alreadyRegistered: true 
        },
        { status: 200 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to process registration. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
