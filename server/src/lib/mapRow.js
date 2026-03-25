/**
 * Map validated API payload + request headers to DB row shape.
 * @param {import('../types.js').TrackPayload} data
 * @param {{ get: (h: string) => string | undefined }} req
 */
export function mapPayloadToVisitorLogRow(data, req) {
  const forwarded = req.get('x-forwarded-for');
  const serverIp = forwarded?.split(',')[0]?.trim() || req.get('x-real-ip') || null;

  const countryHeader = req.get('x-vercel-ip-country');
  const cityHeader = req.get('x-vercel-ip-city');

  const country =
    data.location.country ||
    (countryHeader ? decodeURIComponent(countryHeader) : null) ||
    null;
  const city =
    data.location.city || (cityHeader ? decodeURIComponent(cityHeader) : null) || null;

  const ip = data.ip && data.ip.length > 0 ? data.ip : serverIp;

  return {
    session_id: data.sessionId,
    visitor_id: data.visitorId.slice(0, 200),
    is_unique: data.isUnique,
    visit_timestamp: data.timestamp,
    time_spent: data.timeSpent,
    form_filled: data.formFilled,
    location_country: country ? country.slice(0, 128) : null,
    location_city: city ? city.slice(0, 256) : null,
    ip_address: ip ? ip.slice(0, 64) : null,
    page_url: data.pageUrl.slice(0, 2048),
  };
}
