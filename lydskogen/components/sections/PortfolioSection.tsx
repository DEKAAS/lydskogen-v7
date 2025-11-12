'use client';

import { useState, useEffect } from 'react';

interface PortfolioProject {
  id: string;
  title: string;
  artist?: string;
  artworkUrl: string;
  musicUrl?: string;
  description: string;
  tags?: string[];
  spotifyUrl?: string;
  websiteUrl?: string;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
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
      <section className="py-12" style={{ backgroundColor: 'var(--section-bg-1)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p style={{ color: 'var(--text-muted)' }}>Laster...</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-12" style={{ backgroundColor: 'var(--section-bg-1)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>Portfolio</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tidligere prosjekter</p>
          </div>
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kommer snart</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Kom tilbake senere</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={{ backgroundColor: 'var(--section-bg-1)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>Portfolio</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tidligere prosjekter</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded overflow-hidden"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
            >
              {/* Artwork */}
              <div className="aspect-square relative" style={{ backgroundColor: 'var(--section-bg-2)' }}>
                {project.artworkUrl ? (
                  <img 
                    src={project.artworkUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-3xl" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                
                {/* Links */}
                {(project.spotifyUrl || project.musicUrl || project.websiteUrl) && (
                  <div className="absolute top-1 right-1 flex gap-1">
                    {project.spotifyUrl && (
                      <a
                        href={project.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full text-xs"
                        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                      >
                        ♪
                      </a>
                    )}
                    {project.websiteUrl && (
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full text-xs"
                        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                      >
                        →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <h3 className="text-xs font-semibold truncate mb-0.5" style={{ color: 'var(--text-color)' }}>
                  {project.title}
                </h3>
                {project.artist && (
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {project.artist}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: 'var(--section-bg-2)', 
                          color: 'var(--text-muted)', 
                          border: '1px solid var(--border-color)' 
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
