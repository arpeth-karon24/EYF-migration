'use client';

import { useState, FormEvent, useRef } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, MapPin, Users, FileText,
} from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useTurnstile } from '@/hooks/useTurnstile';

export default function VolunteerSupportRequestForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(containerRef, 'dark');
  const { isLoading, message, submit, clearMessage } = useFormSubmission({ endpoint: '/api/support' });

  const [formData, setFormData] = useState({
    name: '', date: '', time: '', location: '',
    volunteersNeeded: '', email: '', phone: '', eventDescription: '',
  });
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'name') {
      value = value.replace(/[0-9]/g, '');
    } else if (name === 'phone') {
      value = value.replace(/[^0-9+\-\(\)\s]/g, '');
    } else if (name === 'volunteersNeeded') {
      value = value.replace(/[^0-9]/g, '');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    const success = await submit(
      {
        ...formData,
        time: formData.time ? `${formData.time} ${ampm}` : '',
        volunteersNeeded: parseInt(formData.volunteersNeeded, 10) || 0,
      },
      turnstileToken,
    );
    if (success) {
      setFormData({ name: '', date: '', time: '', location: '', volunteersNeeded: '', email: '', phone: '', eventDescription: '' });
      setAmpm('AM');
      setFile(null);
      resetTurnstile();
    }
  };

  const base =
    'w-full rounded-lg border border-white/20 bg-white/5 py-3 pr-4 font-opensans text-sm text-white placeholder:text-gray-500 transition-all focus:border-white/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Name */}
      <Field label="Full name" required>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" name="name" placeholder="Your full name" value={formData.name}
            onChange={handleInputChange} required className={`${base} pl-10`} />
        </div>
      </Field>

      {/* Date + Time row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Event date" required>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="date" name="date" value={formData.date}
              onChange={handleInputChange} required
              className={`${base} pl-10 [color-scheme:dark]`} />
          </div>
        </Field>
        <Field label="Event time" required>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="time" name="time" value={formData.time}
                onChange={handleInputChange} required
                className={`${base} pl-10 [color-scheme:dark]`} />
            </div>
            <div className="flex overflow-hidden rounded-lg border border-white/20">
              {(['AM', 'PM'] as const).map((period) => (
                <button key={period} type="button" onClick={() => setAmpm(period)}
                  className={`px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider transition-all ${
                    ampm === period
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}>
                  {period}
                </button>
              ))}
            </div>
          </div>
        </Field>
      </div>

      {/* Location */}
      <Field label="Location" required>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" name="location" placeholder="Event venue or address" value={formData.location}
            onChange={handleInputChange} required className={`${base} pl-10`} />
        </div>
      </Field>

      {/* Volunteers needed */}
      <Field label="Volunteers needed" required>
        <div className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="number" name="volunteersNeeded" placeholder="e.g. 10" min={1}
            value={formData.volunteersNeeded} onChange={handleInputChange} required
            className={`${base} pl-10`} />
        </div>
      </Field>

      {/* Email + Phone row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="email" name="email" placeholder="you@example.com" value={formData.email}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
        <Field label="Phone" required>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="tel" name="phone" placeholder="+1 234 567 890" value={formData.phone}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </Field>
      </div>

      {/* Event description */}
      <Field label="Event description" required>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <textarea name="eventDescription" placeholder="Describe the event and what support you need…"
            rows={5} value={formData.eventDescription} onChange={handleInputChange} required
            className={`${base} min-h-[140px] resize-y pl-10`} />
        </div>
      </Field>

      {/* File upload */}
      <div className="flex flex-col gap-1.5">
        <label className="font-opensans text-sm font-semibold text-gray-400">
          Attach a file <span className="font-normal text-gray-600">(optional)</span>
        </label>
        <input type="file" onChange={handleFileChange}
          className="w-full cursor-pointer text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-5 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-white/20" />
        {file && <span className="text-xs text-gray-500 italic">{file.name}</span>}
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
          className="rounded-lg bg-white px-10 py-3 font-poppins text-sm font-bold uppercase tracking-wider text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? 'Sending…' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-400">
        {label}{required && <span className="ml-0.5 text-eyf-gold"> *</span>}
      </label>
      {children}
    </div>
  );
}
