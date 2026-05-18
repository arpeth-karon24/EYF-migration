/**
 * Email Templates Export Index
 * Centralized export of all email templates
 */

export { baseEmailTemplate, createInfoBlock, createParagraph, createHighlight, createButton } from './baseTemplate';

export {
  contactInquiryUserEmail,
  contactInquiryAdminEmail,
} from './contactInquiryTemplate';

export {
  volunteerRegistrationUserEmail,
  volunteerRegistrationAdminEmail,
} from './volunteerRequestTemplate';

export {
  newsletterUserEmail,
  newsletterAdminEmail,
} from './newsletterTemplate';

export {
  donationUserEmail,
  donationAdminEmail,
} from './donationRequestTemplate';

export {
  supportRequestUserEmail,
  supportRequestAdminEmail,
} from './supportRequestTemplate';
