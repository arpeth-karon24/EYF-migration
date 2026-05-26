/**
 * Newsletter Subscription Email Templates
 * User welcome + admin notification.
 */

import {
  baseEmailTemplate,
  createInfoBlock,
  createParagraph,
  createButton,
  createDivider,
  SITE_URL,
} from './baseTemplate';

/**
 * User confirmation / welcome email.
 */
export function newsletterUserEmail(email: string): string {
  const content = `
    <h2>Welcome to the EYF community 🌱</h2>
    ${createParagraph(
      `You're now subscribed to the Engage Youth Foundation newsletter. We'll keep you in the loop on programs, volunteer opportunities, events, and the stories of the youth we serve.`
    )}
    ${createParagraph(
      'Expect occasional emails — no spam, no daily blasts. Just meaningful updates from a community working to empower the next generation.'
    )}

    ${createInfoBlock('Subscribed email', email)}

    ${createDivider()}

    ${createParagraph('Want to start exploring now?')}
    ${createButton('Visit Our Website', SITE_URL)}

    ${createParagraph(
      `You can unsubscribe anytime using the link at the bottom of any newsletter we send.<br><br>Thanks for joining us,<br><strong>The Engage Youth Foundation Team</strong>`,
      true
    )}
  `;

  return baseEmailTemplate({
    content,
    title: 'Welcome to the EYF newsletter',
    preheader: 'Thanks for subscribing — here\'s what to expect.',
  });
}

/**
 * Admin notification email — sent to the EYF inbox.
 */
export function newsletterAdminEmail(email: string, submittedAt: string): string {
  const content = `
    <h2>New newsletter subscriber</h2>
    ${createParagraph('A new visitor has joined the newsletter list.')}

    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Subscribed at', submittedAt)}

    ${createParagraph('This subscriber has opted in via the website. Add them to your mailing tool of choice and remember to honor any unsubscribe requests promptly.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New newsletter subscriber',
    preheader: `New subscriber: ${email}`,
  });
}
