'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Music } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  artist?: string;
  artworkUrl: string;
  musicUrl?: string;
  description: string;
  tags?: string[];
  credits?: string[];
  spotifyUrl?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  createdAt?: string;
}

const CREDIT_LABELS: Record<string, string> = {
  mixed: 'Mixed',
  produced: 'Produced',
  mastered: 'Mastered',
  artwork: 'Artwork',
  sound_design: 'Sound Design',
  composed: 'Composed',
};

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
      <div className="bg-[#07100b] px-4 py-24 text-center text-stone-500 md:px-8">
        Laster prosjekter...
      </div>
    );
  }

  if (projects.length === 0) return null;

  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="relative overflow-hidden bg-[#07100b] px-4 py-24 text-stone-100 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-20 h-72 w-72 rounded-full bg-[#8a6f4d]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[5%] h-80 w-80 rounded-full bg-[#4f6f52]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#b6a98c]">Prosjekter</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Utvalgt arbeid
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
            Et lite utvalg av prosjekter som viser lydarbeid, artwork og visuell retning. Holdt enkelt, slik at arbeidet får puste.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="aspect-square bg-white/5">
                {project.artworkUrl ? (
                  <img
                    src={project.artworkUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-500">
                    <Music size={40} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.credits?.slice(0, 3).map((credit) => (
                    <span
                      key={credit}
                      className="rounded-full border border-[#b6a98c]/20 bg-[#b6a98c]/10 px-3 py-1 text-xs text-[#e6dcc4]"
                    >
                      {CREDIT_LABELS[credit] || credit}
                    </span>
                  ))}
                  {!project.credits?.length && project.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-white">{project.title}</h3>
                {project.artist && <p className="mt-1 text-sm text-[#b6a98c]">{project.artist}</p>}
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-stone-300">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.spotifyUrl && (
                    <a
                      href={project.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition-colors hover:bg-white/10"
                    >
                      Spotify
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition-colors hover:bg-white/10"
                    >
                      Nettside <ExternalLink size={14} />
                    </a>
                  )}
                  {project.youtubeUrl && (
                    <a
                      href={project.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition-colors hover:bg-white/10"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
