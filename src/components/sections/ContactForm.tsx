'use client';

import { useState, FormEvent, useRef } from 'react';
import { User, Mail, Tag, MessageSquare } from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useTurnstile } from '@/hooks/useTurnstile';

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  submitButtonText?: string;
}

export default function ContactForm({
  onSubmit,
  submitButtonText = 'Send Message',
}: ContactFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(containerRef, 'light');
  const { isLoading, message, submit, clearMessage } = useFormSubmission({ endpoint: '/api/contact' });

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    const success = await submit(formData, turnstileToken);
    if (success) {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFile(null);
      resetTurnstile();
      if (onSubmit) {
        try {
          const data = new FormData();
          Object.entries(formData).forEach(([k, v]) => data.append(k, v));
          if (file) data.append('file', file);
          await onSubmit(data);
        } catch (err) {
          console.error('onSubmit callback error:', err);
        }
      }
    }
  };

  const base =
    'w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pr-4 font-opensans text-sm text-gray-700 placeholder:text-gray-400 transition-all focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200';

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + Email row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" placeholder="Your name" value={formData.name}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" placeholder="your@email.com" value={formData.email}
              onChange={handleInputChange} required className={`${base} pl-10`} />
          </div>
        </div>

        {/* Subject */}
        <div className="relative">
          <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" name="subject" placeholder="Subject" value={formData.subject}
            onChange={handleInputChange} required className={`${base} pl-10`} />
        </div>

        {/* Message */}
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <textarea name="message" placeholder="Write your message here…" rows={5}
            value={formData.message} onChange={handleInputChange} required
            className={`${base} min-h-[140px] resize-y pl-10`} />
        </div>

        {/* File upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-opensans text-sm font-semibold text-gray-500">
            Attach a file <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input type="file" onChange={handleFileChange}
            className="w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-200 file:px-5 file:py-2 file:text-xs file:font-bold file:text-gray-700 hover:file:bg-gray-300 transition-all" />
          {file && <span className="text-xs italic text-gray-400">{file.name}</span>}
        </div>

        {/* Turnstile */}
        <div ref={containerRef} className="flex justify-center py-2" />

        {/* Message */}
        {message && (
          <div className={`rounded-lg p-4 text-sm font-opensans border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center pt-1">
          <button type="submit" disabled={isLoading}
            className="rounded-full bg-[#111] px-12 py-4 font-poppins text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-all duration-300 hover:bg-[#337ab7] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? 'Sending...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
