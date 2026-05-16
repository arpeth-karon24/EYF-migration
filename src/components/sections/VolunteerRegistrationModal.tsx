'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import VolunteerRegistrationForm from './VolunteerRegistrationForm';

interface VolunteerRegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VolunteerRegistrationModal({ open, onClose }: VolunteerRegistrationModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleEscape]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="volunteer-registration-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close registration form"
      />

      <div className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#1e1e1e] shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8">
          <div>
            <p className="mb-1 font-poppins text-xs font-bold uppercase tracking-[0.15em] text-eyf-gold">
              Volunteer with us
            </p>
            <h2
              id="volunteer-registration-title"
              className="font-poppins text-xl font-semibold text-white md:text-2xl"
            >
              Volunteer Registration
            </h2>
            <p className="mt-2 font-opensans text-sm leading-relaxed text-gray-400">
              Fill in your details below to register as a volunteer with Engage Youth Foundation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-7">
          <VolunteerRegistrationForm />
        </div>
      </div>
    </div>,
    document.body
  );
}
