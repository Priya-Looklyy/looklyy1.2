/**
 * Escape text for safe insertion inside HTML text nodes.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Wraps caller-supplied HTML (tables, metrics) in a responsive, email-client-friendly shell.
 */
export function wrapReportHtml(reportType: string, htmlContent: string): string {
  const title = escapeHtml(reportType);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>Looklyy — ${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f6;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:28px 32px 8px;border-bottom:1px solid #ece1f4;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#8f1eae;letter-spacing:-0.02em;">Looklyy</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#6b6475;">Analytics report</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#111827;">${title}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="color:#374151;">
                ${htmlContent}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #f3e8ff;background-color:#faf7fc;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">This message was sent automatically. Reply to <a href="mailto:hello@looklyy.com" style="color:#8f1eae;">hello@looklyy.com</a> for questions.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Optional helper: build a simple metrics table for reports.
 */
export function buildMetricsTable(
  title: string,
  rows: { label: string; value: string | number }[],
): string {
  const safeTitle = escapeHtml(title);
  const body = rows
    .map(
      (r) => `<tr>
    <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#4b5563;">${escapeHtml(String(r.label))}</td>
    <td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600;color:#111827;text-align:right;">${escapeHtml(String(r.value))}</td>
  </tr>`,
    )
    .join('');

  return `
  <h3 style="margin:24px 0 12px;font-size:15px;font-weight:600;color:#374151;">${safeTitle}</h3>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
    <thead>
      <tr>
        <th style="padding:10px 14px;border:1px solid #e5e7eb;background-color:#f9fafb;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;">Metric</th>
        <th style="padding:10px 14px;border:1px solid #e5e7eb;background-color:#f9fafb;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;">Value</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
  </table>`;
}
