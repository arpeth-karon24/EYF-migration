/**
 * Volunteer Support Request Email Templates
 * User confirmation and admin notification emails
 */

import { baseEmailTemplate, createInfoBlock, createParagraph, createHighlight } from './baseTemplate';

/**
 * User confirmation email - Support Request
 */
export function supportRequestUserEmail(name: string, email: string, eventDate: string): string {
  const content = `
    <h2>Support Request Received</h2>
    ${createParagraph(`Hello ${name},`)}
    ${createParagraph('Thank you for reaching out to Engage Youth Fund for volunteer support! We appreciate the opportunity to help with your event.')}
    ${createHighlight('Your support request has been received and our team will review your event details. We will be in touch within 1-2 business days to confirm volunteer availability and next steps.')}
    ${createInfoBlock('Event Date', eventDate)}
    ${createInfoBlock('Your Email', email)}
    ${createParagraph('We are excited to support your initiative and make a positive impact together. If you have any additional information to share, please feel free to reply to this email.')}
    ${createParagraph('Best regards,<br>The Engage Youth Fund Team')}
  `;

  return baseEmailTemplate({
    content,
    title: 'Support Request Received',
    preheader: 'Thank you for requesting volunteer support',
  });
}

/**
 * Admin notification email - Support Request
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
  const content = `
    <h2>New Volunteer Support Request</h2>
    ${createParagraph('A new request for volunteer support has been submitted.')}
    ${createInfoBlock('Requester Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Phone', phone)}
    ${createInfoBlock('Event Date', date)}
    ${createInfoBlock('Event Time', time)}
    ${createInfoBlock('Event Location', location)}
    ${createInfoBlock('Volunteers Needed', volunteersNeeded.toString())}
    ${createInfoBlock('Event Description', eventDescription.substring(0, 400) + (eventDescription.length > 400 ? '...' : ''))}
    ${createInfoBlock('Submitted At', submittedAt)}
    ${createHighlight(`<a href="mailto:${email}?subject=EYF Volunteer Support Confirmation">Contact ${name}</a>`)}
    ${createParagraph('Please review this request and determine volunteer availability. Follow up with the requester to confirm participation and provide any necessary details.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New Volunteer Support Request - Admin Notification',
    preheader: `Support request from ${name}`,
  });
}
