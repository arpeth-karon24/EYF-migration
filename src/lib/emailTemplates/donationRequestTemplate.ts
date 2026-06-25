/**
 * Donation Request Email Templates
 * User thank-you + admin notification.
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
 * User thank-you email — sent to the donor.
 */
export function donationUserEmail(
  name: string,
  email: string,
  donationType: string,
  siteUrl?: string
): string {
  const typeLabel = donationType === 'monetary' ? 'Monetary Donation' : 'In-Kind Donation';
  const currentSiteUrl = siteUrl || SITE_URL;

  const content = `
    <h2>Thank you for your generosity, ${name}</h2>
    ${createParagraph(`Your support means the world to us. Donations like yours directly fund the programs, mentorship, and community projects that empower the next generation of leaders.`)}

    ${createHighlight('Your donation request has been received. A team member will reach out within 1–2 business days to confirm details and coordinate logistics.')}

    ${createInfoBlock('Donation type', typeLabel)}
    ${createInfoBlock('Confirmation sent to', email)}

    ${createDivider()}

    ${createParagraph('Want to see the impact of your contribution? Learn about our current focus areas and community work:')}
    ${createButton('See Our Impact', `${currentSiteUrl.replace(/\/$/, '')}/about-us/`)}

    ${createParagraph(
      `Have questions before we connect? Reply to this email or write to <a href="mailto:admin@engage-youth.org">admin@engage-youth.org</a>.<br><br>With heartfelt gratitude,<br><strong>The Engage Youth Foundation Team</strong>`,
      true
    )}
  `;

  return baseEmailTemplate({
    content,
    title: 'Thank you for supporting EYF',
    preheader: `Your ${typeLabel.toLowerCase()} request was received.`,
    siteUrl,
  });
}

/**
 * Admin notification email — sent to the EYF inbox.
 */
export function donationAdminEmail(
  name: string,
  email: string,
  donationType: string,
  items: string | undefined,
  notes: string | undefined,
  submittedAt: string,
  siteUrl?: string
): string {
  const typeLabel = donationType === 'monetary' ? 'Monetary' : 'In-Kind';
  const itemsTrim = items
    ? items.length > 300
      ? `${items.substring(0, 300)}…`
      : items
    : null;
  const notesTrim = notes
    ? notes.length > 300
      ? `${notes.substring(0, 300)}…`
      : notes
    : null;

  const content = `
    <h2>New donation request</h2>
    ${createParagraph('A donation request has been submitted through the website.')}

    ${createInfoBlock('Donor name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Donation type', typeLabel)}
    ${itemsTrim ? createInfoBlock('Items / details', itemsTrim) : ''}
    ${notesTrim ? createInfoBlock('Additional notes', notesTrim) : ''}
    ${createInfoBlock('Submitted at', submittedAt)}

    ${createHighlight(
      `<a href="mailto:${email}?subject=EYF%20Donation%20Request%20Follow-up">→ Contact ${name} directly</a>`,
      true
    )}

    ${createParagraph('Please follow up to coordinate logistics and process the donation per standard procedures.')}
  `;

  return baseEmailTemplate({
    content,
    title: `New donation request from ${name}`,
    preheader: `${typeLabel} donation request from ${name}`,
    siteUrl,
  });
}
