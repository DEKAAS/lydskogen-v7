import Link from 'next/link';

export default function ArtistExamplePage() {
  return (
    <div className="min-h-screen bg-[#030806] text-emerald-50 selection:bg-emerald-500/30">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 border-b border-emerald-900/30 flex items-center justify-between px-6 bg-[#030806]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-emerald-500 uppercase">System Status: Online</span>
        </div>
        <div className="font-mono text-[10px] text-emerald-500/50">ARTIST_PKG_V1.0</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-24">
        
        {/* Hero Section */}
        <header className="relative grid lg:grid-cols-[1fr_300px] gap-12 items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1 border border-emerald-500/20 rounded-full bg-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase">Now Playing: Skogbunn EP</span>
            </div>
            
            <h1 className="font-mono text-5xl md:text-8xl font-bold tracking-tighter text-emerald-50 leading-none">
              AURORA<br/>MOSS
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 md:items-center border-t border-emerald-900/30 pt-8">
              <div className="max-w-md">
                <p className="font-mono text-xs text-emerald-500 mb-2 uppercase tracking-widest">[Bio_Short]</p>
                <p className="text-emerald-100/80 leading-relaxed text-sm">
                  Organisk elektronisk lyd inspirert av tåke, mose og nattlig lys. 
                  Musikk som eksisterer i grenselandet mellom det digitale og det naturlige.
                </p>
              </div>
              <div className="h-px w-12 bg-emerald-900/50 md:hidden" />
              <div className="flex gap-4">
                {['Spotify', 'Apple Music', 'Bandcamp'].map((platform) => (
                  <button key={platform} className="px-4 py-2 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 uppercase hover:bg-emerald-500/10 transition-colors">
                    {platform} ↗
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Side Stats / Info */}
          <div className="hidden lg:block space-y-4 font-mono text-[10px] text-emerald-500/70 border-l border-emerald-900/30 pl-8">
            <div className="flex justify-between">
              <span>LOCATION</span>
              <span className="text-emerald-100">OSLO, NO</span>
            </div>
            <div className="flex justify-between">
              <span>GENRE</span>
              <span className="text-emerald-100">AMBIENT / IDM</span>
            </div>
            <div className="flex justify-between">
              <span>LABEL</span>
              <span className="text-emerald-100">INDEPENDENT</span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_GIG</span>
              <span className="text-emerald-100">BLÅ, 24.OKT</span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-12 gap-8 border-t border-emerald-900/30 pt-24">
          
          {/* Left Column - Releases */}
          <div className="md:col-span-8 space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-emerald-500 uppercase tracking-widest">[01] Latest_Releases</span>
                <div className="h-px flex-1 bg-emerald-900/30" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group flex items-center justify-between p-6 border border-emerald-900/30 bg-[#050d0a] hover:border-emerald-500/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-emerald-900/20 flex items-center justify-center font-mono text-xs text-emerald-500 border border-emerald-500/20">
                        {i === 1 ? 'EP' : 'SGL'}
                      </div>
                      <div>
                        <h3 className="font-mono text-lg text-emerald-50 group-hover:text-emerald-400 transition-colors">
                          {i === 1 ? 'Under Mosen' : i === 2 ? 'Nordlys (Rework)' : 'Stillhet'}
                        </h3>
                        <p className="text-xs text-emerald-500/60 font-mono mt-1">2024 · {i === 1 ? '4 Tracks' : 'Single'}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      ▶
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-emerald-500 uppercase tracking-widest">[02] Live_Dates</span>
                <div className="h-px flex-1 bg-emerald-900/30" />
              </div>
              
              <div className="grid gap-px bg-emerald-900/30 border border-emerald-900/30">
                {[
                  { date: '24. OKT', venue: 'BLÅ', city: 'OSLO' },
                  { date: '12. NOV', venue: 'KVARTERET', city: 'BERGEN' },
                  { date: '05. DES', venue: 'SAMFUNDET', city: 'TRONDHEIM' }
                ].map((gig, i) => (
                  <div key={i} className="bg-[#030806] p-6 flex justify-between items-center hover:bg-emerald-900/5 transition-colors">
                    <div className="font-mono text-emerald-400">{gig.date}</div>
                    <div className="text-emerald-50">{gig.venue}</div>
                    <div className="font-mono text-xs text-emerald-500/60">{gig.city}</div>
                    <button className="text-xs font-mono border border-emerald-500/20 px-3 py-1 text-emerald-400 hover:bg-emerald-500/10">TICKETS</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Newsletter & Contact */}
          <aside className="md:col-span-4 space-y-12">
            <div className="p-8 border border-emerald-500/20 bg-emerald-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <div className="w-16 h-16 border-t border-r border-emerald-500/20" />
              </div>
              <div className="absolute bottom-0 left-0 p-2">
                <div className="w-16 h-16 border-b border-l border-emerald-500/20" />
              </div>
              
              <h3 className="font-mono text-lg text-emerald-50 mb-4">NYHETSBREV</h3>
              <p className="text-xs text-emerald-100/70 mb-6 leading-relaxed">
                Motta oppdateringer om nye utgivelser, konserter og eksklusive ting.
              </p>
              <div className="flex gap-2">
                <input 
                  placeholder="DIN@EPOST.NO" 
                  className="w-full bg-black/50 border border-emerald-500/30 px-3 py-2 text-xs font-mono text-emerald-50 placeholder:text-emerald-500/30 focus:border-emerald-400 outline-none"
                />
                <button className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 hover:bg-emerald-500/30 transition-colors">
                  →
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-6">Contact / Booking</h3>
              <div className="p-4 border-l border-emerald-900/50 hover:border-emerald-500 transition-colors">
                <div className="text-xs font-mono text-emerald-500/60 mb-1">MANAGEMENT</div>
                <div className="text-emerald-50 text-sm">hello@mgmt.com</div>
              </div>
              <div className="p-4 border-l border-emerald-900/50 hover:border-emerald-500 transition-colors">
                <div className="text-xs font-mono text-emerald-500/60 mb-1">BOOKING</div>
                <div className="text-emerald-50 text-sm">booking@agency.no</div>
              </div>
            </div>
          </aside>

        </div>

        {/* Footer */}
        <footer className="pt-24 border-t border-emerald-900/20 flex justify-between items-end text-[10px] font-mono text-emerald-500/40 uppercase">
          <div>
            © 2024 AURORA MOSS<br/>
            ALL RIGHTS RESERVED
          </div>
          <div className="text-right">
            DESIGNED BY<br/>
            LYDSKOG STUDIOS
          </div>
        </footer>

      </div>
    </div>
  );
}
