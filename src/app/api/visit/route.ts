import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory aggregation for current server process
const countryCounts = new Map<string, number>();

export async function POST(req: NextRequest) {
  const { pathname, language, timezone } = await req.json().catch(() => ({}));

  const headerIp = req.headers.get('x-forwarded-for');
  const ip =
    (Array.isArray(headerIp) ? headerIp[0] : headerIp) ??
    'unknown';

  const country = req.headers.get('x-vercel-ip-country') ?? 'unknown';
  const city = req.headers.get('x-vercel-ip-city') ?? 'unknown';
  const ua = req.headers.get('user-agent') ?? 'unknown';

  const key = country || 'unknown';
  countryCounts.set(key, (countryCounts.get(key) ?? 0) + 1);

  console.log('Visit event', {
    ip,
    country,
    city,
    pathname,
    language,
    timezone,
    ua,
  });

  return NextResponse.json({
    ok: true,
    countryCounts: Object.fromEntries(countryCounts),
  });
}

