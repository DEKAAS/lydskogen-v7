'use client';

import { useState } from 'react';

export default function ArtistNettsideSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="artist" className="py-12" style={{ backgroundColor: 'var(--section-bg-1)' }}>
      <div className="container mx-auto px-4">
        {/* Enkel header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>Artist-nettside</h2>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Profesjonell nettside som samler alle dine lenker på ett sted
          </p>
        </div>

        {/* To-kolonne layout - enkel */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          
          {/* Venstre: Info */}
          <div className="space-y-6">
            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
                Dedikert Artist-nettside
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                En skreddersydd artistside som presenterer musikken din, historie, 
                utgivelser og kontakt – alt på ett sted med profesjonell design.
              </p>
              
              <h4 className="text-base font-semibold mb-2 mt-4" style={{ color: 'var(--text-color)' }}>
                Linktree
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Lett og effektiv måte å samle lenker til musikk, prosjekter og artwork. 
                Perfekt for sosiale medier.
              </p>
            </div>

            {/* Enkel knapp */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-3 px-6 rounded text-sm font-medium"
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-color)' 
                }}
              >
                Forespørsel
              </button>
            )}
          </div>

          {/* Høyre: Demo eller form */}
          <div>
            {!showForm ? (
              <div className="rounded-lg p-4 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <div className="aspect-[4/5] rounded overflow-hidden relative" style={{ backgroundColor: 'var(--section-bg-2)' }}>
                  <iframe 
                    src="https://dekaas.github.io/MODAN" 
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Artist-nettside demo"
                  />
                </div>
                <a 
                  href="https://dekaas.github.io/MODAN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2 px-4 rounded text-sm"
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-color)' 
                  }}
                >
                  Se live demo →
                </a>
              </div>
            ) : (
              <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Kontaktskjema</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Navn</label>
                    <input
                      type="text"
                      className="w-full rounded px-3 py-2 text-sm"
                      style={{ 
                        backgroundColor: 'var(--section-bg-2)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-color)' 
                      }}
                      placeholder="Ditt navn"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>E-post</label>
                    <input
                      type="email"
                      className="w-full rounded px-3 py-2 text-sm"
                      style={{ 
                        backgroundColor: 'var(--section-bg-2)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-color)' 
                      }}
                      placeholder="din@epost.no"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Melding</label>
                    <textarea
                      className="w-full rounded px-3 py-2 text-sm"
                      style={{ 
                        backgroundColor: 'var(--section-bg-2)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-color)' 
                      }}
                      rows={4}
                      placeholder="Fortell litt om prosjektet ditt..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 px-4 rounded text-sm"
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-color)' 
                      }}
                    >
                      Avbryt
                    </button>
                    <button
                      className="flex-1 py-2 px-4 rounded text-sm"
                      style={{ 
                        backgroundColor: 'var(--section-bg-3)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-color)' 
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
