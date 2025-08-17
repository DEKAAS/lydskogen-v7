'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ArtistNettsideSection() {
  const [showForm, setShowForm] = useState(false)
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<{ artist: boolean; linktree: boolean }>({ artist: false, linktree: false })
  const [note, setNote] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const submitOrder = async () => {
    try {
      setSending(true)
      const payload = {
        type: 'music-production',
        name: name || 'Nettside-forespørsel',
        email: email || 'kunde@epost.no',
        subject: 'Bestilling – Artistside/Linktree',
        message: note,
        formData: {
          artistSide: selectedTypes.artist,
          linktree: selectedTypes.linktree,
          note
        },
        source: 'ArtistNettside',
        status: 'processing'
      }
      await fetch('/api/admin/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      // send email notification
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'music-production',
            name: name || 'Nettside-forespørsel',
            email: email || 'kunde@epost.no',
            subject: 'Bestilling – Artistside/Linktree',
            message: note,
            source: 'ArtistNettside'
          })
        })
      } catch {}
      setShowForm(false)
      setSelectedTypes({ artist: false, linktree: false })
      setNote('')
      setName('')
      setEmail('')
      alert('Henvendelsen er registrert. Du blir kontaktet snart!')
    } catch {
      alert('Kunne ikke sende forespørsel nå')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="artist" className="relative py-20 overflow-hidden bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
          animate={{ 
            x: [0, 50, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }}
          animate={{ 
            x: [0, -40, 20, 0],
            y: [0, 20, -50, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Animated particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, -5, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Info Button - Section Specific */}
      <motion.button
        onClick={() => setShowInfoPopup(true)}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 bg-green-600/80 hover:bg-green-500/80 backdrop-blur-sm text-white p-3 rounded-full border border-green-400/30 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block p-4 rounded-2xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-8 h-8 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
            Artist-nettside
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Profesjonell nettside som samler alle dine lenker og innhold på ett sted
          </p>
        </motion.div>

        {/* Content Grid - More Symmetric */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Dedikert Artist-nettside
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                      En skreddersydd artistside som presenterer musikken din, historie, utgivelser og kontakt – alt på ett sted med profesjonell design.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Linktree
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      Lett og effektiv måte å samle lenker til musikk, prosjekter og artwork. Perfekt for sosiale medier.
                    </p>
                  </motion.div>

                  <motion.button
                    onClick={() => setShowForm(true)}
                    className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Bestill din artistside
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Demo Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative space-y-6"
            >
              {/* Artist Website Demo */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-emerald-600/30 to-green-600/30 rounded-3xl blur-xl"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <div className="relative bg-black/50 backdrop-blur-xl p-4 rounded-3xl border border-gray-700/50 overflow-hidden">
                  <h4 className="text-lg font-bold text-white mb-3 text-center">🎵 Artist Website</h4>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-600/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20" />
                    <iframe 
                      src="https://dekaas.github.io/MODAN" 
                      className="w-full h-full scale-90 origin-top-left transform"
                      style={{ border: 0, width: '111%', height: '111%' }} 
                      loading="lazy" 
                    />
                  </div>
                  
                  <motion.a
                    href="https://dekaas.github.io/MODAN"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 block w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Se artist-side demo →
                  </motion.a>
                </div>
              </div>

              {/* Linktree Demo */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-green-600/30 to-teal-600/30 rounded-3xl blur-xl"
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.01, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <div className="relative bg-black/50 backdrop-blur-xl p-4 rounded-3xl border border-gray-700/50 overflow-hidden">
                  <h4 className="text-lg font-bold text-white mb-3 text-center">🔗 Linktree</h4>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-600/30 relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 flex items-center justify-center">
                    <div className="text-center p-4 space-y-3">
                      <div className="w-20 h-20 mx-auto bg-green-600/20 rounded-full flex items-center justify-center border border-green-400/30">
                        <span className="text-2xl">🎶</span>
                      </div>
                      <h5 className="text-white font-bold">Artist Name</h5>
                      <div className="space-y-2">
                        <div className="w-full h-8 bg-green-600/30 rounded-lg flex items-center justify-center text-xs text-white">🎵 Latest Track</div>
                        <div className="w-full h-8 bg-green-600/30 rounded-lg flex items-center justify-center text-xs text-white">🎤 Spotify</div>
                        <div className="w-full h-8 bg-green-600/30 rounded-lg flex items-center justify-center text-xs text-white">📷 Instagram</div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="mt-4 block w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Se linktree demo →
                  </motion.button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

          {/* Bestillingsinformasjon */}
          {/* Popup bestillingsskjema */}
          {showForm && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
              <div className="w-full max-w-lg p-6 rounded-xl border" style={{ background: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.12)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold" style={{color: 'var(--text-on-dark)'}}>Bestilling / Forespørsel</h3>
                  <button onClick={() => setShowForm(false)} className="text-white/70">✕</button>
                </div>
                <div className="space-y-4 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="p-3 rounded bg-black/30 border border-white/10" placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="p-3 rounded bg-black/30 border border-white/10" placeholder="E‑post" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedTypes.artist} onChange={(e) => setSelectedTypes(v => ({ ...v, artist: e.target.checked }))} />
                    Artist‑side
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedTypes.linktree} onChange={(e) => setSelectedTypes(v => ({ ...v, linktree: e.target.checked }))} />
                    Linktree
                  </label>
                  <textarea
                    className="w-full p-3 rounded bg-black/30 border border-white/10"
                    rows={5}
                    placeholder="Fortell oss om dine ønsker, referanser, tidslinje osv."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button onClick={submitOrder} disabled={sending} className="px-5 py-3 rounded font-semibold" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>{sending ? 'Sender…' : 'Send forespørsel'}</button>
                    <button onClick={() => setShowForm(false)} className="px-5 py-3 rounded border border-white/10">Avbryt</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Popup */}
          <AnimatePresence>
            {showInfoPopup && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowInfoPopup(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
                >
                  <div className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-xl p-8 rounded-3xl border border-green-400/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Hva er en artist-side?</h3>
                      </div>
                      <button
                        onClick={() => setShowInfoPopup(false)}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6 text-gray-200">
                      <div>
                        <h4 className="text-lg font-semibold text-green-200 mb-2">🎨 Artist-nettside</h4>
                        <p className="leading-relaxed">
                          En fullstendig nettside dedikert til din artistprofil. Inkluderer biografi, diskografi, 
                          bildegalleri, kontaktinfo og integrasjoner med Spotify, YouTube og sosiale medier.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-emerald-200 mb-2">🔗 Linktree</h4>
                        <p className="leading-relaxed">
                          En enkel landing-side som samler alle dine viktige lenker på ett sted. 
                          Perfekt for Instagram bio, TikTok profil eller andre sosiale medier hvor du bare har plass til én link.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-green-400/20">
                        <h4 className="text-lg font-semibold text-white mb-2">✨ Hvorfor trenger du dette?</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Professional presentasjon av din musikk
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Økt synlighet og booking-muligheter
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Enkelt å dele på sosiale medier
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Egen domene og branding
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
      </div>
    </section>
  );
}