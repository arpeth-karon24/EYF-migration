/**
 * Cloudflare Pages Function: GET /api/newsletter-unsubscribe
 *
 * One-click unsubscribe endpoint. Every notification email contains a
 * personalised link: /api/newsletter-unsubscribe?email=xxx&token=yyy
 *
 * The token is HMAC-SHA256(email, NEWSLETTER_UNSUBSCRIBE_SECRET) so only
 * the server can produce valid unsubscribe links — no auth cookie needed.
 *
 * On success: returns a simple HTML confirmation page.
 * On invalid token: 403, to prevent unauthorised unsubscribes.
 */

import { unsubscribeEmail, generateUnsubscribeToken } from '../lib/newsletterSubscribers';

interface Env {
  NEWSLETTER_UNSUBSCRIBE_SECRET?: string;
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

const html = (body: string) =>
  new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Engage Youth Foundation</title>
    <style>
      body{margin:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f7f6f3;
           display:flex;align-items:center;justify-content:center;min-height:100vh;}
      .card{background:#fff;border-radius:12px;padding:48px 40px;max-width:440px;
            text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08);}
      h1{font-size:22px;color:#1c1c1c;margin:0 0 12px;}
      p{font-size:15px;color:#555;line-height:1.6;margin:0 0 24px;}
      a{display:inline-block;background:#e0be53;color:#1c1c1c;padding:12px 28px;
        border-radius:6px;font-weight:700;font-size:13px;text-decoration:none;
        letter-spacing:.8px;text-transform:uppercase;}
    </style></head><body><div class="card">${body}</div></body></html>`,
    { headers: { 'Content-Type': 'text/html;charset=UTF-8' } },
  );

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email')?.toLowerCase().trim();
  const token = url.searchParams.get('token');
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://engage-youth-web.pages.dev').replace(/\/$/, '');

  if (!email || !token) {
    return html(`
      <h1>Invalid link</h1>
      <p>This unsubscribe link is missing required parameters. Please use the link from your email.</p>
      <a href="${siteUrl}">Go to website</a>
    `);
  }

  // Verify token
  const secret = env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? 'fallback-secret';
  const expected = await generateUnsubscribeToken(email, secret);
  if (token !== expected) {
    return new Response(
      JSON.stringify({ error: 'Invalid unsubscribe token' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Unsubscribe
  const ok = await unsubscribeEmail(env, email);

  if (!ok) {
    return html(`
      <h1>Something went wrong</h1>
      <p>We couldn't process your unsubscribe request right now. Please try again later or
         <a href="mailto:admin@engage-youth.org" style="color:#e0be53;">contact us</a> directly.</p>
      <a href="${siteUrl}">Go to website</a>
    `);
  }

  return html(`
    <h1>You've been unsubscribed</h1>
    <p>Your email <strong>${email}</strong> has been removed from our newsletter list.
       You won't receive any further notification emails from us.</p>
    <p style="font-size:13px;color:#aaa;margin-bottom:24px;">
      Changed your mind? You can re-subscribe at any time via our website.
    </p>
    <a href="${siteUrl}">Go to website</a>
  `);
};
