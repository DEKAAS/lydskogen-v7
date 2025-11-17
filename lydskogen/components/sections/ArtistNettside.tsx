'use client';

export default function ArtistNettsideSection() {
  const handleOrder = () => {
    const subject = 'Bestilling: Artist-nettside / Linktree';
    const body = `Hei Lydskog!\n\nJeg ønsker å bestille en artist-nettside eller linktree.\n\nFortell gjerne litt om hva du trenger:\n\n- Type: Artist-nettside / Linktree / Begge deler\n- Ønsket innhold:\n- Leveringsdato:\n\nSer frem til å høre fra dere!\n\nMvh\n[Ditt navn]`;
    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="artist" className="py-12" style={{ backgroundColor: 'var(--section-bg-1)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
              Artist-nettside & Linktree
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              En enkel side som samler alle dine lenker på ett sted – perfekt for sosiale medier og musikkpromotering
            </p>
          </div>

          {/* Main content card */}
          <div className="rounded-2xl p-8 md:p-10" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                    Folk vil ha et sted å vise frem det de lager – enten det er bilder, tekst, videoer eller alt mulig annet. En egen nettside gir deg et ryddig sted å samle alt på, og når det ser profesjonelt ut, gjør det rett og slett prosjektet ditt mye mer imponerende.
                  </p>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Hva får du?
                  </h3>
                  <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <li className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">•</span>
                      <span>En skreddersydd side med ditt navn, bilde og lenker</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">•</span>
                      <span>Samler Spotify, SoundCloud, Instagram, YouTube og mer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">•</span>
                      <span>Mobilvennlig design som fungerer overalt</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">•</span>
                      <span>Enkel å oppdatere med nye lenker når du vil</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleOrder}
                    className="flex-1 py-3 px-6 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    Bestill
                  </button>
                  <a
                    href="https://dekaas.github.io/MODAN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 rounded-lg text-sm font-medium text-center"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Se demo →
                  </a>
                </div>
              </div>

              {/* Right: Demo preview */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--section-bg-2)', border: '1px solid var(--border-color)' }}>
                <div className="aspect-[4/5] relative">
                  <iframe
                    src="https://dekaas.github.io/MODAN"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Artist-nettside demo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
