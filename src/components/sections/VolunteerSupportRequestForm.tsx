'use client';

import { useState, FormEvent } from 'react';

export default function VolunteerSupportRequestForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    volunteersNeeded: '',
    email: '',
    phone: '',
    eventDescription: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
    else setFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (file) data.append('file', file);

      // Placeholder until a backend route exists
      await new Promise((r) => setTimeout(r, 400));

      setMessage({
        type: 'success',
        text: 'Thank you. We received your request and will get back to you soon.',
      });
      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        volunteersNeeded: '',
        email: '',
        phone: '',
        eventDescription: '',
      });
      setFile(null);
    } catch {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again or email us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-white/50 bg-[#0f0f0f] px-4 py-3 font-opensans text-white placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          name="volunteersNeeded"
          placeholder="Number of volunteers needed"
          value={formData.volunteersNeeded}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <textarea
          name="eventDescription"
          placeholder="Event Description"
          rows={8}
          value={formData.eventDescription}
          onChange={handleInputChange}
          required
          className={`${inputClass} min-h-[200px] resize-y`}
        />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <label className="font-opensans text-sm font-semibold text-gray-400">Choose a file</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full cursor-pointer text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-2 file:text-xs file:font-bold file:text-black hover:file:bg-gray-200"
        />
        <span className="text-xs italic text-gray-500">{file ? file.name : 'No file chosen.'}</span>
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
          className="rounded-md bg-black px-10 py-3 font-poppins text-sm font-bold uppercase tracking-wide text-white ring-1 ring-white/20 transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
