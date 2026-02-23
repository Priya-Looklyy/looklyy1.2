import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/db';

// Force Node.js runtime (not Edge) so Prisma can connect reliably
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let requestBody: any = null;

  try {
    // Parse request body safely
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format. Please ensure Content-Type is application/json.',
        },
        { status: 400 },
      );
    }

    const { email, phone } = requestBody;

    console.log('📨 API /waitlist POST request received:', {
      hasEmail: !!email,
      hasPhone: !!phone,
      emailLength: email?.length || 0,
      phoneLength: phone?.length || 0,
    });

    // Validate email input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required and must be a string' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 },
      );
    }

    // Basic phone validation (still collected, but not yet stored in DB)
    let trimmedPhone: string | null = null;
    if (phone && typeof phone === 'string') {
      trimmedPhone = phone.trim();
      const phoneDigits = trimmedPhone.replace(/\D/g, '');
      if (phoneDigits.length > 0 && (phoneDigits.length < 7 || phoneDigits.length > 16)) {
        return NextResponse.json(
          { success: false, error: 'Phone number must be between 7 and 16 digits' },
          { status: 400 },
        );
      }
      if (phoneDigits.length === 0) trimmedPhone = null;
    }

    // Write to Postgres via Prisma (Registration table)
    // We treat duplicate emails as success, so users can submit multiple times safely.
    try {
      await prisma.registration.upsert({
        where: { email: trimmedEmail },
        update: {
          updatedAt: new Date(),
        },
        create: {
          email: trimmedEmail,
        },
      });

      console.log('✅ Waitlist stored via Prisma Registration:', {
        email: trimmedEmail.substring(0, 10) + '...',
        phoneProvided: !!trimmedPhone,
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (dbError: any) {
      const message = dbError?.message ?? 'Unknown database error';
      const code = dbError?.code ?? 'UNKNOWN';

      // Unique constraint → already on waitlist, treat as success
      if (code === 'P2002' || message.toLowerCase().includes('unique')) {
        console.log('✅ Email already registered (Prisma unique):', trimmedEmail.substring(0, 10) + '...');
        return NextResponse.json({ success: true }, { status: 200 });
      }

      console.error('❌ Prisma waitlist insert failed:', { message, code });
      return NextResponse.json(
        { success: false, error: 'Database error while saving waitlist entry. Please try again.' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('❌ Unexpected error in /api/waitlist:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: requestBody
        ? {
            hasEmail: !!requestBody.email,
            hasPhone: !!requestBody.phone,
          }
        : null,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 },
    );
  }
}
