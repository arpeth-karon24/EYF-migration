/**
 * Contact Inquiry Email Templates
 * User confirmation + admin notification.
 */

import {
  baseEmailTemplate,
  createInfoBlock,
  createParagraph,
  createHighlight,
  createButton,
  createDivider,
  SITE_URL,
} from './baseTemplate';

/**
 * User confirmation email — sent to the person who filled the form.
 */
export function contactInquiryUserEmail(name: string, email: string, siteUrl?: string): string {
  const content = `
    <h2>Thank you for reaching out, ${name}</h2>
    ${createParagraph(`We've received your message and a member of the Engage Youth Foundation team will get back to you within 1–2 business days.`)}
    ${createHighlight('Your inquiry is in good hands. We review every message personally — no auto-replies after this one.')}

    ${createInfoBlock('Submitted by', name)}
    ${createInfoBlock('Reply will be sent to', email)}

    ${createDivider()}

    ${createParagraph('In the meantime, feel free to explore our work or get involved:')}
    ${createButton('Visit Our Website', siteUrl || SITE_URL)}

    ${createParagraph(
      `If you have anything else to add, just reply to this email — it goes straight to our team.<br><br>Warm regards,<br><strong>The Engage Youth Foundation Team</strong>`,
      true
    )}
  `;

  return baseEmailTemplate({
    content,
    title: 'We received your message',
    preheader: `Thanks ${name} — we'll be in touch shortly.`,
    siteUrl,
  });
}

/**
 * Admin notification email — sent to the EYF inbox.
 */
export function contactInquiryAdminEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  submittedAt: string,
  siteUrl?: string
): string {
  const truncated = message.length > 500 ? `${message.substring(0, 500)}…` : message;

  const content = `
    <h2>New contact inquiry</h2>
    ${createParagraph('A new contact form submission has come in from the website.')}

    ${createInfoBlock('Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Subject', subject)}
    ${createInfoBlock('Message', truncated)}
    ${createInfoBlock('Submitted at', submittedAt)}

    ${createHighlight(
      `<a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}">→ Reply to ${name} directly</a>`,
      true
    )}

    ${createParagraph('This is an automated notification from the website contact form.')}
  `;

  return baseEmailTemplate({
    content,
    title: `New inquiry — ${subject}`,
    preheader: `New contact inquiry from ${name}`,
    siteUrl,
  });
}
