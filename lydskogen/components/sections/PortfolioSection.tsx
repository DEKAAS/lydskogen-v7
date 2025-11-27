'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  createdAt?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="py-24 bg-base-dark text-center font-mono text-gray-500">
        [LOADING_ARCHIVE...]
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="portfolio" className="bg-gradient-to-b from-[#000000] to-[#050605] min-h-screen relative">
      {/* Section Header - Technical Style */}
      <div className="sticky top-0 z-30 bg-base-dark/95 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-4 flex justify-between items-center">
          <h2 className="font-mono text-lg md:text-2xl text-white font-bold tracking-tighter">
            [02] PROSJEKTER
          </h2>
          <div className="hidden md:flex gap-4 text-xs font-mono text-gray-500">
            <span>TOTAL_ENTRIES: {projects.length.toString().padStart(2, '0')}</span>
            <span>STATUS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Projects Grid - Technical Archive Style */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative border-b md:border-r border-white/10 bg-base-dark hover:bg-white/5 transition-colors duration-300"
            >
              {/* Image Container */}
              <div className="aspect-square relative overflow-hidden p-4">
                <div className="w-full h-full relative">
                  
                  {/* Image with direct grayscale filter */}
                  {project.artworkUrl ? (
                    <img 
                      src={project.artworkUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover border border-white/10 relative z-0 grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full border border-white/10 flex items-center justify-center bg-white/5 relative z-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                      <span className="font-mono text-4xl text-white/20">{project.title[0]}</span>
                    </div>
                  )}
                  
                  {/* Dark overlay that fades out on hover - POINTER EVENTS NONE */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />

                  {/* Technical Overlays - High Z-Index & Explicit Pointer Events */}
                  <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                    {project.spotifyUrl && (
                      <a 
                        href={project.spotifyUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-[#1DB954] text-black px-3 py-1.5 text-[10px] font-mono font-bold hover:bg-white hover:scale-105 transition-all shadow-lg cursor-pointer pointer-events-auto flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>SPOTIFY</span>
                        <span>↗</span>
                      </a>
                    )}
                    {project.websiteUrl && (
                      <a 
                        href={project.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-white text-black px-3 py-1.5 text-[10px] font-mono font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg cursor-pointer pointer-events-auto flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>WEB</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata Footer - Receipt Style */}
              <div className="p-4 pt-0 flex flex-col gap-2">
                <div className="flex justify-between items-start border-t border-white/10 pt-3">
                  <h3 className="text-white font-mono text-sm font-bold uppercase truncate pr-4">
                    {project.title}
                  </h3>
                  <span className="text-accent-green font-mono text-xs">
                    {index.toString().padStart(3, '0')}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-0.5">
                    {project.artist && (
                      <span className="text-gray-400 font-mono text-xs uppercase">
                        ARTIST: {project.artist}
                      </span>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <span className="text-gray-500 font-mono text-[10px] uppercase">
                        TYPE: {project.tags[0]}
                      </span>
                    )}
                  </div>
                  
                  {/* Interactive Indicator */}
                  <div className="w-2 h-2 bg-gray-800 group-hover:bg-accent-green rounded-full transition-colors duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
