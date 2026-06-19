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
      className="bg-[#07100b] px-4 py-24 md:px-8 md:py-32"
      id="contact"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#b6a98c]">Kontakt</p>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Fortell kort om prosjektet ditt.
          </h2>
          <p className="text-lg leading-8 text-stone-300">
            Skriv noen linjer om hva du trenger hjelp med, så tar vi samtalen videre.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          {submitSuccess ? (
            <div className="rounded-2xl border border-[#b6a98c]/30 bg-[#b6a98c]/10 p-4 text-center text-stone-100">
              <p>Takk for din henvendelse! Vi svarer deg så snart som mulig.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm text-stone-300">
                  Navn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border bg-black/20 p-3 text-white outline-none backdrop-blur transition-colors focus:border-[#b6a98c] ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                />
                {errors.name && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm text-stone-300">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border bg-black/20 p-3 text-white outline-none backdrop-blur transition-colors focus:border-[#b6a98c] ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                />
                {errors.email && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.email}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm text-stone-300">
                  Melding
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full resize-none rounded-2xl border bg-black/20 p-3 text-white outline-none backdrop-blur transition-colors focus:border-[#b6a98c] ${errors.message ? 'border-red-500' : 'border-white/10'}`}
                ></textarea>
                {errors.message && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#d8caa8] py-3 font-semibold text-[#10180f] transition-colors hover:bg-white disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#10180f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

