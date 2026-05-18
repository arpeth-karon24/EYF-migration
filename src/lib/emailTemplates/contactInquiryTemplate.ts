/**
 * Contact Inquiry Email Templates
 * User confirmation and admin notification emails
 */

import { baseEmailTemplate, createInfoBlock, createParagraph, createHighlight } from './baseTemplate';

/**
 * User confirmation email - Contact Form
 */
export function contactInquiryUserEmail(name: string, email: string): string {
  const content = `
    <h2>Thank You for Contacting Us</h2>
    ${createParagraph(`Hello ${name},`)}
    ${createParagraph('We have received your inquiry and appreciate you taking the time to reach out to Engage Youth Fund. Your message is important to us.')}
    ${createHighlight('Your inquiry has been submitted and our team will review it shortly. We typically respond within 1-2 business days.')}
    ${createInfoBlock('Your Email', email)}
    ${createParagraph('If you have any additional questions or information to share, feel free to reply to this email or contact us directly at admin@engage-youth.org')}
    ${createParagraph('Thank you for your interest in supporting youth empowerment!')}
    ${createParagraph('Best regards,<br>The Engage Youth Fund Team')}
  `;

  return baseEmailTemplate({
    content,
    title: 'Contact Inquiry Received',
    preheader: 'Thank you for contacting Engage Youth Fund',
  });
}

/**
 * Admin notification email - Contact Form
 */
export function contactInquiryAdminEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  submittedAt: string
): string {
  const content = `
    <h2>New Contact Inquiry Received</h2>
    ${createParagraph('A new contact inquiry has been submitted through the website.')}
    ${createInfoBlock('Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Subject', subject)}
    ${createInfoBlock('Message', message.substring(0, 500) + (message.length > 500 ? '...' : ''))}
    ${createInfoBlock('Submitted At', submittedAt)}
    ${createHighlight(`<a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}">Reply to ${name}</a>`)}
    ${createParagraph('This is an automated notification. Please handle this inquiry according to your standard procedures.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New Contact Inquiry - Admin Notification',
    preheader: `New inquiry from ${name}`,
  });
}
