export default function ArtistExamplePage() {
  return (
    <div className="min-h-screen bg-[#030806] text-emerald-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20 space-y-16">
        {/* Hero */}
        <header className="space-y-12">
          <nav className="flex items-center justify-between text-xs tracking-[0.25em] text-emerald-300/60 uppercase">
            <span className="font-mono">LYDSKOG</span>
            <span className="font-mono">ARTIST-SIDE · DEMO</span>
          </nav>

          <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 md:gap-16 items-end">
            <div className="space-y-6">
              <p className="text-[11px] font-mono tracking-[0.3em] text-emerald-300/70 uppercase">
            ........
              </p>
              <p className="text-[11px] font-mono tracking-[0.3em] text-emerald-300/60 uppercase">
                ELEKTRONISK / AMBIENT
              </p>
              <h1 className="font-mono text-5xl md:text-[4.6rem] leading-none tracking-[0.08em] text-emerald-100">
                Aurora Moss
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-emerald-100/80 max-w-xl">
                Lyd fra skogbunnen – langsomme flater, små detaljer og mye rom mellom tingene.
              </p>
            </div>

            <div className="md:justify-self-end space-y-4 text-xs md:text-sm text-emerald-100/80 max-w-xs">
              <p>
                Dette er en <span className="font-semibold">demo-layout</span> – din artistside blir
                skreddersydd etter stil, uttrykk og farger.
              </p>
            </div>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-12 md:gap-16 items-start">
          {/* Left: Bio + musikk */}
          <section className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs font-mono text-emerald-300/70 tracking-[0.35em] uppercase">
                Bio / intro
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-emerald-50/90">
                Organisk elektronisk lyd inspirert av tåke, mose og nattlig lys. Musikk som gjerne får gå
                i bakgrunnen en stund før du oppdager hvor den kommer fra.
              </p>
            </div>

            {/* Her kan vi eventuelt legge inn lydklipp senere – demoen holder seg stille for nå. */}
          </section>

          {/* Right: Lenker / info kort */}
          <aside className="space-y-8 md:space-y-10">
            <div className="rounded-3xl border border-emerald-900/60 bg-[#050d0a] px-5 py-6 md:px-6 md:py-7 space-y-4">
              <h3 className="text-xs font-mono text-emerald-300/70 tracking-[0.35em] uppercase">
                Hva du kan få
              </h3>
              <ul className="text-xs md:text-sm space-y-2.5 text-emerald-50/90">
                <li>
                  • Egen URL (f.eks. <span className="font-mono">dittnavn.lydskog.no</span>) eller bruk av domene du
                  allerede eier.
                </li>
                <li>• Design tilpasset din visuelle profil, sjanger og stemning.</li>
                <li>• Integrasjon mot Spotify, Apple Music, Bandcamp m.m.</li>
                <li>• Seksjoner for pressebilder, tekst, kommende konserter og mer.</li>
              </ul>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                Denne siden er kun et eksempel – når vi bygger din artistside, starter vi fra dine referanser,
                farger og inspirasjon.
              </p>
            </div>

            {/* Plattform-ikoner – store og uten tekst */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-5 md:gap-7">
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-300/20 border border-emerald-300/80 flex items-center justify-center text-[11px] font-mono text-emerald-50/90 hover:bg-emerald-300/30 transition-colors">
                  SP
                </button>
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-300/20 border border-emerald-300/80 flex items-center justify-center text-[11px] font-mono text-emerald-50/90 hover:bg-emerald-300/30 transition-colors">
                  IG
                </button>
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-300/20 border border-emerald-300/80 flex items-center justify-center text-[11px] font-mono text-emerald-50/90 hover:bg-emerald-300/30 transition-colors">
                  YT
                </button>
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-300/20 border border-emerald-300/80 flex items-center justify-center text-[11px] font-mono text-emerald-50/90 hover:bg-emerald-300/30 transition-colors">
                  BC
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

