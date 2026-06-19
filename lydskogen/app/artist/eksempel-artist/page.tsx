import Link from 'next/link';

export default function ArtistExamplePage() {
  const releases = [
    { title: 'Under Mosen', type: 'EP', year: '2026' },
    { title: 'Nordlys', type: 'Single', year: '2025' },
    { title: 'Stillhet', type: 'Single', year: '2025' },
  ];

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#1d241d]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/" className="text-sm font-medium text-[#5c604f] transition-colors hover:text-[#1d241d]">
          Tilbake til Lydskog
        </Link>
        <span className="text-xs uppercase tracking-[0.3em] text-[#8a7d62]">Artist-side demo</span>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <section className="grid min-h-[70vh] items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Aurora Moss</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              En enkel artistprofil med musikken i sentrum.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#4f5749]">
              Organisk elektronisk lyd inspirert av skog, tåke og nattlig lys. Denne demoen viser hvordan en
              Artist-side kan samle bio, utgivelser, lenker og kontakt på en rolig og profesjonell måte.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Spotify', 'Instagram', 'Bandcamp', 'Booking'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="rounded-full border border-[#d8caa8] px-5 py-3 text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#ded2ba] p-5 shadow-2xl shadow-[#8a7d62]/20">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-gradient-to-br from-[#35412f] via-[#69735b] to-[#c9b58e] p-8 text-[#f8f3e8]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f8f3e8]/70">Latest release</p>
                  <h2 className="mt-4 text-4xl font-semibold">Under Mosen</h2>
                </div>
                <p className="max-w-xs text-sm leading-7 text-[#f8f3e8]/80">
                  Coverområde, kampanjebilde eller artistfoto kan brukes her for å gi siden et tydelig visuelt uttrykk.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-y border-[#d8caa8] py-12 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a7d62]">Innhold</p>
            <h2 className="mt-4 text-3xl font-semibold">Det viktigste samlet.</h2>
          </div>
          <div className="md:col-span-2">
            <p className="text-lg leading-8 text-[#4f5749]">
              En Artist-side kan tilpasses uttrykket til artisten, men holder seg enkel: hvem du er, hva du har
              gitt ut, hvor folk kan lytte, og hvordan de kan kontakte deg.
            </p>
          </div>
        </section>

        <section className="grid gap-5 py-12 md:grid-cols-3">
          {releases.map((release) => (
            <article key={release.title} className="rounded-[1.5rem] border border-[#d8caa8] bg-white/40 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8a7d62]">{release.type}</p>
              <h3 className="mt-4 text-2xl font-semibold">{release.title}</h3>
              <p className="mt-8 text-sm text-[#5c604f]">{release.year}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col justify-between gap-4 border-t border-[#d8caa8] py-8 text-sm text-[#5c604f] md:flex-row">
          <span>Demoartist: Aurora Moss</span>
          <span>Artist-side laget av Lydskog</span>
        </footer>
      </main>
    </div>
  );
}
