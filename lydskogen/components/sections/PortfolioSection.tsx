'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Music, 
  Play, 
  Youtube, 
  Disc 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  artist?: string;
  artworkUrl: string;
  musicUrl?: string;
  description: string;
  tags?: string[];
  spotifyUrl?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  createdAt?: string;
}

// Helper to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const lastClickTime = useRef<number>(0);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        setProjects(data.projects || []);
        setIsLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setIsLoading(false);
      });
  }, []);

  // Debounced toggle to prevent double-click glitch
  const toggleExpand = useCallback((id: string) => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) return; // Ignore clicks within 300ms
    lastClickTime.current = now;
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 bg-[#050605] text-center font-mono text-gray-500 animate-pulse">
        [LOADING_ARCHIVE...]
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="bg-[#050605] min-h-screen relative pb-12 md:pb-24">
      {/* Section Header - Technical Style */}
      <div className="sticky top-0 z-30 bg-[#050605]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
          <h2 className="font-mono text-xl md:text-3xl text-white font-bold tracking-tighter">
            [02] PROSJEKTER
          </h2>
          <div className="hidden md:flex gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <span>TOTAL_ENTRIES: {projects.length.toString().padStart(2, '0')}</span>
            <span className="text-accent-green">STATUS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Projects Tracklist - Technical Archive Style */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-8">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-3 mb-4 px-4">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">TITLE</div>
          <div className="col-span-3">ARTIST</div>
          <div className="col-span-2">TYPE</div>
          <div className="col-span-2 text-right">ACTION</div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group relative border border-transparent rounded-sm transition-all duration-300 overflow-hidden",
                  isExpanded 
                    ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
                    : "hover:bg-white/5 hover:border-white/5 border-b-white/5"
                )}
              >
                {/* Main Row Clickable Area */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(project.id);
                  }}
                  className="grid grid-cols-12 gap-4 items-center p-4 cursor-pointer select-none"
                >
                  {/* ID Column */}
                  <div className="col-span-2 md:col-span-1 font-mono text-xs text-gray-600 group-hover:text-accent-green transition-colors">
                    {index.toString().padStart(3, '0')}
                  </div>

                  {/* Title Column */}
                  <div className="col-span-8 md:col-span-4 flex items-center gap-4">
                    {/* Thumbnail - Always visible now for better visual anchor */}
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-sm overflow-hidden flex-shrink-0">
                      {project.artworkUrl ? (
                        <img 
                          src={project.artworkUrl} 
                          alt={project.title} 
                          className={cn(
                            "w-full h-full object-cover transition-all duration-500",
                            isExpanded ? "scale-110 grayscale-0" : "grayscale group-hover:grayscale-0"
                          )} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Disc size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <span className={cn(
                        "font-mono text-sm md:text-base font-bold truncate transition-colors",
                        isExpanded ? "text-accent-green" : "text-white group-hover:text-white"
                      )}>
                        {project.title}
                      </span>
                      <span className="md:hidden text-xs text-gray-500 truncate mt-0.5">
                        {project.artist}
                      </span>
                    </div>
                  </div>

                  {/* Artist Column (Desktop) */}
                  <div className="col-span-3 hidden md:block font-mono text-sm text-gray-400 truncate">
                    {project.artist || '-'}
                  </div>

                  {/* Type Column (Desktop) */}
                  <div className="col-span-2 hidden md:block">
                    {project.tags && project.tags.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        {project.tags[0]}
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs">-</span>
                    )}
                  </div>

                  {/* Action Column */}
                  <div className="col-span-2 md:col-span-2 flex justify-end items-center gap-4">
                     <span className="text-[10px] font-mono text-gray-600 hidden md:inline-block group-hover:text-gray-400 transition-colors uppercase tracking-widest">
                        {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                     </span>
                     {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-accent-green" />
                     ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                     )}
                  </div>
                </div>

                {/* Expanded Content Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="p-4 md:p-8 border-t border-white/5 grid md:grid-cols-12 gap-8">
                        
                        {/* Left: Large Artwork & Stats */}
                        <div className="md:col-span-4 lg:col-span-3 space-y-6">
                           <div className="aspect-square w-full bg-white/5 rounded-sm overflow-hidden border border-white/10 shadow-2xl relative group/art">
                              {project.artworkUrl ? (
                                <img 
                                  src={project.artworkUrl} 
                                  alt={project.title} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                  <Music size={48} strokeWidth={1} />
                                </div>
                              )}
                              
                              {/* Spotify Overlay Button */}
                              {project.spotifyUrl && (
                                <a 
                                  href={project.spotifyUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs tracking-widest backdrop-blur-sm"
                                >
                                   <Play size={16} className="fill-white" /> OPEN SPOTIFY
                                </a>
                              )}
                           </div>

                           {/* Metadata Grid */}
                           <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-500">
                              <div>
                                <span className="block uppercase tracking-widest mb-1 text-gray-700">Released</span>
                                <span className="text-gray-300">{project.createdAt ? new Date(project.createdAt).getFullYear() : 'N/A'}</span>
                              </div>
                              <div>
                                <span className="block uppercase tracking-widest mb-1 text-gray-700">Genre</span>
                                <span className="text-gray-300">{project.tags?.[0] || 'N/A'}</span>
                              </div>
                           </div>
                        </div>

                        {/* Right: Content, Description & Media */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-8">
                          
                          {/* Description */}
                          <div>
                            <h3 className="text-white font-mono text-lg font-bold mb-4 flex items-center gap-3">
                               ABOUT_PROJECT
                               <div className="h-px flex-1 bg-white/10" />
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-2xl">
                              {project.description}
                            </p>
                          </div>

                          {/* Media Embeds (YouTube / Spotify) */}
                          <div className="grid gap-4">
                            {/* YouTube Embed */}
                            {project.youtubeUrl && getYouTubeVideoId(project.youtubeUrl) && (
                                <div className="aspect-video w-full max-w-2xl bg-black rounded-sm overflow-hidden border border-white/10">
                                    <iframe
                                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.youtubeUrl)}`}
                                      title={project.title}
                                      width="100%"
                                      height="100%"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-full"
                                    />
                                </div>
                            )}

                            {/* Spotify Embed */}
                            {project.spotifyUrl && (
                                <div className="w-full max-w-2xl">
                                     <iframe 
                                        style={{ borderRadius: '12px' }} 
                                        src={`https://open.spotify.com/embed/track/${project.spotifyUrl.split('/').pop()?.split('?')[0]}?utm_source=generator&theme=0`} 
                                        width="100%" 
                                        height="152" 
                                        frameBorder="0" 
                                        allowFullScreen 
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                        loading="lazy"
                                        className="bg-transparent"
                                     />
                                </div>
                            )}
                          </div>

                          {/* External Links */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                            {project.youtubeUrl && (
                              <a 
                                href={project.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-sm text-xs font-mono text-red-400 transition-colors"
                              >
                                <Youtube size={14} /> YOUTUBE
                              </a>
                            )}
                            {project.websiteUrl && (
                              <a 
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-xs font-mono text-gray-300 transition-colors"
                              >
                                <ExternalLink size={14} /> VISIT WEBSITE
                              </a>
                            )}
                            {project.spotifyUrl && (
                              <a 
                                href={project.spotifyUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/20 rounded-sm text-xs font-mono text-[#1DB954] transition-colors"
                              >
                                <Music size={14} /> SPOTIFY
                              </a>
                            )}
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
