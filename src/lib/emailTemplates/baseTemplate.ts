/**
 * Base Email Template
 * Professional, branded HTML email layout for all EYF transactional emails.
 *
 * Design notes:
 * - Built with <table>-based layout for maximum email-client compatibility
 *   (Outlook, Gmail, Apple Mail, Yahoo all render this consistently).
 * - All styling is inline or in <head> with web-safe fonts as fallbacks.
 * - Header mirrors the website nav: logo on the left + brand name + tagline.
 * - Gold accent bar matches the site's eyf-gold (#e0be53).
 * - Dark sections (#1c1c1c / #1f2024) match the live site.
 */

// Emails are opened in external clients (Gmail, Outlook, etc.) — so the
// logo URL must be ABSOLUTE. We point it at the live Cloudflare Pages site
// where /images/logo/eyf-logo.png is self-hosted.
//
// Note: this module is imported by Cloudflare Pages Functions (Workers),
// where `process` is not defined globally. We guard the env access so the
// same module works in both Node-style build environments and Workers.
export const SITE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) ||
  'https://engage-youth.org';
const SUPPORT_EMAIL = 'admin@engage-youth.org';
const BRAND_NAME = 'Engage Youth Foundation';
const BRAND_TAGLINE = 'Channelizing Freshness to the Community';

export interface EmailTemplateProps {
  content: string;
  title?: string;
  preheader?: string;
  footerText?: string;
  siteUrl?: string;
}

/**
 * Generate the full HTML email document.
 */
export function baseEmailTemplate(props: EmailTemplateProps): string {
  const currentYear = new Date().getFullYear();
  const {
    content,
    title = BRAND_NAME,
    preheader = '',
    footerText = `© ${currentYear} ${BRAND_NAME}. All rights reserved.`,
    siteUrl,
  } = props;

  const activeSiteUrl = (siteUrl || SITE_URL).replace(/\/$/, '');
  const logoUrl = 'https://engage-youth.org/images/logo/eyf-logo.png';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Base */
    body {
      background-color: #eef0f4;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #2b2f36;
    }
    a { color: #1f6feb; text-decoration: none; }

    /* Header — full WP-style logo lockup (matches site nav header) */
    /* Logo already has "Engage Youth Foundation" baked in; we only show
       the catchy caption beside it to avoid duplicating the brand name. */
    .brand-tagline {
      font-family: 'Poppins', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.6px;
      color: #e0be53;
      text-transform: uppercase;
      line-height: 1.45;
      margin: 0;
    }

    /* Content typography */
    .content h2 {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #1c1c1c;
      margin: 0 0 18px 0;
      line-height: 1.3;
    }
    .content p {
      font-size: 15px;
      line-height: 1.7;
      color: #3a3f48;
      margin: 0 0 14px 0;
    }
    .content strong { color: #1c1c1c; }

    /* Reusable blocks */
    .highlight {
      background-color: #fbf6e8;
      border-left: 4px solid #e0be53;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #4a4135;
    }
    .highlight p { margin: 0; color: #4a4135; font-size: 14px; }
    .highlight a { color: #b88f1f; font-weight: 600; }

    .info-block {
      background-color: #f7f8fa;
      padding: 14px 18px;
      margin: 10px 0;
      border-radius: 6px;
      border: 1px solid #e8eaee;
      font-size: 14px;
    }
    .info-block .label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #6e7480;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }
    .info-block .value {
      display: block;
      font-size: 14px;
      color: #1c1c1c;
      line-height: 1.5;
      word-break: break-word;
    }

    .btn-wrap { text-align: center; margin: 28px 0 18px 0; }
    .btn {
      display: inline-block;
      background-color: #e0be53;
      color: #1c1c1c !important;
      padding: 13px 32px;
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 6px;
    }

    .divider { border-top: 1px solid #e8eaee; margin: 24px 0; height: 1px; }

    /* Footer */
    .footer-text {
      font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.7;
      color: #b3b8c3;
      margin: 0;
    }
    .footer-link { color: #e0be53 !important; text-decoration: none; }
    .footer-link:hover { text-decoration: underline; }

    /* Responsive */
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .brand-tagline { font-size: 11px !important; letter-spacing: 1.2px !important; }
      .content h2 { font-size: 20px !important; }
      .header-logo { width: 180px !important; height: auto !important; }
      .header-logo-cell { width: 190px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef0f4;">

  <!-- Hidden preheader (preview text in inbox list) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#eef0f4;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#eef0f4">
    <tr>
      <td align="center" style="padding: 30px 12px;">

        <!-- Email container -->
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">

          <!-- ── HEADER ─────────────────────────────────────────── -->
          <!-- Big self-contained logo on dark nav background.
               The logo image already includes the "Engage Youth Foundation"
               wordmark, so we only show the catchy caption beside it. -->
          <tr>
            <td bgcolor="#1c1c1c" style="background-color:#1c1c1c; padding: 24px 32px;" class="px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td valign="middle" width="280" class="header-logo-cell" style="width:280px;">
                    <img src="${logoUrl}"
                         alt="${BRAND_NAME} — ${BRAND_TAGLINE}"
                         width="260"
                         class="header-logo"
                         style="display:block; width:260px; height:auto; max-width:260px; border:0; outline:none;" />
                  </td>
                  <td valign="middle" style="padding-left:20px;">
                    <p class="brand-tagline">${BRAND_TAGLINE}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold accent bar -->
          <tr>
            <td bgcolor="#e0be53" style="background-color:#e0be53; height:4px; line-height:4px; font-size:4px;">&nbsp;</td>
          </tr>

          <!-- ── CONTENT ────────────────────────────────────────── -->
          <tr>
            <td class="content px" style="padding: 36px 40px 28px 40px;">
              ${content}
            </td>
          </tr>

          <!-- ── FOOTER ─────────────────────────────────────────── -->
          <tr>
            <td bgcolor="#1f2024" style="background-color:#1f2024; padding: 28px 36px;" class="px" align="center">
              <p class="footer-text" style="margin-bottom:10px;">${escapeHtml(footerText)}</p>
              <p class="footer-text">
                <a class="footer-link" href="${activeSiteUrl}" style="color:#e0be53;">Website</a>
                &nbsp;·&nbsp;
                <a class="footer-link" href="mailto:${SUPPORT_EMAIL}" style="color:#e0be53;">Contact</a>
                &nbsp;·&nbsp;
                <a class="footer-link" href="${activeSiteUrl}/privacy-policy" style="color:#e0be53;">Privacy</a>
              </p>
              <p class="footer-text" style="margin-top:14px; color:#7d8290;">
                You're receiving this because you interacted with ${BRAND_NAME} on our website.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────────
 * Helper builders — used by individual templates to compose `content`
 * ────────────────────────────────────────────────────────────────────── */

/**
 * Label + value row.
 */
export function createInfoBlock(label: string, value: string): string {
  return `<div class="info-block">
    <span class="label">${escapeHtml(label)}</span>
    <span class="value">${escapeHtml(value)}</span>
  </div>`;
}

/**
 * Regular paragraph.
 * Pass `safe=true` for trusted HTML (e.g. <br>, links).
 */
export function createParagraph(text: string, safe = false): string {
  return `<p>${safe ? text : escapeHtml(text)}</p>`;
}

/**
 * Gold-accented call-out box.
 */
export function createHighlight(text: string, safe = false): string {
  return `<div class="highlight"><p>${safe ? text : escapeHtml(text)}</p></div>`;
}

/**
 * Centred gold CTA button.
 */
export function createButton(text: string, url: string): string {
  return `<div class="btn-wrap"><a href="${escapeAttr(url)}" class="btn" style="color:#1c1c1c;">${escapeHtml(text)}</a></div>`;
}

/**
 * Thin horizontal divider.
 */
export function createDivider(): string {
  return `<div class="divider"></div>`;
}

/* ──────────────────────────────────────────────────────────────────────
 * Escape helpers — prevent HTML injection from user-submitted data
 * ────────────────────────────────────────────────────────────────────── */

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(input: string): string {
  return String(input).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
