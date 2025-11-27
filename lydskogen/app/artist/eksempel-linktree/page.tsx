import Link from 'next/link';

export default function LinktreeExamplePage() {
  const links = [
    { label: 'SISTE UTGIVELSE (SPOTIFY)', url: '#', type: 'MUSIC' },
    { label: 'NY MUSIKKVIDEO (YOUTUBE)', url: '#', type: 'VIDEO' },
    { label: 'KOMMENDE KONSERTER', url: '#', type: 'LIVE' },
    { label: 'KJØP MERCH & VINYL', url: '#', type: 'SHOP' },
    { label: 'MELD DEG PÅ NYHETSBREV', url: '#', type: 'MAIL' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c0a] text-emerald-50 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Central Card */}
      <div className="w-full max-w-md p-6 md:p-12 relative z-10">
        
        {/* Header / Identity */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-emerald-500/30 p-1 mx-auto relative">
               <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-900 to-black flex items-center justify-center overflow-hidden">
                 <span className="font-mono text-4xl">AM</span>
               </div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0a0c0a]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-mono text-2xl md:text-3xl font-bold tracking-tighter text-emerald-50">AURORA MOSS</h1>
            <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest">Electronic / Ambient · Oslo</p>
          </div>
        </div>

        {/* Links Stack */}
        <div className="space-y-3">
          {links.map((link, i) => (
            <Link 
              key={i} 
              href={link.url}
              className="block group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-900/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <div className="relative border border-emerald-500/20 bg-[#050805] p-4 flex items-center justify-between group-hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-emerald-500/50 w-6">0{i + 1}</span>
                  <span className="font-mono text-xs md:text-sm text-emerald-50 tracking-wide">{link.label}</span>
                </div>
                <span className="text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-emerald-500/60 uppercase tracking-wider">Powered by Lydskog</span>
          </div>
        </div>

      </div>

      {/* Corner Accents */}
      <div className="fixed top-6 left-6 w-16 h-16 border-l border-t border-emerald-500/20" />
      <div className="fixed top-6 right-6 w-16 h-16 border-r border-t border-emerald-500/20" />
      <div className="fixed bottom-6 left-6 w-16 h-16 border-l border-b border-emerald-500/20" />
      <div className="fixed bottom-6 right-6 w-16 h-16 border-r border-b border-emerald-500/20" />

    </div>
  );
}
