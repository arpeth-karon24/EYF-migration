'use client';

import { useState, FormEvent, type ReactNode } from 'react';
import { VOLUNTEER_REGISTRATION_EVENTS } from '@/constants/volunteerRegistration';

export default function VolunteerRegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    eventTitle: '',
    city: '',
    availability: '',
    skillsAndInterests: '',
    motivation: '',
    emergencyContact: '',
    agreeToGuidelines: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, typeof value === 'boolean' ? String(value) : value);
      });

      // Placeholder until a backend route exists
      await new Promise((r) => setTimeout(r, 400));

      setMessage({
        type: 'success',
        text: 'Thank you for registering! We received your application and will be in touch soon.',
      });
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        eventTitle: '',
        city: '',
        availability: '',
        skillsAndInterests: '',
        motivation: '',
        emergencyContact: '',
        agreeToGuidelines: false,
      });
      onSuccess?.();
    } catch {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again or contact us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-white/50 bg-[#0f0f0f] px-4 py-3 font-opensans text-white placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Full name" required>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Email" required>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Contact number" required>
        <input
          type="tel"
          name="contactNumber"
          placeholder="Phone number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Event title" required>
        <select
          name="eventTitle"
          value={formData.eventTitle}
          onChange={handleInputChange}
          required
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>
            Select an event or volunteering option
          </option>
          {VOLUNTEER_REGISTRATION_EVENTS.map((event) => (
            <option key={event.value} value={event.value} className="bg-[#1e1e1e] text-white">
              {event.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="City / location" required>
        <input
          type="text"
          name="city"
          placeholder="Where you are based"
          value={formData.city}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Availability" required>
        <input
          type="text"
          name="availability"
          placeholder="e.g. Weekends, weekday evenings, school holidays"
          value={formData.availability}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Skills and interests" required>
        <textarea
          name="skillsAndInterests"
          placeholder="Tell us about skills, experience, or areas you would like to contribute"
          rows={3}
          value={formData.skillsAndInterests}
          onChange={handleInputChange}
          required
          className={`${inputClass} min-h-[96px] resize-y`}
        />
      </FormField>

      <FormField label="Why do you want to volunteer with us?" required>
        <textarea
          name="motivation"
          placeholder="Share your motivation for joining Engage Youth Foundation"
          rows={4}
          value={formData.motivation}
          onChange={handleInputChange}
          required
          className={`${inputClass} min-h-[120px] resize-y`}
        />
      </FormField>

      <FormField label="Emergency contact name and number" required>
        <input
          type="text"
          name="emergencyContact"
          placeholder="Name and phone number"
          value={formData.emergencyContact}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </FormField>

      <div className="flex items-start gap-3 rounded-md border border-white/20 bg-black/30 p-4">
        <input
          type="checkbox"
          id="agreeToGuidelines"
          name="agreeToGuidelines"
          checked={formData.agreeToGuidelines}
          onChange={handleInputChange}
          required
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-eyf-gold"
        />
        <label
          htmlFor="agreeToGuidelines"
          className="cursor-pointer font-opensans text-sm leading-relaxed text-gray-300"
        >
          I have read and agree to follow the{' '}
          <span className="text-white">Volunteer Guidelines</span> on this page, including reliability,
          confidentiality, and professional conduct expectations.
          <span className="text-eyf-gold"> *</span>
        </label>
      </div>

      {message && (
        <div
          className={`rounded-md border p-4 text-sm font-opensans ${
            message.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
              : 'border-red-500/40 bg-red-950/40 text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-eyf-gold px-10 py-3 font-poppins text-sm font-bold uppercase tracking-wide text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? 'Submitting…' : 'Submit registration'}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-300">
          {label}
          {required && <span className="text-eyf-gold"> *</span>}
        </label>
      )}
      {children}
    </div>
  );
}
