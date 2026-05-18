/**
 * Volunteer Registration Email Templates
 * User confirmation and admin notification emails
 */

import { baseEmailTemplate, createInfoBlock, createParagraph, createHighlight } from './baseTemplate';

/**
 * User confirmation email - Volunteer Registration
 */
export function volunteerRegistrationUserEmail(name: string, email: string, eventTitle: string): string {
  const content = `
    <h2>Welcome to Our Volunteer Team!</h2>
    ${createParagraph(`Hello ${name},`)}
    ${createParagraph('Thank you for your interest in volunteering with Engage Youth Fund! We are thrilled to have passionate individuals like you who want to make a difference in youth empowerment.')}
    ${createHighlight('Your volunteer registration has been received and our team will review your application shortly. We will be in touch within 2-3 business days with next steps.')}
    ${createInfoBlock('Event Interest', eventTitle)}
    ${createInfoBlock('Your Email', email)}
    ${createParagraph('In the meantime, feel free to explore our website to learn more about our mission and ongoing programs. If you have any questions, please reach out to us at admin@engage-youth.org')}
    ${createParagraph('We look forward to having you join our volunteer community!')}
    ${createParagraph('Best regards,<br>The Engage Youth Fund Team')}
  `;

  return baseEmailTemplate({
    content,
    title: 'Volunteer Registration Confirmed',
    preheader: 'Thank you for registering to volunteer',
  });
}

/**
 * Admin notification email - Volunteer Registration
 */
export function volunteerRegistrationAdminEmail(
  name: string,
  email: string,
  phone: string,
  eventTitle: string,
  city: string,
  availability: string,
  skills: string,
  motivation: string,
  submittedAt: string
): string {
  const content = `
    <h2>New Volunteer Registration</h2>
    ${createParagraph('A new volunteer has registered for your program.')}
    ${createInfoBlock('Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Phone', phone)}
    ${createInfoBlock('Event Interest', eventTitle)}
    ${createInfoBlock('City', city)}
    ${createInfoBlock('Availability', availability)}
    ${createInfoBlock('Skills & Interests', skills.substring(0, 200) + (skills.length > 200 ? '...' : ''))}
    ${createInfoBlock('Motivation', motivation.substring(0, 200) + (motivation.length > 200 ? '...' : ''))}
    ${createInfoBlock('Submitted At', submittedAt)}
    ${createHighlight(`<a href="mailto:${email}?subject=Welcome to EYF Volunteer Program">Contact ${name}</a>`)}
    ${createParagraph('Please review this application and follow up with the volunteer according to your onboarding process.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New Volunteer Registration - Admin Notification',
    preheader: `New volunteer: ${name}`,
  });
}
