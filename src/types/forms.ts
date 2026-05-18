/**
 * Form Data Type Definitions
 * Matches the form fields collected from frontend components
 */

/**
 * Contact Form - From src/components/sections/ContactForm.tsx
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  file?: File | null;
  turnsileToken: string;
}

/**
 * Volunteer Registration Form - From src/components/sections/VolunteerRegistrationForm.tsx
 */
export interface VolunteerFormData {
  name: string;
  email: string;
  contactNumber: string;
  eventTitle: string;
  city: string;
  availability: string;
  skillsAndInterests: string;
  motivation: string;
  emergencyContact: string;
  agreeToGuidelines: boolean;
  turnsileToken: string;
}

/**
 * Newsletter Subscription - From src/components/footer/NewsletterSection.tsx
 */
export interface NewsletterFormData {
  email: string;
  turnsileToken: string;
}

/**
 * Donation Request - For donation page
 */
export interface DonationFormData {
  name: string;
  email: string;
  donationType: 'monetary' | 'in-kind';
  items?: string;
  notes?: string;
  turnsileToken: string;
}

/**
 * Volunteer Support Request - From src/components/sections/VolunteerSupportRequestForm.tsx
 */
export interface SupportRequestFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  volunteersNeeded: number;
  eventDescription: string;
  file?: File | null;
  turnsileToken: string;
}

/**
 * Admin email addresses for notifications
 */
export interface AdminNotificationData {
  recipientEmail: string;
  formType: 'contact' | 'volunteer' | 'newsletter' | 'donation' | 'support';
  submitterData: Record<string, unknown>;
  submittedAt: string;
}
