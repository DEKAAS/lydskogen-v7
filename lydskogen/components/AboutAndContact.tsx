'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function AboutAndContact() {
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
    <section className="py-16" id="contact" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* About section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>Hvem er Lydskog</h2>
            <div className="text-lg space-y-4" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
              <p>
                Lydskog er et kreativt studio som tilbyr profesjonelle lyd- og designtjenester for artister og skapere. 
                Med fokus på kvalitet og personlig tilnærming hjelper vi deg med å løfte dine prosjekter til et nytt nivå.
              </p>
              <p>
                Enten du trenger miksing av musikk, visuell identitet eller en komplett artistside, 
                er målet å skape en helhetlig og profesjonell opplevelse som reflekterer din unike stil og visjon.
              </p>
              <p>
                Bak Lydskog står en dedikert skaper med lidenskap for både lyd og visuelt design, 
                og med erfaring fra ulike kreative prosjekter.
              </p>
            </div>
            
            {/* This will be replaced with a real image later */}
            <div className="mt-8 h-64 rounded-lg flex items-center justify-center" style={{
              background: 'var(--glass-card)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--border-dark)',
              color: 'var(--text-on-dark)',
              opacity: 0.8
            }}>
              <p>Bilde kommer senere</p>
            </div>
          </motion.div>
          
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-lg p-6 border"
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>Kontakt</h2>
            
            {submitSuccess ? (
              <div className="p-4 rounded-md" style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--section-bg)'
              }}>
                <p>Takk for din henvendelse! Vi svarer deg så snart som mulig.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>Navn</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      background: 'var(--glass-card)',
                      backdropFilter: 'blur(10px)',
                      border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-dark)',
                      color: 'var(--text-on-dark)'
                    }}
                  />
                  {errors.name && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>E-post</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      background: 'var(--glass-card)',
                      backdropFilter: 'blur(10px)',
                      border: errors.email ? '1px solid #ef4444' : '1px solid var(--border-dark)',
                      color: 'var(--text-on-dark)'
                    }}
                  />
                  {errors.email && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.email}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>Melding</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded p-3 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                    style={{
                      background: 'var(--glass-card)',
                      backdropFilter: 'blur(10px)',
                      border: errors.message ? '1px solid #ef4444' : '1px solid var(--border-dark)',
                      color: 'var(--text-on-dark)'
                    }}
                  ></textarea>
                  {errors.message && <p className="text-sm mt-1" style={{color: '#ef4444'}}>{errors.message}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 font-semibold rounded transition-all duration-300 disabled:opacity-70 hover:scale-105"
                  style={{
                    background: 'var(--glass-section)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-on-dark)'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: 'var(--text-on-dark)'}}>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sender...
                    </span>
                  ) : 'Send melding'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 