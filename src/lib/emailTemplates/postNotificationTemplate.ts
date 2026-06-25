/**
 * Post-published notification email.
 * Sent to every active newsletter subscriber whenever a new
 * blog/news post is published in Sanity.
 */

import {
  baseEmailTemplate,
  createParagraph,
  createButton,
  createDivider,
} from './baseTemplate';

/**
 * @param postTitle   Title of the newly published post
 * @param postUrl     Absolute URL to the post on the live site
 * @param excerpt     Short plain-text excerpt (max ~200 chars)
 * @param unsubscribeUrl  HMAC-signed URL for one-click unsubscribe
 */
export function postNotificationEmail(
  postTitle: string,
  postUrl: string,
  excerpt: string,
  unsubscribeUrl: string,
  siteUrl?: string
): string {
  const safeTitle = postTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeExcerpt = excerpt
    ? excerpt.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : '';

  const content = `
    <h2>New from Engage Youth Foundation</h2>
    ${createParagraph('We just published something new — check it out:')}

    <!-- Post card -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:#f7f8fa; border-left:4px solid #e0be53; border-radius:6px;
             margin:20px 0; padding:0;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="font-size:17px; font-weight:700; color:#1c1c1c; margin:0 0 8px 0;
                    font-family:'Poppins','Helvetica Neue',Helvetica,Arial,sans-serif;
                    line-height:1.35;">
            ${safeTitle}
          </p>
          ${safeExcerpt
            ? `<p style="font-size:14px; color:#555; margin:0; line-height:1.65;">${safeExcerpt}&hellip;</p>`
            : ''}
        </td>
      </tr>
    </table>

    ${createButton('Read the full post', postUrl)}

    ${createDivider()}

    ${createParagraph(
      "You're receiving this because you subscribed to updates from Engage Youth Foundation."
    )}
    <p style="font-size:12px; color:#aaa; text-align:center; margin:4px 0 0 0;">
      <a href="${unsubscribeUrl}"
         style="color:#aaa; text-decoration:underline; font-size:12px;">
        Unsubscribe
      </a>
    </p>
  `;

  return baseEmailTemplate({
    content,
    title: `New post: ${postTitle}`,
    preheader: safeExcerpt
      ? `${postTitle} — ${safeExcerpt}`
      : `Check out our latest post: ${postTitle}`,
    siteUrl,
  });
}
