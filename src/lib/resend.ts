export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  replyTo?: string;
  text?: string;
}

export async function sendEmail(
  options: EmailOptions,
  apiKey?: string
): Promise<{ id: string } | null> {
  if (!apiKey) {
    console.error('RESEND_API_KEY was not provided');
    return null;
  }

  const fromEmail = options.from || 'onboarding@resend.dev';

  const body: Record<string, unknown> = {
    from: fromEmail,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
  };

  if (options.replyTo) body.reply_to = options.replyTo;
  if (options.text) body.text = options.text;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as any;

    if (!res.ok) {
      console.error('Resend API error:', res.status, JSON.stringify(data));
      return null;
    }

    return data.id ? { id: data.id } : null;
  } catch (error) {
    console.error('Failed to send email:', error);
    return null;
  }
}

export async function sendBatchEmails(
  userEmail: EmailOptions,
  adminEmail: EmailOptions,
  apiKey?: string
): Promise<{ user: { id: string } | null; admin: { id: string } | null }> {
  const [userResult, adminResult] = await Promise.all([
    sendEmail(userEmail, apiKey),
    sendEmail(adminEmail, apiKey),
  ]);
  return { user: userResult, admin: adminResult };
}

export interface EmailResult {
  /** Primary recipient address extracted from EmailOptions.to */
  email: string;
  sent: boolean;
  error?: string;
}

/**
 * Send the same email to many recipients in batches of 100 via
 * Resend's /emails/batch endpoint.  Returns per-email results and
 * aggregate sent/failed counts.
 *
 * Each call handles up to 100 messages per HTTP request so even large
 * subscriber lists complete efficiently without hitting rate limits.
 */
export async function sendManyEmails(
  emails: EmailOptions[],
  apiKey?: string
): Promise<{ sent: number; failed: number; results: EmailResult[] }> {
  if (!apiKey || emails.length === 0) {
    return {
      sent: 0,
      failed: emails.length,
      results: emails.map((opt) => ({
        email: Array.isArray(opt.to) ? opt.to[0] : opt.to,
        sent: false,
        error: 'No API key',
      })),
    };
  }

  const BATCH = 100;
  const allResults: EmailResult[] = [];

  for (let i = 0; i < emails.length; i += BATCH) {
    const slice = emails.slice(i, i + BATCH);
    const body = slice.map((opt) => ({
      from: opt.from ?? 'onboarding@resend.dev',
      to: Array.isArray(opt.to) ? opt.to : [opt.to],
      subject: opt.subject,
      html: opt.html,
      ...(opt.replyTo ? { reply_to: opt.replyTo } : {}),
    }));

    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = (await res.json()) as { data?: Array<{ id?: string } | null> };
        const batchData = data.data ?? [];
        slice.forEach((opt, j) => {
          const addr = Array.isArray(opt.to) ? opt.to[0] : opt.to;
          if (batchData[j]?.id) {
            allResults.push({ email: addr, sent: true });
          } else {
            allResults.push({ email: addr, sent: false, error: 'No ID in Resend response' });
          }
        });
      } else {
        const err = await res.text().catch(() => '');
        console.error(`[resend] batch HTTP ${res.status}:`, err);
        slice.forEach((opt) => {
          const addr = Array.isArray(opt.to) ? opt.to[0] : opt.to;
          allResults.push({ email: addr, sent: false, error: `HTTP ${res.status}` });
        });
      }
    } catch (err) {
      console.error('[resend] batch send failed:', err);
      const msg = err instanceof Error ? err.message : 'Network error';
      slice.forEach((opt) => {
        const addr = Array.isArray(opt.to) ? opt.to[0] : opt.to;
        allResults.push({ email: addr, sent: false, error: msg });
      });
    }
  }

  const sent = allResults.filter((r) => r.sent).length;
  const failed = allResults.length - sent;
  return { sent, failed, results: allResults };
}
