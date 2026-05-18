/**
 * Newsletter Subscription Email Templates
 * User confirmation and admin notification emails
 */

import { baseEmailTemplate, createParagraph, createHighlight, createButton } from './baseTemplate';

/**
 * User confirmation email - Newsletter Subscription
 */
export function newsletterUserEmail(email: string): string {
  const content = `
    <h2>Welcome to Our Newsletter!</h2>
    ${createParagraph('Thank you for subscribing to the Engage Youth Fund newsletter!')}
    ${createHighlight('You will now receive updates about our programs, volunteer opportunities, events, and impact stories directly in your inbox.')}
    ${createParagraph('We are committed to keeping you informed about our mission to empower youth and build futures. Expect to hear from us regularly with inspiring stories and ways you can get involved.')}
    ${createButton('Visit Our Website', 'https://engage-youth.org')}
    ${createParagraph('If you ever wish to unsubscribe, simply click the unsubscribe link at the bottom of any newsletter email.')}
    ${createParagraph('Thank you for your support,<br>The Engage Youth Fund Team')}
  `;

  return baseEmailTemplate({
    content,
    title: 'Newsletter Subscription Confirmed',
    preheader: 'Welcome to EYF Newsletter',
  });
}

/**
 * Admin notification email - Newsletter Subscription
 */
export function newsletterAdminEmail(email: string, submittedAt: string): string {
  const content = `
    <h2>New Newsletter Subscriber</h2>
    ${createParagraph('A new subscriber has joined your mailing list.')}
    <div class="info-block">
      <strong>Email:</strong>
      <span>${email}</span>
    </div>
    <div class="info-block">
      <strong>Subscribed At:</strong>
      <span>${submittedAt}</span>
    </div>
    ${createParagraph('This subscriber has opted in to receive newsletter updates. Remember to comply with email marketing best practices and regulations.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New Newsletter Subscriber - Admin Notification',
    preheader: `New subscriber: ${email}`,
  });
}
