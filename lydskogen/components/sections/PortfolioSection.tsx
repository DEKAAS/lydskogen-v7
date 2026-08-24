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
      <div className="bg-[#f4efe4] px-5 py-24 text-center text-[#5c604f]">
        Laster prosjekter...
      </div>
    );
  }

  if (projects.length === 0) return null;

  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="bg-[#f4efe4] px-5 text-[#1d241d]">
      <div className="mx-auto max-w-6xl border-t border-[#d8caa8] py-16 md:py-24">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Prosjekter</p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#1d241d] md:text-6xl">
              Utvalgt arbeid
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#4f5749] md:text-lg">
            Et lite utvalg av prosjekter som viser lydarbeid, artwork og visuell retning. Holdt enkelt, slik at arbeidet får puste.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[1.5rem] border border-[#d8caa8] bg-white/40"
            >
              <div className="aspect-square bg-[#e7ddc9]">
                {project.artworkUrl ? (
                  <img
                    src={project.artworkUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#8a7d62]">
                    <Music size={40} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.credits?.slice(0, 3).map((credit) => (
                    <span
                      key={credit}
                      className="rounded-full border border-[#d8caa8] bg-[#eee6d5] px-3 py-1 text-xs text-[#5c604f]"
                    >
                      {CREDIT_LABELS[credit] || credit}
                    </span>
                  ))}
                  {!project.credits?.length && project.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d8caa8] bg-[#eee6d5] px-3 py-1 text-xs text-[#5c604f]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-[#1d241d]">{project.title}</h3>
                {project.artist && <p className="mt-1 text-sm text-[#8a7d62]">{project.artist}</p>}
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#4f5749]">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.spotifyUrl && (
                    <a
                      href={project.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#d8caa8] px-4 py-2 text-sm text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                    >
                      Spotify
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#d8caa8] px-4 py-2 text-sm text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                    >
                      Nettside <ExternalLink size={14} />
                    </a>
                  )}
                  {project.youtubeUrl && (
                    <a
                      href={project.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#d8caa8] px-4 py-2 text-sm text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
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
