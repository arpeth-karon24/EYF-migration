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
