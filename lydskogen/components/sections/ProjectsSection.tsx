'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Project = {
  id: string
  title: string
  artworkUrl: string
  musicUrl?: string
  description?: string
  tags?: string[]
  createdAt: string
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])).catch(()=>{})
  }, [])

  return (
    <section id="projects" className="py-16" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-2" style={{color: 'var(--text-on-dark)'}}>Tidligere prosjekter</h2>
          <p className="text-gray-300">Et utvalg av arbeid vi har levert – lyd og visuell identitet</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.06 }}
          viewport={{ once: true }}
        >
          {projects.map((p, idx) => (
            <motion.div key={p.id}
              className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.35)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video">
                <img src={p.artworkUrl} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  {p.musicUrl && (
                    <a href={p.musicUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded text-sm font-medium"
                      style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>Hør</a>
                  )}
                </div>
                {p.description && <p className="text-sm text-gray-300 mb-3">{p.description}</p>}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded border border-white/10 bg-black/20 text-gray-300">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              {/* subtle floating particles per card */}
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white/60"
                    style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}
                    animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 5 + Math.random()*3, repeat: Infinity, ease: 'easeInOut', delay: i*0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center text-gray-400">Ingen prosjekter enda.</div>
        )}
      </div>
    </section>
  )
}


