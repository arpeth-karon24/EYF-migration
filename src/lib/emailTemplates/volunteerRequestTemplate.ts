/**
 * Volunteer Registration Email Templates
 * User confirmation + admin notification.
 */

import {
  baseEmailTemplate,
  createInfoBlock,
  createParagraph,
  createHighlight,
  createButton,
  createDivider,
} from './baseTemplate';

/**
 * User confirmation email — sent to the new volunteer.
 */
export function volunteerRegistrationUserEmail(
  name: string,
  email: string,
  eventTitle: string
): string {
  const content = `
    <h2>Welcome to the EYF volunteer family, ${name} 🤝</h2>
    ${createParagraph(
      `Thank you for stepping up to make a difference. People like you are the heart of Engage Youth Foundation, and we're excited to have you on board.`
    )}

    ${createHighlight('Your registration has been received. Our team will review your application and reach out within 2–3 business days with next steps.')}

    ${createInfoBlock('Event / interest area', eventTitle)}
    ${createInfoBlock('Confirmation sent to', email)}

    ${createDivider()}

    ${createParagraph('Curious about what we do while you wait? Explore our current focus areas:')}
    ${createButton('Explore Our Work', 'https://engage-youth.org/about-us')}

    ${createParagraph(
      `Questions before then? Reach out anytime at <a href="mailto:admin@engage-youth.org">admin@engage-youth.org</a>.<br><br>With gratitude,<br><strong>The Engage Youth Foundation Team</strong>`,
      true
    )}
  `;

  return baseEmailTemplate({
    content,
    title: 'Welcome to the EYF volunteer team',
    preheader: `Thanks for joining, ${name}. We'll be in touch soon.`,
  });
}

/**
 * Admin notification email — sent to the EYF inbox.
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
  const skillsTrim = skills.length > 200 ? `${skills.substring(0, 200)}…` : skills;
  const motivTrim =
    motivation.length > 200 ? `${motivation.substring(0, 200)}…` : motivation;

  const content = `
    <h2>New volunteer registration</h2>
    ${createParagraph('A new volunteer has registered through the website.')}

    ${createInfoBlock('Name', name)}
    ${createInfoBlock('Email', email)}
    ${createInfoBlock('Phone', phone)}
    ${createInfoBlock('Event / interest area', eventTitle)}
    ${createInfoBlock('City', city)}
    ${createInfoBlock('Availability', availability)}
    ${createInfoBlock('Skills & interests', skillsTrim)}
    ${createInfoBlock('Motivation', motivTrim)}
    ${createInfoBlock('Submitted at', submittedAt)}

    ${createHighlight(
      `<a href="mailto:${email}?subject=Welcome%20to%20the%20EYF%20Volunteer%20Program">→ Contact ${name} directly</a>`,
      true
    )}

    ${createParagraph('Please review this application and onboard the volunteer per your standard process.')}
  `;

  return baseEmailTemplate({
    content,
    title: `New volunteer — ${name}`,
    preheader: `New volunteer registration from ${name}`,
  });
}
