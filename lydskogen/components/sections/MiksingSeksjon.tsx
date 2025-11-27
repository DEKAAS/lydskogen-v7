'use client';

import { motion } from 'framer-motion';
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

const Fader = ({ delay, active }: { delay: number, active: boolean }) => {
  return (
    <div className="h-48 w-12 bg-[#0a0c0a] border border-white/10 rounded relative mx-auto flex justify-center p-1">
      {/* Track Lines */}
      <div className="h-full w-px bg-white/5 flex flex-col justify-between py-2">
        {[...Array(10)].map((_, i) => <div key={i} className="w-2 h-px bg-white/10 -ml-1" />)}
      </div>
      
      {/* Fader Cap */}
      <motion.div 
        animate={active ? { 
          y: [100, 40, 80, 20, 60, 100],
        } : { y: 100 }}
        transition={active ? { 
          duration: 4, 
          ease: "easeInOut", 
          repeat: Infinity, 
          repeatType: "reverse",
          delay: delay 
        } : { duration: 0.5 }}
        className={`absolute bottom-0 w-8 h-12 rounded shadow-lg backdrop-blur-sm border border-white/20 flex items-center justify-center ${active ? 'bg-accent-green/20 shadow-[0_0_15px_rgba(132,140,114,0.3)]' : 'bg-[#1a1c1a]'}`}
      >
        <div className={`w-full h-px ${active ? 'bg-accent-green' : 'bg-white/20'}`} />
      </motion.div>
      
      {/* Level Meter - Only shown on active fader to reduce load */}
      {active && (
        <div className="absolute -right-2 bottom-2 top-2 w-1 flex flex-col-reverse gap-0.5">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 0.2, repeat: Infinity, delay: delay + (i * 0.05) }}
              className={`w-full h-full rounded-sm ${i > 9 ? 'bg-red-500' : i > 6 ? 'bg-yellow-500' : 'bg-green-500'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MiksingSeksjon() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (id: string) => {
    setActivePlan(id);
  };

  return (
    <section id="miksing" className="py-32 bg-[#050605] relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        <div className="flex items-center gap-4 mb-16 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [02] Tjenester — Lydteknikk
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left: The Console (Visualizer) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[#080a08] border border-white/10 p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-green/50 to-transparent opacity-50" />
              
              <div className="flex justify-between mb-8">
                <h3 className="font-mono text-white text-sm tracking-widest">MIX_BUS_A</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="font-mono text-[10px] text-accent-green">SIGNAL_ACTIVE</span>
                </div>
              </div>

              {/* Fader Container - Flex wrap on mobile, fewer items */}
              <div className="flex justify-center lg:justify-between gap-4 px-2">
                {mixingPrices.map((plan, i) => (
                  <div key={plan.id} className="flex flex-col gap-4 items-center w-1/3 min-w-[60px]">
                    <Fader delay={i * 0.5} active={activePlan === plan.id || activePlan === null} />
                    <span className="font-mono text-[10px] text-gray-500 rotate-90 mt-4 whitespace-nowrap origin-left translate-x-2">
                      CH_{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-white/5 pt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-gray-600 font-mono mb-1">DYN_RANGE</div>
                  <div className="text-accent-green font-mono text-xs">-14 LUFS</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 font-mono mb-1">STEREO</div>
                  <div className="text-accent-green font-mono text-xs">120%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 font-mono mb-1">SAMPLE</div>
                  <div className="text-accent-green font-mono text-xs">96kHz</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection & Info */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-mono font-bold text-white mb-6 tracking-tighter">
                MIKSING
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed space-y-4">
                Vi tilbyr profesjonell miksing med fokus på balanse, dybde og klarhet.
                Din musikk får den behandlingen den trenger for å skinne på alle plattformer.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                  Balansering og EQ
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                  Kompresjon og dynamikk
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                  Spatial processing (Reverb/Delay)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                  Ferdig masterkopi
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {mixingPrices.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => handleSelect(plan.id)}
                  className={`p-6 border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full
                    ${activePlan === plan.id 
                      ? 'bg-white/5 border-accent-green' 
                      : 'bg-transparent border-white/10 hover:border-white/30'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-xs text-gray-500">0{mixingPrices.indexOf(plan) + 1}</span>
                      <div className={`w-2 h-2 rounded-full ${activePlan === plan.id ? 'bg-accent-green' : 'bg-white/10'}`} />
                    </div>
                    <h3 className="font-mono text-lg text-white font-bold mb-1">{plan.name}</h3>
                    <p className="font-mono text-xs text-accent-green mb-6">{plan.tracks}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="font-mono text-xl text-white">{plan.price},-</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 border-l-2 border-accent-green">
              <div>
                <h4 className="text-white font-mono text-sm mb-1">KLAR FOR Å STARTE?</h4>
                <p className="text-xs text-gray-500 max-w-md">
                  Velg en pakke ovenfor eller send oss en forespørsel.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-accent-green text-black font-mono font-bold text-sm hover:bg-white transition-colors"
              >
                BESTILL
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Simple Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#0a0c0a] border border-white/10 p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-mono text-white mb-6">MIKSING FORESPØRSEL</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Takk!'); setShowModal(false); }}>
              <input 
                type="email" placeholder="DIN E-POST" 
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
              />
              <textarea 
                placeholder="BESKRIV PROSJEKTET DITT..." rows={4}
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
              />
              <button className="w-full bg-accent-green text-black font-mono font-bold py-3 hover:bg-white transition-colors">
                SEND
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
