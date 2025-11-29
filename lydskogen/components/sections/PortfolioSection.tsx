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
      <div className="py-24 bg-[#050605] text-center font-mono text-gray-500">
        [LOADING_ARCHIVE...]
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="bg-[#050605] min-h-screen relative pb-0">
      {/* Section Header - Technical Style */}
      <div className="sticky top-0 z-30 bg-[#050605]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <h2 className="font-mono text-lg md:text-2xl text-white font-bold tracking-tighter">
            [02] PROSJEKTER
          </h2>
          <div className="hidden md:flex gap-4 text-xs font-mono text-gray-500">
            <span>TOTAL_ENTRIES: {projects.length.toString().padStart(2, '0')}</span>
            <span>STATUS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Projects Tracklist - Technical Archive Style */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-8">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 px-2">
          <div className="col-span-1">ID</div>
          <div className="col-span-7 md:col-span-4">TITLE</div>
          <div className="col-span-2 hidden md:block">ARTIST</div>
          <div className="col-span-2 hidden md:block">TYPE</div>
          <div className="col-span-4 md:col-span-3 text-right">LINKS</div>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative grid grid-cols-12 gap-4 items-center p-3 border-b border-white/5 hover:bg-white/5 transition-colors duration-200 rounded-sm"
            >
              {/* ID Column */}
              <div className="col-span-1 font-mono text-xs text-gray-600 group-hover:text-accent-green transition-colors">
                {index.toString().padStart(3, '0')}
              </div>

              {/* Title Column (with Artwork thumbnail on hover?) */}
              <div className="col-span-7 md:col-span-4 flex items-center gap-4">
                {/* Thumbnail - Visible on Desktop Hover or Mobile Default? Let's keep it minimal list first */}
                <div className="w-8 h-8 bg-white/10 overflow-hidden rounded-sm relative group-hover:scale-105 transition-transform">
                    {project.artworkUrl ? (
                        <img src={project.artworkUrl} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">N/A</div>
                    )}
                </div>
                <span className="font-mono text-sm text-white font-bold group-hover:text-accent-green transition-colors truncate">
                  {project.title}
                </span>
              </div>

              {/* Artist Column */}
              <div className="col-span-2 hidden md:block font-mono text-xs text-gray-400 truncate">
                {project.artist || '-'}
              </div>

              {/* Type Column */}
              <div className="col-span-2 hidden md:block">
                {project.tags && project.tags.length > 0 ? (
                  <span className="inline-block px-2 py-0.5 border border-white/10 rounded-full text-[9px] font-mono text-gray-500 uppercase">
                    {project.tags[0]}
                  </span>
                ) : (
                  <span className="text-gray-600 text-[10px]">-</span>
                )}
              </div>

              {/* Links Column */}
              <div className="col-span-4 md:col-span-3 flex justify-end gap-2">
                {project.spotifyUrl && (
                  <a 
                    href={project.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 hover:bg-[#1DB954] hover:text-black rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                    title="Open in Spotify"
                  >
                    <span className="hidden md:inline">SPOTIFY</span>
                    <span className="md:hidden">SP</span>
                    <span>↗</span>
                  </a>
                )}
                {project.websiteUrl && (
                  <a 
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/5 text-gray-300 border border-white/10 hover:bg-white hover:text-black rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                    title="Visit Website"
                  >
                    <span className="hidden md:inline">WEB</span>
                    <span className="md:hidden">WB</span>
                    <span>↗</span>
                  </a>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
