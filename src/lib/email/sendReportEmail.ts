import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { wrapReportHtml } from './wrapReportHtml';

const DEFAULT_REPORT_TO = 'hello@looklyy.com';

export type SendReportResult =
  | { ok: true; provider: 'resend' | 'nodemailer'; messageId?: string }
  | { ok: false; error: string };

function getReportTo(): string {
  return (process.env.REPORT_EMAIL_TO || DEFAULT_REPORT_TO).trim();
}

function getReportFrom(): string | null {
  const from = process.env.REPORT_EMAIL_FROM?.trim();
  return from || null;
}

function buildSubject(reportType: string): string {
  const safe = reportType.replace(/[\r\n]+/g, ' ').slice(0, 120);
  return `[Looklyy] ${safe}`;
}

async function sendViaResend(
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<SendReportResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { ok: false, error: 'RESEND_API_KEY is not set' };
  }

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    return { ok: false, error: error.message || 'Resend send failed' };
  }

  return { ok: true, provider: 'resend', messageId: data?.id };
}

async function sendViaNodemailer(
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<SendReportResult> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return { ok: false, error: 'SMTP_HOST is not set' };
  }

  const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const secure =
    process.env.SMTP_SECURE === 'true' || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return { ok: true, provider: 'nodemailer', messageId: info.messageId };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Nodemailer send failed';
    return { ok: false, error: message };
  }
}

/**
 * Sends an HTML analytics report to hello@looklyy.com (or REPORT_EMAIL_TO).
 *
 * **Providers** (first match wins):
 * 1. `REPORT_EMAIL_PROVIDER=resend` or `RESEND_API_KEY` set → Resend
 * 2. `REPORT_EMAIL_PROVIDER=nodemailer` or `SMTP_HOST` set → Nodemailer
 *
 * **Env**
 * - `REPORT_EMAIL_FROM` — required (e.g. `Reports <reports@looklyy.com>` for Resend verified domain)
 * - `REPORT_EMAIL_TO` — optional, default `hello@looklyy.com`
 * - Resend: `RESEND_API_KEY`
 * - SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` (optional)
 */
export async function sendReportEmail(
  reportType: string,
  htmlContent: string,
): Promise<SendReportResult> {
  if (!reportType || typeof reportType !== 'string') {
    return { ok: false, error: 'reportType must be a non-empty string' };
  }
  if (typeof htmlContent !== 'string') {
    return { ok: false, error: 'htmlContent must be a string' };
  }

  const from = getReportFrom();
  if (!from) {
    return {
      ok: false,
      error: 'REPORT_EMAIL_FROM is not set (e.g. Reports <noreply@yourdomain.com>)',
    };
  }

  const to = getReportTo();
  const subject = buildSubject(reportType);
  const html = wrapReportHtml(reportType, htmlContent);

  const explicit = process.env.REPORT_EMAIL_PROVIDER?.toLowerCase().trim();

  if (explicit === 'nodemailer') {
    return sendViaNodemailer(from, to, subject, html);
  }
  if (explicit === 'resend') {
    return sendViaResend(from, to, subject, html);
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return sendViaResend(from, to, subject, html);
  }

  if (process.env.SMTP_HOST?.trim()) {
    return sendViaNodemailer(from, to, subject, html);
  }

  return {
    ok: false,
    error:
      'No email provider configured. Set RESEND_API_KEY or SMTP_HOST (or REPORT_EMAIL_PROVIDER).',
  };
}
