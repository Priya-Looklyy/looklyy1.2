const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** @param {unknown} body */
export function validateTrackPayload(body) {
  if (body === null || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object', status: 400 };
  }

  const b = /** @type {Record<string, unknown>} */ (body);

  if (typeof b.visitorId !== 'string' || !UUID_RE.test(b.visitorId)) {
    return { ok: false, error: 'visitorId must be a valid UUID string', status: 400 };
  }

  if (typeof b.sessionId !== 'string' || !UUID_RE.test(b.sessionId)) {
    return {
      ok: false,
      error: 'sessionId must be a valid UUID string (one per page load for deduplication)',
      status: 400,
    };
  }

  if (typeof b.isUnique !== 'boolean') {
    return { ok: false, error: 'isUnique must be a boolean', status: 400 };
  }

  if (typeof b.timestamp !== 'string' || Number.isNaN(Date.parse(b.timestamp))) {
    return { ok: false, error: 'timestamp must be a valid ISO 8601 string', status: 400 };
  }

  if (typeof b.timeSpent !== 'number' || !Number.isFinite(b.timeSpent) || b.timeSpent < 0) {
    return { ok: false, error: 'timeSpent must be a non-negative number', status: 400 };
  }

  if (typeof b.formFilled !== 'boolean') {
    return { ok: false, error: 'formFilled must be a boolean', status: 400 };
  }

  if (typeof b.pageUrl !== 'string' || b.pageUrl.length === 0) {
    return { ok: false, error: 'pageUrl must be a non-empty string', status: 400 };
  }

  const loc = b.location;
  if (loc !== null && loc !== undefined && typeof loc !== 'object') {
    return { ok: false, error: 'location must be an object or omitted', status: 400 };
  }

  const country =
    loc && typeof /** @type {{ country?: unknown }} */ (loc).country === 'string'
      ? /** @type {{ country: string }} */ (loc).country
      : null;
  const city =
    loc && typeof /** @type {{ city?: unknown }} */ (loc).city === 'string'
      ? /** @type {{ city: string }} */ (loc).city
      : null;

  const ip = typeof b.ip === 'string' ? b.ip : null;

  return {
    ok: true,
    data: {
      visitorId: b.visitorId,
      sessionId: b.sessionId,
      isUnique: b.isUnique,
      timestamp: b.timestamp,
      timeSpent: Math.min(Math.floor(b.timeSpent), 864000),
      formFilled: b.formFilled,
      location: { country, city },
      ip,
      pageUrl: b.pageUrl,
    },
  };
}
