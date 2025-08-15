'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Genre } from '@/data/genres';
import { useState } from 'react';

interface InlineGenrePanelProps {
  genre: Genre | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  total?: number;
}

export default function InlineGenrePanel({ genre, onClose, onPrev, onNext, currentIndex, total }: InlineGenrePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const updateField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          genre: genre.title,
          priceOption: `Estimat: ${genre.pricing.basic} kr (pris avhenger av omfang)`,
          source: 'InlineGenrePanel'
        })
      });
      if (!res.ok) throw new Error('Kunne ikke sende skjema');
      setSubmitResult('Takk! Vi tar kontakt snart.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSubmitResult('Noe gikk galt. Prøv igjen om litt.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AnimatePresence>
      {genre && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full overflow-hidden"
        >
          <div className="mt-6 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
               style={{ background: 'var(--glass-card)' }}>
            {/* Header with navigation */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{genre.title}</h3>
                <p className="text-gray-300 mt-1">{genre.shortDescription}</p>
                {typeof currentIndex === 'number' && typeof total === 'number' && (
                  <p className="text-xs text-gray-400 mt-1">{currentIndex + 1} av {total}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onPrev && (
                  <button
                    onClick={onPrev}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                    aria-label="Forrige"
                  >
                    ‹
                  </button>
                )}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                    aria-label="Neste"
                  >
                    ›
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Lukk panel"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full mb-6" style={{ background: 'var(--border-dark)' }} />

            {/* Demo-lister fjernet i booking-panelet */}

            {/* Tilpasset produksjon */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-lg" style={{
                background: 'var(--glass-section)',
                border: '1px solid var(--border-light)'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <span className="text-lg text-white font-medium">Tilpasset Produksjon</span>
                      <div className="text-sm text-gray-400">Skreddersydd musikk for ditt prosjekt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-gray-300">Fra 1200 kr</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 text-sm">
                  Vi lager en unik låt spesielt tilpasset ditt prosjekt med profesjonell kvalitet og kreativt fokus.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Navn</label>
                  <input name="name" value={formData.name} onChange={updateField}
                    required
                    className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none" placeholder="Ditt navn" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">E‑post</label>
                  <input name="email" type="email" value={formData.email} onChange={updateField}
                    required
                    className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none" placeholder="din@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Telefon</label>
                  <input name="phone" value={formData.phone} onChange={updateField}
                    className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none" placeholder="Valgfritt" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Prosjektdetaljer</label>
                  <textarea name="message" value={formData.message} onChange={updateField} rows={4}
                    required
                    className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none" placeholder={`Kort beskrivelse (sjanger: ${genre.title})`} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Valgt sjanger: <span className="text-white">{genre.title}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg font-semibold text-black disabled:opacity-60"
                  style={{ backgroundColor: genre.accentColor }}
                >
                  {isSubmitting ? 'Sender…' : 'Send henvendelse'}
                </button>
                {submitResult && (
                  <span className="text-sm text-gray-300">{submitResult}</span>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


