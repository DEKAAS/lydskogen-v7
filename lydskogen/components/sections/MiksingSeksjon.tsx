'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const mixingPrices = [
  {
    tracks: '1 spor',
    price: 400,
    description: 'Enkelt spor - perfekt for testing'
  },
  {
    tracks: '3 spor',
    price: 800,
    description: 'Liten produksjon - ideelt for demo'
  },
  {
    tracks: '5 spor',
    price: 1200,
    description: 'Middels produksjon - full låt'
  },
  {
    tracks: '10+ spor',
    price: 2000,
    description: 'Stor produksjon - kompleks miksing'
  }
];

export default function MiksingSeksjon() {
  const [showForm, setShowForm] = useState<null | { plan: string }>(null)
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const [details, setDetails] = useState('')
  const [sending, setSending] = useState(false)

  const submitOrder = async () => {
    try {
      setSending(true)
      await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'music-production',
          name: 'Miksing-bestilling',
          email: 'kunde@epost.no',
          subject: `Miksing – ${showForm?.plan}`,
          message: details,
          formData: { plan: showForm?.plan, details },
          source: 'MiksingSeksjon',
          status: 'processing'
        })
      })
      // Optional: send admin e-post via kontakt-API
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'music-production',
            name: 'Miksing-bestilling',
            email: 'kunde@epost.no',
            subject: `Miksing – ${showForm?.plan}`,
            message: details,
            source: 'MiksingSeksjon',
            genre: 'mixing'
          })
        })
      } catch {}
      setShowForm(null)
      setDetails('')
      alert('Bestilling registrert. Du blir kontaktet snart!')
    } catch {
      alert('Kunne ikke sende bestilling nå')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="relative py-16" style={{backgroundColor: 'var(--primary-bg)'}}>
      {/* Info Button */}
      <motion.button
        onClick={() => setShowInfoPopup(true)}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 bg-accent-green/80 hover:bg-accent-green/90 backdrop-blur-sm text-white p-3 rounded-full border border-accent-green/30 transition-all duration-300 shadow-lg hover:shadow-xl"
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

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: 'var(--text-on-dark)'}}>
            Miksing
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto" style={{color: 'var(--text-on-dark)'}}>
            Profesjonell miksing som løfter musikken din
          </p>
        </motion.div>

        {/* Main Glass Container */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div 
            className="glass-container-section p-6 md:p-8 rounded-2xl border backdrop-blur-sm"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Left Side - Pricing */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--text-on-dark)'}}>
                  Prisliste
                </h3>
                {mixingPrices.map((item, index) => (
                  <div key={item.tracks}>
                    <motion.div
                      className="p-4 rounded-lg border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 cursor-pointer"
                      style={{
                        background: 'var(--glass-card)',
                        backdropFilter: 'blur(10px)',
                        backgroundImage: 'linear-gradient(120deg, rgba(255,235,150,0.08), rgba(255,235,150,0.03))'
                      }}
                      whileHover={{
                        y: -2,
                        boxShadow: '0 12px 28px rgba(0,0,0,0.28)'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      onClick={() => setShowForm(current => current?.plan === item.tracks ? null : { plan: item.tracks })}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg" style={{color: 'var(--text-on-dark)'}}>
                            {item.tracks}
                          </div>
                          <div className="text-sm opacity-70" style={{color: 'var(--text-on-dark)'}}>
                            {item.description}
                          </div>
                        </div>
                        <div className="text-xl font-bold" style={{color: 'var(--accent-gold)'}}>
                          {item.price} kr
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">Pris avhenger av omfang</div>
                    </motion.div>
                    {/* Inline expanding panel under the clicked card */}
                    {showForm?.plan === item.tracks && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 rounded-lg border border-white/10 overflow-hidden"
                        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold" style={{color: 'var(--text-on-dark)'}}>Bestilling – {item.tracks}</h4>
                            <button onClick={() => { setShowForm(null); const el = document.getElementById('services'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-white/70">✕</button>
                          </div>
                          <div className="text-gray-300 text-sm space-y-2 mb-3">
                            <p>For optimal mixing‑kvalitet kreves følgende leveringsspesifikasjoner:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Filformat: WAV eller AIFF (24‑bit/48kHz minimum)</li>
                              <li>Lydnivå: Ca. −18dB RMS uten processing på master</li>
                              <li>Stem‑separasjon: Individuelle spor/stems organisert og merket tydelig</li>
                              <li>Referanser: jeg tar gjerne imot referanselåter hvis ønskelig</li>
                              <li>Effekter: Spesifiser ønskede effekter, reverb og stereobredde</li>
                              <li>Deadline og revisjoner: Inntil 3 revisjoner inkludert</li>
                            </ul>
                            <p className="mt-1">Prisestimat: <span className="font-semibold" style={{color: 'var(--accent-gold)'}}>{item.price} kr</span> (avhenger av omfang)</p>
                          </div>
                          <textarea
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                            rows={5}
                            placeholder="Beskriv prosjektet, antall spor, referanser, ønsket leveringstid osv."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                          />
                          <div className="flex gap-3 mt-3">
                          <button onClick={async () => { await submitOrder(); const el = document.getElementById('services'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} disabled={sending} className="px-5 py-3 rounded font-semibold" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>{sending ? 'Sender…' : 'Send bestilling'}</button>
                            <button onClick={() => setShowForm(null)} className="px-5 py-3 rounded border border-white/10 text-white">Avbryt</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side - Description */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold" style={{color: 'var(--text-on-dark)'}}>
                  Hva inkluderer miksing?
                </h3>
                <motion.div
                  className="p-6 rounded-lg border border-white/10 backdrop-blur-sm"
                  style={{
                    background: 'var(--glass-card)',
                    backdropFilter: 'blur(10px)',
                    minHeight: 'fit-content'
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 bg-accent-green" />
                      <div>
                        <h4 className="font-medium" style={{color: 'var(--text-on-dark)'}}>
                          Balansering og EQ
                        </h4>
                        <p className="text-sm opacity-80" style={{color: 'var(--text-on-dark)'}}>
                          Perfekt balanse mellom alle elementer i miksen
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 bg-accent-green" />
                      <div>
                        <h4 className="font-medium" style={{color: 'var(--text-on-dark)'}}>
                          Kompresjon og dynamikk
                        </h4>
                        <p className="text-sm opacity-80" style={{color: 'var(--text-on-dark)'}}>
                          Profesjonell behandling av dynamikk og punch
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 bg-accent-green" />
                      <div>
                        <h4 className="font-medium" style={{color: 'var(--text-on-dark)'}}>
                          Spatial processing
                        </h4>
                        <p className="text-sm opacity-80" style={{color: 'var(--text-on-dark)'}}>
                          Reverb, delay og stereobredde for dybde
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 bg-accent-green" />
                      <div>
                        <h4 className="font-medium" style={{color: 'var(--text-on-dark)'}}>
                          Ferdig masterkopi
                        </h4>
                        <p className="text-sm opacity-80" style={{color: 'var(--text-on-dark)'}}>
                          Klar for distribusjon i ønsket format
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {/* Separate knapper fjernet – bestilling åpnes via klikk på kort */}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Modal removed; inline panel used under selected kort */}

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
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl p-8 rounded-3xl border border-accent-green/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-green to-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Miksing & Mastering</h3>
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
                      <h4 className="text-lg font-semibold text-accent-green mb-2">🎚️ Profesjonell Miksing</h4>
                      <p className="leading-relaxed">
                        Vi gir dine råopptak den profesjonelle finishen de fortjener. Fra enkle demospor 
                        til komplekse produksjoner med mange lag.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-accent-green mb-2">✨ Mastering</h4>
                      <p className="leading-relaxed">
                        Den siste finishen som gjør musikken din klar for distribusjon på alle plattformer. 
                        Profesjonell loudness og frekvensbehandling.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-accent-green/20">
                      <h4 className="text-lg font-semibold text-white mb-2">🔧 Hva inkluderer miksing?</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          EQ og kompresjon på alle spor
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Romklang og effekter
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Balansering og panorering
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Kreativ lyddesign
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