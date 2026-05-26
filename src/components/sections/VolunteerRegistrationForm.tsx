'use client';

import { useState, FormEvent, useRef, useMemo, useEffect, type ReactNode } from 'react';
import {
  User, Mail, Phone, Calendar, MapPin, Clock, Star, Heart, Shield, ChevronDown,
} from 'lucide-react';
import { VOLUNTEER_REGISTRATION_EVENTS } from '@/constants/volunteerRegistration';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useTurnstile } from '@/hooks/useTurnstile';
import type { SanityEvent } from '@/sanity/types';

interface VolunteerRegistrationFormProps {
  onSuccess?: () => void;
  /**
   * Upcoming events from Sanity. When provided, they populate the
   * "Event title" dropdown. Falls back to VOLUNTEER_REGISTRATION_EVENTS
   * constants when omitted or empty (e.g. on the older static path).
   */
  upcomingEvents?: SanityEvent[];
  /**
   * Pre-select an event in the "Event title" dropdown. Used when the
   * user arrives from a specific event's detail page so they don't have
   * to manually find/select the event again. If the ID doesn't match
   * any available option, this is silently ignored.
   */
  initialEventId?: string;
}

export default function VolunteerRegistrationForm({ onSuccess, upcomingEvents, initialEventId }: VolunteerRegistrationFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(containerRef, 'dark');
  const { isLoading, message, submit, clearMessage } = useFormSubmission({ endpoint: '/api/volunteer' });

  // ─── Build event-title dropdown options ─────────────────────────────────
  // Prefer live Sanity events when available. Always include the
  // "General volunteering" catch-all so non-event registrations still work.
  const eventOptions = useMemo(() => {
    if (upcomingEvents && upcomingEvents.length > 0) {
      return [
        ...upcomingEvents.map((evt) => ({
          value: evt._id,
          label: evt.title,
        })),
        { value: 'general', label: 'General volunteering (not tied to a specific event)' },
      ];
    }
    // Fallback to legacy hardcoded list
    return VOLUNTEER_REGISTRATION_EVENTS.map((o) => ({ value: o.value, label: o.label }));
  }, [upcomingEvents]);

  const [formData, setFormData] = useState({
    name: '', email: '', contactNumber: '',
    eventTitle: initialEventId ?? '',
    city: '', availability: '', skillsAndInterests: '',
    motivation: '', emergencyContact: '', agreeToGuidelines: false,
  });

  // If initialEventId arrives after first render (e.g. modal re-opened with
  // a different event), sync it into the dropdown. Only updates when the
  // prop changes AND the option actually exists in the current dropdown list.
  useEffect(() => {
    if (!initialEventId) return;
    const matches = eventOptions.some((o) => o.value === initialEventId);
    if (matches) {
      setFormData((prev) => ({ ...prev, eventTitle: initialEventId }));
    }
  }, [initialEventId, eventOptions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    const success = await submit(formData, turnstileToken);
    if (success) {
      setFormData({
        name: '', email: '', contactNumber: '', eventTitle: '',
        city: '', availability: '', skillsAndInterests: '',
        motivation: '', emergencyContact: '', agreeToGuidelines: false,
      });
      resetTurnstile();
      onSuccess?.();
    }
  };

  const base =
    'w-full rounded-lg border border-white/20 bg-white/5 py-3 pr-4 font-opensans text-sm text-white placeholder:text-gray-500 transition-all focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Name + Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="text" name="name" placeholder="Your full name" value={formData.name}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
        <Field label="Email" required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="email" name="email" placeholder="you@example.com" value={formData.email}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
      </div>

      {/* Contact number + City */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Contact number" required>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="tel" name="contactNumber" placeholder="+1 234 567 890" value={formData.contactNumber}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
        <Field label="City / location" required>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="text" name="city" placeholder="Where you are based" value={formData.city}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
      </div>

      {/* Event title */}
      <Field label="Event title" required>
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 z-10" />
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 z-10" />
          <select name="eventTitle" value={formData.eventTitle} onChange={handleInputChange} required
            className={`${base} cursor-pointer appearance-none pl-10`}>
            <option value="" disabled className="bg-[#1e1e1e] text-gray-500">Select an event or volunteering option</option>
            {eventOptions.map((event) => (
              <option key={event.value} value={event.value} className="bg-[#1e1e1e] text-white">
                {event.label}
              </option>
            ))}
          </select>
        </div>
      </Field>

      {/* Availability */}
      <Field label="Availability" required>
        <div className="relative">
          <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" name="availability"
            placeholder="e.g. Weekends, weekday evenings, school holidays"
            value={formData.availability} onChange={handleInputChange} required className={`${base} pl-10`} />
        </div>
      </Field>

      {/* Skills and interests */}
      <Field label="Skills and interests" required>
        <div className="relative">
          <Star className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <textarea name="skillsAndInterests"
            placeholder="Tell us about skills, experience, or areas you'd like to contribute"
            rows={3} value={formData.skillsAndInterests} onChange={handleInputChange} required
            className={`${base} min-h-[96px] resize-y pl-10`} />
        </div>
      </Field>

      {/* Motivation */}
      <Field label="Why do you want to volunteer with us?" required>
        <div className="relative">
          <Heart className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <textarea name="motivation"
            placeholder="Share your motivation for joining Engage Youth Foundation"
            rows={4} value={formData.motivation} onChange={handleInputChange} required
            className={`${base} min-h-[120px] resize-y pl-10`} />
        </div>
      </Field>

      {/* Emergency contact */}
      <Field label="Emergency contact name and number" required>
        <div className="relative">
          <Shield className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" name="emergencyContact" placeholder="Name and phone number"
            value={formData.emergencyContact} onChange={handleInputChange} required className={`${base} pl-10`} />
        </div>
      </Field>

      {/* Guidelines checkbox */}
      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <input type="checkbox" id="agreeToGuidelines" name="agreeToGuidelines"
          checked={formData.agreeToGuidelines} onChange={handleInputChange} required
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-eyf-gold" />
        <label htmlFor="agreeToGuidelines"
          className="cursor-pointer font-opensans text-sm leading-relaxed text-gray-300">
          I have read and agree to follow the{' '}
          <span className="text-white">Volunteer Guidelines</span> on this page, including
          reliability, confidentiality, and professional conduct expectations.
          <span className="text-eyf-gold"> *</span>
        </label>
      </div>

      {/* Turnstile */}
      <div ref={containerRef} className="flex justify-center py-2" />

      {/* Message */}
      {message && (
        <div className={`rounded-lg border p-4 text-sm font-opensans ${
          message.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100'
            : 'border-red-500/30 bg-red-950/40 text-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="pt-1">
        <button type="submit" disabled={isLoading}
          className="w-full rounded-lg bg-eyf-gold px-10 py-3 font-poppins text-sm font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
          {isLoading ? 'Submitting…' : 'Submit Registration'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-400">
        {label}{required && <span className="ml-0.5 text-eyf-gold"> *</span>}
      </label>
      {children}
    </div>
  );
}

