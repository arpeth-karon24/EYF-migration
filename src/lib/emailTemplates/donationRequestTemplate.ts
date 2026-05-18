/**
 * Donation Request Email Templates
 * User thank-you and admin notification emails
 */

import { baseEmailTemplate, createInfoBlock, createParagraph, createHighlight, createButton } from './baseTemplate';

/**
 * User thank-you email - Donation Request
 */
export function donationUserEmail(name: string, email: string, donationType: string): string {
  const content = `
    <h2>Thank You for Your Generosity!</h2>
    ${createParagraph(`Hello ${name},`)}
    ${createParagraph('We are deeply grateful for your willingness to support Engage Youth Fund. Your generosity will directly impact the lives of young people we serve.')}
    ${createHighlight('Your donation request has been received and our team will be in touch shortly to discuss the details and logistics.')}
    ${createInfoBlock('Donation Type', donationType === 'monetary' ? 'Monetary Donation' : 'In-Kind Donation')}
    ${createInfoBlock('Your Email', email)}
    ${createParagraph('Your contribution will help us continue our mission of empowering youth and building futures. Together, we are making a difference!')}
    ${createButton('Learn More About Our Impact', 'https://engage-youth.org/about-us')}
    ${createParagraph('If you have any questions, please don\'t hesitate to reach out to us at admin@engage-youth.org')}
    ${createParagraph('With heartfelt gratitude,<br>The Engage Youth Fund Team')}
  `;

  return baseEmailTemplate({
    content,
    title: 'Donation Request Received',
    preheader: 'Thank you for supporting EYF',
  });
}

/**
 * Admin notification email - Donation Request
 */
export function donationAdminEmail(
  name: string,
  email: string,
  donationType: string,
  items: string | undefined,
  notes: string | undefined,
  submittedAt: string
): string {
  const content = `
    <h2>New Donation Request</h2>
    ${createParagraph('A new donation has been requested through the website.')}
    ${createInfoBlock('Donor Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Donation Type', donationType === 'monetary' ? 'Monetary' : 'In-Kind')}
    ${items ? createInfoBlock('Items/Details', items.substring(0, 300) + (items.length > 300 ? '...' : '')) : ''}
    ${notes ? createInfoBlock('Additional Notes', notes.substring(0, 300) + (notes.length > 300 ? '...' : '')) : ''}
    ${createInfoBlock('Submitted At', submittedAt)}
    ${createHighlight(`<a href="mailto:${email}?subject=EYF Donation Request Follow-up">Contact ${name}</a>`)}
    ${createParagraph('Please review this donation request and follow up with the donor to coordinate logistics and process the donation according to your procedures.')}
  `;

  return baseEmailTemplate({
    content,
    title: 'New Donation Request - Admin Notification',
    preheader: `New donation from ${name}`,
  });
}
