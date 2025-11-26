export default function LinktreeExamplePage() {
  const links = [
    'Spotify · nyeste utgivelse',
    'YouTube · liveopptak & videoer',
    'Instagram · prosess & stillbilder',
    'Bandcamp · kassetter og fysiske ting',
    'Nyhetsbrev · små oppdateringer innimellom',
  ]

  return (
    <div className="min-h-screen bg-[#030806] text-emerald-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.3fr)] gap-12 md:gap-16 items-start">
          {/* Venstre: intro */}
          <section className="space-y-8">
            <header className="space-y-5">
              <p className="text-[11px] font-mono tracking-[0.3em] text-emerald-300/70 uppercase">
                LINKTREE · DEMO
              </p>
              <h1 className="font-mono text-3xl md:text-[2.6rem] leading-tight tracking-[0.08em] text-emerald-100">
                Én rolig side for alle lenkene dine.
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-emerald-100/85 max-w-xl">
                Monospace, mørk bakgrunn og luft mellom hvert element. Ingen støy – bare lenker til
                musikk, video og alt annet du lager.
              </p>
            </header>

            <div className="space-y-3 text-xs md:text-sm text-emerald-200/80">
              <p>
                Passer som landingsside i bio, på plakater eller som liten “hub” du kan peke folk til.
              </p>
              <p>
                Vi kan fylle den med det du trenger – eller la den være nesten tom, med bare et par
                viktige lenker.
              </p>
            </div>
          </section>

          {/* Høyre: selve linktreet */}
          <section className="rounded-3xl border border-emerald-900/70 bg-[#050d0a] px-4 py-6 md:px-6 md:py-7 space-y-6">
            <header className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.25em] text-emerald-300/70 uppercase">
                <span>LYDSKOG</span>
                <span>LINKSIDE</span>
              </div>
              <div>
                <p className="font-mono text-sm text-emerald-100">@dittnavn</p>
                <p className="text-[12px] text-emerald-200/80">
                  Liten rolig samleside for lenker, prosjekter og utgivelser.
                </p>
              </div>
            </header>

            <main className="space-y-3">
              {links.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="group flex items-center justify-between px-4 py-3 rounded-2xl border border-emerald-900/80 bg-[#030806] hover:bg-[#07120e] transition-colors"
                >
                  <span className="flex-1 text-sm md:text-[0.95rem] text-emerald-50 truncate">
                    {label}
                  </span>
                  <span className="ml-3 text-[11px] font-mono text-emerald-300 group-hover:text-emerald-100 transition tracking-[0.18em] uppercase">
                    ↗
                  </span>
                </a>
              ))}
            </main>

            <footer className="pt-3 border-t border-emerald-900/70 text-[11px] text-emerald-200/80 leading-relaxed">
              Dette er en demo. Når vi bygger din linkside bruker vi samme ro og typografi, men fyller
              den med dine faktiske lenker og eventuelt eget domene.
            </footer>
          </section>
        </div>
      </div>
    </div>
  )
}

