'use client';

import { useState, FormEvent } from 'react';

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  submitButtonText?: string;
}

export default function ContactForm({
  onSubmit,
  submitButtonText = 'Send Message',
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) {
        data.append('file', file);
      }

      if (onSubmit) {
        await onSubmit(data);
      }

      setMessage({
        type: 'success',
        text: 'Thank you for your message. We will get back to you soon!',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFile(null);
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-4 bg-[#f9f9f9] border border-[#eee] rounded-md text-[#666] placeholder-gray-400 font-opensans focus:outline-none focus:border-[#337ab7] transition-colors"
          />
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Add email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-4 bg-[#f9f9f9] border border-[#eee] rounded-md text-[#666] placeholder-gray-400 font-opensans focus:outline-none focus:border-[#337ab7] transition-colors"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-4 bg-[#f9f9f9] border border-[#eee] rounded-md text-[#666] placeholder-gray-400 font-opensans focus:outline-none focus:border-[#337ab7] transition-colors resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-[#999] font-opensans text-sm font-semibold mb-1">
            Choose a file
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#eee] file:text-[#333] hover:file:bg-[#ddd] transition-all cursor-pointer"
          />
          <span className="text-xs text-gray-500 italic">
            {file ? file.name : "No file chosen."}
          </span>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-[#111] text-white font-poppins font-bold uppercase tracking-[0.15em] text-xs rounded-full hover:bg-[#337ab7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? 'Sending...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
