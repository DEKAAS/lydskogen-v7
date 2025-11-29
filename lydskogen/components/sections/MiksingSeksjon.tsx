'use client';

import { useState } from 'react';

const mixingPrices = [
  {
    id: '1-spor',
    name: '1 SPOR',
    tracks: 'SINGLE',
    price: 500,
    features: ['Balansering og EQ', 'Kompresjon og dynamikk', 'Spatial processing', 'Ferdig masterkopi']
  },
  {
    id: '3-spor',
    name: '3 SPOR',
    tracks: 'EP - LITEN',
    price: 1200,
    features: ['Perfekt balanse', 'Dybde og klarhet', 'Kreativ lyddesign', 'Streaming Klar']
  },
  {
    id: '5-spor',
    name: '5 SPOR',
    tracks: 'EP - STOR',
    price: 2000,
    features: ['Helhetlig lydbilde', 'Profesjonell punch', 'Stereobredde', 'Distribusjonsklar']
  }
];

export default function MiksingSeksjon() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: string) => {
    setActivePlan(id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Miksing Forespørsel', // Placeholder as name isn't in this form
          email: formData.email,
          type: activePlan ? `Miksing: ${activePlan}` : 'Miksing Generelt',
          message: formData.description,
          source: 'MiksingSeksjon',
          subject: `Bestilling Miksing: ${activePlan || 'Generell'}`
        })
      });

      if (response.ok) {
        alert('Takk! Din forespørsel er sendt.');
        setShowModal(false);
        setFormData({ email: '', description: '' });
      } else {
        alert('Det oppstod en feil.');
      }
    } catch (error) {
      alert('Det oppstod en feil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="miksing" className="py-32 bg-[#050605] relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        
        <div className="flex items-center gap-4 mb-16 text-accent-warm/80 font-mono text-xs tracking-widest uppercase justify-center">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [03] Tjenester — Lydteknikk
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
        </div>

        <div className="text-center mb-24 space-y-6">
          <h2 className="text-4xl md:text-6xl font-mono font-bold text-white tracking-tighter">
            MIKSING
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Vi tilbyr profesjonell miksing med fokus på balanse, dybde og klarhet.
            Din musikk får den behandlingen den trenger for å skinne på alle plattformer.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {mixingPrices.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => handleSelect(plan.id)}
              className={`p-8 border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden
                ${activePlan === plan.id 
                  ? 'bg-white/5 border-accent-green shadow-[0_0_30px_-10px_rgba(43,245,116,0.1)]' 
                  : 'bg-[#080a08] border-white/10 hover:border-white/30 hover:bg-white/5'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs text-gray-500">0{mixingPrices.indexOf(plan) + 1}</span>
                  <div className={`w-2 h-2 rounded-full ${activePlan === plan.id ? 'bg-accent-green' : 'bg-white/10 group-hover:bg-white/30'}`} />
                </div>
                <h3 className="font-mono text-2xl text-white font-bold mb-2">{plan.name}</h3>
                <p className="font-mono text-xs text-accent-green mb-8 tracking-wider uppercase">{plan.tracks}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400 font-mono">
                      <span className="text-accent-green mt-1">›</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                <div className="font-mono text-2xl text-white font-bold">{plan.price},-</div>
                <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">VELG →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm font-mono mb-6">HAR DU SPESIELLE BEHOV ELLER STØRRE PROSJEKTER?</p>
          <button 
            onClick={() => { setActivePlan(null); setShowModal(true); }}
            className="px-8 py-3 border border-white/20 text-white font-mono text-sm hover:bg-white hover:text-black transition-colors"
          >
            TA KONTAKT
          </button>
        </div>

      </div>

      {/* Simple Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#0a0c0a] border border-white/10 p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">[LUKK]</button>
            
            <h3 className="text-xl font-mono text-white mb-2">MIKSING FORESPØRSEL</h3>
            <p className="text-xs text-accent-green font-mono mb-6 uppercase">
              VALGT: {activePlan ? mixingPrices.find(p => p.id === activePlan)?.name : 'GENERELT'}
            </p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="DIN E-POST" 
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <textarea 
                placeholder="BESKRIV PROSJEKTET DITT..." rows={4}
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button 
                disabled={isSubmitting}
                className="w-full bg-accent-green text-black font-mono font-bold py-3 hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SENDER...' : 'SEND FORESPØRSEL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
