'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomArtworkModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomArtworkModal({ isOpen, onClose }: CustomArtworkModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'album-cover',
    budget: '',
    timeline: '',
    description: '',
    inspiration: '',
    dimensions: '',
    fileFormat: 'jpg'
  })

  const updateField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.description) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.description,
          type: 'custom-artwork',
          subject: `Skreddersydd artwork bestilling - ${formData.projectType}`,
          source: 'CustomArtworkModal',
          formData: formData
        })
      })

      if (!res.ok) throw new Error('Kunne ikke sende bestilling')

      setSubmitResult('Takk! Vi har mottatt din bestilling og kontakter deg snart.')
      setTimeout(() => {
        setFormData({
          name: '', email: '', phone: '', projectType: 'album-cover',
          budget: '', timeline: '', description: '', inspiration: '',
          dimensions: '', fileFormat: 'jpg'
        })
        setSubmitResult(null)
        onClose()
      }, 3000)

    } catch (err) {
      setSubmitResult('Noe gikk galt. Prøv igjen eller kontakt oss direkt.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-base-dark rounded-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Skreddersydd Artwork</h2>
                  <p className="text-gray-300">Fortell oss om ditt prosjekt så lager vi et unikt design for deg</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submitForm} className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Navn *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={updateField}
                    required
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="Ditt navn"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">E-post *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    required
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="din@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Telefon</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="Valgfritt"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Type prosjekt</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-green"
                  >
                    <option value="album-cover">Albumcover</option>
                    <option value="single-cover">Single cover</option>
                    <option value="logo">Logo</option>
                    <option value="poster">Poster</option>
                    <option value="merchandise">Merchandise</option>
                    <option value="social-media">Sosiale medier</option>
                    <option value="other">Annet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Filformat</label>
                  <select
                    name="fileFormat"
                    value={formData.fileFormat}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-green"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Budsjett (NOK)</label>
                  <input
                    name="budget"
                    value={formData.budget}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="500-2000"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Tidsramme</label>
                  <input
                    name="timeline"
                    value={formData.timeline}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="1-2 uker"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Dimensjoner</label>
                  <input
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={updateField}
                    className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                    placeholder="3000x3000px"
                  />
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-gray-300 mb-2">Prosjektbeskrivelse *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={updateField}
                  required
                  rows={4}
                  className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                  placeholder="Beskriv hva du ønsker... Hvilken stemning, stil, farger, elementer?"
                />
              </div>

              {/* Inspiration */}
              <div>
                <label className="block text-gray-300 mb-2">Inspirasjon/Referanser</label>
                <textarea
                  name="inspiration"
                  value={formData.inspiration}
                  onChange={updateField}
                  rows={3}
                  className="w-full p-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                  placeholder="Link til bilder, artister eller stil du liker..."
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-4">
                {submitResult && (
                  <div className={`text-sm ${submitResult.includes('Takk') ? 'text-accent-green' : 'text-red-400'}`}>
                    {submitResult}
                  </div>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-accent-green text-base-dark font-semibold rounded-lg hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Sender...' : 'Send bestilling'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}