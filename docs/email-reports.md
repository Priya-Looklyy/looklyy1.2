# Report emails (`sendReportEmail`)

## Usage

```ts
import { sendReportEmail, buildMetricsTable } from '@/lib/email';

const body = `
  ${buildMetricsTable('Summary', [
    { label: 'Unique visitors', value: 128 },
    { label: 'Form submissions', value: 12 },
  ])}
  <p style="margin-top:16px;color:#6b7280;">Additional notes…</p>
`;

const result = await sendReportEmail('Weekly analytics', body);
if (!result.ok) console.error(result.error);
```

Default recipient: **`hello@looklyy.com`**. Override with `REPORT_EMAIL_TO`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REPORT_EMAIL_FROM` | Yes | Sender, e.g. `Looklyy Reports <onboarding@resend.dev>` or your verified domain |
| `REPORT_EMAIL_TO` | No | Default `hello@looklyy.com` |
| `REPORT_EMAIL_PROVIDER` | No | `resend` or `nodemailer` (auto if only one of the keys below is set) |

**Resend**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |

**Nodemailer (SMTP)**

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP hostname |
| `SMTP_PORT` | Default `587` |
| `SMTP_USER` / `SMTP_PASS` | Auth (optional for some relays) |
| `SMTP_SECURE` | `true` for port 465 |

## Vercel

Add the same variables under **Project → Settings → Environment Variables** for production.
