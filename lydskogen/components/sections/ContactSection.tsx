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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // In MVP, we'll use mailto link
    // In future versions, this would be replaced with a real API call
    setTimeout(() => {
      window.location.href = `mailto:lydskog@proton.me?subject=Kontakt fra ${formData.name}&body=${formData.message}%0D%0A%0D%0AFra: ${formData.name}%0D%0AE-post: ${formData.email}`;
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <section
      className="py-16"
      id="contact"
      style={{
        backgroundColor: '#050605'
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: 'var(--text-color)'}}>
            Kontakt
          </h2>
          <p className="text-lg" style={{color: 'var(--text-muted)'}}>
            Ta kontakt for å diskutere ditt neste prosjekt
          </p>
        </div>

        <div className="rounded-lg p-8 border max-w-2xl mx-auto" style={{
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {submitSuccess ? (
            <div className="p-4 rounded-md text-center" style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)'
            }}>
              <p>Takk for din henvendelse! Vi svarer deg så snart som mulig.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2" style={{color: 'var(--text-color)', opacity: 0.9}}>
                  Navn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(10px)',
                    border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
                {errors.name && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2" style={{color: 'var(--text-color)', opacity: 0.9}}>
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(10px)',
                    border: errors.email ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
                {errors.email && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.email}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2" style={{color: 'var(--text-color)', opacity: 0.9}}>
                  Melding
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                  style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(10px)',
                    border: errors.message ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                ></textarea>
                {errors.message && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 font-semibold rounded transition-all duration-300 disabled:opacity-70 hover:opacity-90"
                style={{
                  background: 'var(--accent-green)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: 'var(--text-color)'}}>
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

