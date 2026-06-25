'use client';

import { useState, FormEvent, useRef } from 'react';
import { User, Mail, Gift, Package, FileText, ChevronDown } from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useTurnstile } from '@/hooks/useTurnstile';

interface DonationFormProps {
  submitButtonText?: string;
}

export default function DonationForm({ submitButtonText = 'Submit Donation' }: DonationFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(containerRef, 'light');
  const { isLoading, message, submit, clearMessage } = useFormSubmission({ endpoint: '/api/donation' });

  const [formData, setFormData] = useState({
    name: '', email: '',
    donationType: 'monetary' as 'monetary' | 'in-kind',
    items: '', notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'name') {
      value = value.replace(/[0-9]/g, '');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    const success = await submit(formData, turnstileToken);
    if (success) {
      setFormData({ name: '', email: '', donationType: 'monetary', items: '', notes: '' });
      resetTurnstile();
    }
  };

  const base =
    'w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pr-4 font-opensans text-sm text-gray-700 placeholder:text-gray-400 transition-all focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200';

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-600">Name <span className="text-red-400">*</span></label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" placeholder="Your full name" value={formData.name}
                onChange={handleInputChange} required className={`${base} pl-10`} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-600">Email <span className="text-red-400">*</span></label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" placeholder="your@email.com" value={formData.email}
                onChange={handleInputChange} required className={`${base} pl-10`} />
            </div>
          </div>
        </div>

        {/* Donation type */}
        <div>
          <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-600">Donation Type <span className="text-red-400">*</span></label>
          <div className="relative">
            <Gift className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
            <select name="donationType" value={formData.donationType} onChange={handleInputChange} required
              className={`${base} cursor-pointer appearance-none pl-10`}>
              <option value="monetary">Monetary Donation</option>
              <option value="in-kind">In-Kind Donation (Items)</option>
            </select>
          </div>
        </div>

        {/* Items — conditional */}
        {formData.donationType === 'in-kind' && (
          <div>
            <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-600">Items or Details <span className="text-red-400">*</span></label>
            <div className="relative">
              <Package className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <textarea name="items" placeholder="Describe the items you'd like to donate"
                rows={4} value={formData.items} onChange={handleInputChange}
                required={formData.donationType === 'in-kind'}
                className={`${base} resize-none pl-10`} />
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-1.5 block font-opensans text-sm font-semibold text-gray-600">
            Additional Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <textarea name="notes" placeholder="Any other information we should know"
              rows={3} value={formData.notes} onChange={handleInputChange}
              className={`${base} resize-none pl-10`} />
          </div>
        </div>

        {/* Turnstile */}
        <div ref={containerRef} className="flex justify-center py-2" />

        {/* Message */}
        {message && (
          <div className={`rounded-lg border p-4 text-sm font-opensans ${
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
            {isLoading ? 'Processing...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
