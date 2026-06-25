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
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed | Engage Youth Foundation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:wght@400;600&display=swap');
    body {
      margin: 0;
      font-family: 'Open Sans', sans-serif;
      background: #111111;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: #1a1a1a;
      border: 1px solid rgba(224, 190, 83, 0.2);
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 460px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #e0be53, #f3d078);
    }
    .icon-container {
      width: 64px;
      height: 64px;
      background: rgba(224, 190, 83, 0.1);
      border: 1px solid #e0be53;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .icon-container svg {
      width: 32px;
      height: 32px;
      color: #e0be53;
    }
    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 16px 0;
      letter-spacing: 0.5px;
    }
    p {
      font-size: 15px;
      color: #cccccc;
      line-height: 1.7;
      margin: 0 0 28px 0;
    }
    p strong {
      color: #e0be53;
      word-break: break-all;
    }
    .btn {
      display: inline-block;
      background: #e0be53;
      color: #111111;
      padding: 13px 32px;
      border-radius: 30px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(224, 190, 83, 0.3);
    }
    .btn:hover {
      background: #f3d078;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(224, 190, 83, 0.4);
    }
    .btn:active {
      transform: translateY(0);
    }
    .footer-note {
      font-size: 12px;
      color: #777777;
      margin-top: 24px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html;charset=UTF-8' } },
  );

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email')?.toLowerCase().trim();
  const token = url.searchParams.get('token');
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://engage-youth-web.pages.dev').trim().replace(/\/$/, '');

  if (!email || !token) {
    return html(`
      <div class="icon-container" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef4444" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1>Invalid Link</h1>
      <p>This unsubscribe link is missing required parameters. Please use the link from your email.</p>
      <a href="${siteUrl}" class="btn">Go to website</a>
    `);
  }

  // Verify token
  const secret = env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? 'fallback-secret';
  const expected = await generateUnsubscribeToken(email, secret);
  if (token !== expected) {
    return html(`
      <div class="icon-container" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef4444" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1>Invalid Link</h1>
      <p>This unsubscribe link is invalid or has expired. Please check your email and try again.</p>
      <a href="${siteUrl}" class="btn">Go to website</a>
    `);
  }

  // Unsubscribe
  const ok = await unsubscribeEmail(env, email);

  if (!ok) {
    return html(`
      <div class="icon-container" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef4444" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1>Something went wrong</h1>
      <p>We couldn't process your unsubscribe request right now. Please try again later or contact us at <a href="mailto:admin@engage-youth.org" style="color:#e0be53;">admin@engage-youth.org</a> directly.</p>
      <a href="${siteUrl}" class="btn">Go to website</a>
    `);
  }

  return html(`
    <div class="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h1>You've been unsubscribed</h1>
    <p>Your email <strong>${email}</strong> has been removed from our newsletter list. You won't receive any further notification emails from us.</p>
    <a href="${siteUrl}" class="btn">Go to website</a>
    <div class="footer-note">Changed your mind? You can resubscribe at any time via our website.</div>
  `);
};
