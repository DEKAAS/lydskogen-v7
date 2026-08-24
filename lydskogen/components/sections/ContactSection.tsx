'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Navn er påkrevd';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-post er påkrevd';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Ugyldig e-postadresse';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Melding er påkrevd';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Use real API call
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          source: 'Kontaktseksjon'
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert('Det oppstod en feil ved sending av e-post. Vennligst prøv igjen senere.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Det oppstod en feil ved sending av e-post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="bg-[#f4efe4] px-5 text-[#1d241d]"
      id="contact"
    >
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-[#d8caa8] py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Kontakt</p>
          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-[#1d241d] md:text-6xl">
            Fortell kort om prosjektet ditt.
          </h2>
          <p className="max-w-lg text-lg leading-8 text-[#4f5749]">
            Skriv noen linjer om hva du trenger hjelp med, så tar vi samtalen videre.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#d8caa8] bg-white/40 p-6 md:p-8">
          {submitSuccess ? (
            <div className="rounded-2xl border border-[#d8caa8] bg-[#eee6d5] p-4 text-center text-[#2d352b]">
              <p>Takk for din henvendelse! Vi svarer deg så snart som mulig.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm text-[#5c604f]">
                  Navn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-[#f8f3e8] p-3 text-[#1d241d] outline-none transition-colors focus:border-[#8a7d62] ${errors.name ? 'border-red-500' : 'border-[#d8caa8]'}`}
                />
                {errors.name && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm text-[#5c604f]">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-[#f8f3e8] p-3 text-[#1d241d] outline-none transition-colors focus:border-[#8a7d62] ${errors.email ? 'border-red-500' : 'border-[#d8caa8]'}`}
                />
                {errors.email && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.email}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm text-[#5c604f]">
                  Melding
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full resize-none rounded-xl border bg-[#f8f3e8] p-3 text-[#1d241d] outline-none transition-colors focus:border-[#8a7d62] ${errors.message ? 'border-red-500' : 'border-[#d8caa8]'}`}
                ></textarea>
                {errors.message && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#35412f] py-3 font-semibold text-[#f8f3e8] transition-colors hover:bg-[#4f5749] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#f8f3e8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sender...
                  </span>
                ) : 'Send melding'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

