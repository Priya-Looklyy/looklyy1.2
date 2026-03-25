import { NextRequest, NextResponse } from 'next/server';
import { insertVisitorLog } from '@/lib/supabase-service-client';

export const runtime = 'nodejs';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TrackPayload = {
  visitorId?: string;
  sessionId?: string;
  isUnique?: boolean;
  timestamp?: string;
  timeSpent?: number;
  formFilled?: boolean;
  location?: { country?: string | null; city?: string | null };
  ip?: string | null;
  pageUrl?: string | null;
};

function parseBody(req: NextRequest): Promise<TrackPayload | null> {
  return req
    .json()
    .then((b) => b as TrackPayload)
    .catch(() => null);
}

function isUniqueViolation(err: { code?: string; message?: string }) {
  return err.code === '23505' || String(err.message || '').includes('duplicate key');
}

/**
 * POST /track — visitor analytics (same shape as public/analytics/looklyy-track.js)
 */
export async function POST(req: NextRequest) {
  const body = await parseBody(req);
  if (!body || typeof body.visitorId !== 'string' || !UUID_RE.test(body.visitorId)) {
    return NextResponse.json({ success: false, error: 'invalid visitorId' }, { status: 400 });
  }
  if (typeof body.sessionId !== 'string' || !UUID_RE.test(body.sessionId)) {
    return NextResponse.json({ success: false, error: 'invalid sessionId' }, { status: 400 });
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const serverIp =
    forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;

  const countryHeader = req.headers.get('x-vercel-ip-country');
  const cityHeader = req.headers.get('x-vercel-ip-city');

  const country =
    body.location?.country ||
    (countryHeader ? decodeURIComponent(countryHeader) : null) ||
    null;
  const city =
    body.location?.city || (cityHeader ? decodeURIComponent(cityHeader) : null) || null;

  const ip = typeof body.ip === 'string' && body.ip.length > 0 ? body.ip : serverIp;

  const visitTimestamp =
    typeof body.timestamp === 'string' && !Number.isNaN(Date.parse(body.timestamp))
      ? body.timestamp
      : new Date().toISOString();

  const timeSpent =
    typeof body.timeSpent === 'number' && Number.isFinite(body.timeSpent)
      ? Math.min(Math.max(0, Math.floor(body.timeSpent)), 864000)
      : 0;

  const row = {
    session_id: body.sessionId,
    visitor_id: body.visitorId.slice(0, 200),
    is_unique: Boolean(body.isUnique),
    visit_timestamp: visitTimestamp,
    time_spent: timeSpent,
    form_filled: Boolean(body.formFilled),
    location_country: country ? country.slice(0, 128) : null,
    location_city: city ? city.slice(0, 256) : null,
    ip_address: ip ? ip.slice(0, 64) : null,
    page_url: typeof body.pageUrl === 'string' ? body.pageUrl.slice(0, 2048) : null,
  };

  const result = await insertVisitorLog(row);
  if (result.error) {
    const msg = result.error.message || '';
    if (msg.includes('Missing SUPABASE_URL') || msg.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ success: true, persisted: false }, { status: 200 });
    }
    if (isUniqueViolation(result.error as { code?: string; message?: string })) {
      return NextResponse.json(
        { success: true, duplicate: true, message: 'Session already recorded' },
        { status: 200 },
      );
    }
    console.error('[track]', result.error);
    return NextResponse.json({ success: false, error: 'persist_failed' }, { status: 503 });
  }

  return NextResponse.json({ success: true, persisted: true, duplicate: false }, { status: 200 });
}
