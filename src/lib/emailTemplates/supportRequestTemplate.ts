/**
 * Volunteer Support Request Email Templates
 * User confirmation + admin notification.
 */

import {
  baseEmailTemplate,
  createInfoBlock,
  createParagraph,
  createHighlight,
  createDivider,
} from './baseTemplate';

/**
 * User confirmation email — sent to the person who requested volunteer support.
 */
export function supportRequestUserEmail(
  name: string,
  email: string,
  eventDate: string
): string {
  const content = `
    <h2>Your support request was received, ${name}</h2>
    ${createParagraph(
      `Thank you for reaching out to Engage Youth Foundation. We're honoured to consider supporting your event with volunteers from our community.`
    )}

    ${createHighlight('Our team will review your event details and respond within 1–2 business days to confirm volunteer availability and next steps.')}

    ${createInfoBlock('Event date', eventDate)}
    ${createInfoBlock('Confirmation sent to', email)}

    ${createDivider()}

    ${createParagraph(
      `If anything changes about your event — date, location, volunteer count — just reply to this email and we'll update your request.<br><br>Looking forward to making an impact together,<br><strong>The Engage Youth Foundation Team</strong>`,
      true
    )}
  `;

  return baseEmailTemplate({
    content,
    title: 'Support request received',
    preheader: `Thanks ${name} — we'll respond within 1–2 business days.`,
  });
}

/**
 * Admin notification email — sent to the EYF inbox.
 */
export function supportRequestAdminEmail(
  name: string,
  email: string,
  phone: string,
  date: string,
  time: string,
  location: string,
  volunteersNeeded: number,
  eventDescription: string,
  submittedAt: string
): string {
  const descTrim =
    eventDescription.length > 400
      ? `${eventDescription.substring(0, 400)}…`
      : eventDescription;

  const content = `
    <h2>New volunteer support request</h2>
    ${createParagraph('A new request for volunteer support has been submitted through the website.')}

    ${createInfoBlock('Requester name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Phone', phone)}
    ${createInfoBlock('Event date', date)}
    ${createInfoBlock('Event time', time)}
    ${createInfoBlock('Event location', location)}
    ${createInfoBlock('Volunteers needed', String(volunteersNeeded))}
    ${createInfoBlock('Event description', descTrim)}
    ${createInfoBlock('Submitted at', submittedAt)}

    ${createHighlight(
      `<a href="mailto:${email}?subject=EYF%20Volunteer%20Support%20Confirmation">→ Contact ${name} directly</a>`,
      true
    )}

    ${createParagraph('Review the request, gauge volunteer availability, and follow up with the requester to confirm participation.')}
  `;

  return baseEmailTemplate({
    content,
    title: `Support request from ${name}`,
    preheader: `Support request from ${name} — ${date}`,
  });
}
