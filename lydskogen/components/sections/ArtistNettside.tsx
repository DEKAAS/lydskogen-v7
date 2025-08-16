'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ArtistNettsideSection() {
  const [showForm, setShowForm] = useState(false)
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
    <section className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Ikon fjernet for minimalistisk uttrykk */}
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
            Artist-nettside
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Profesjonell nettside som samler alle dine lenker og innhold på ett sted
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="p-8 rounded-2xl border"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--text-on-dark)'}}>
                    Dedikert Artist‑nettside
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    En skreddersydd artistside som presenterer musikken din, historie, utgivelser og kontakt – alt på ett sted med profesjonell design.
                  </p>
                  <h4 className="font-medium mb-2" style={{color: 'var(--text-on-dark)'}}>Linktree</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Lett og effektiv måte å samle lenker til musikk, prosjekter og artwork. Perfekt for sosiale medier.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-6 inline-block px-6 py-3 rounded-lg font-semibold"
                    style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
                  >
                    Bestill/forespør
                  </button>
                </div>
                <div>
                  <div className="rounded-lg overflow-hidden border relative" style={{ borderColor: 'rgba(255,255,255,0.08)', height: 360 }}>
                    <div className="absolute top-0 left-1/2" style={{ transform: 'translateX(-50%) scale(0.75)', transformOrigin: 'top center', width: '130%', height: '130%' }}>
                      <iframe src="https://dekaas.github.io/MODAN" className="w-full h-full" style={{ border: 0 }} loading="lazy" />
                    </div>
                  </div>
                  <a
                    href="https://dekaas.github.io/MODAN"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold"
                    style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
                  >
                    Åpne linktree‑demo
                  </a>
                </div>
              </div>
            </motion.div>
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
        </div>
      </div>
    </section>
  );
}