'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  artist?: string;
  artworkUrl: string;
  description: string;
  tags?: string[];
  spotifyUrl?: string;
  websiteUrl?: string;
  musicUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [artworkUrl, setArtworkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Spotify metadata when URL is entered
  const handleSpotifyUrlChange = async (url: string) => {
    setSpotifyUrl(url);
    setFormError(null);
    
    // Validate Spotify URL
    const spotifyUrlPattern = /^https?:\/\/(open|play)\.spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+/;
    if (!spotifyUrlPattern.test(url)) {
      return; // Not a valid Spotify URL yet
    }

    setLoadingSpotify(true);
    try {
      const response = await fetch(`/api/spotify/metadata?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        const metadata = data.metadata;
        
        // Auto-fill form fields
        if (metadata.title) setTitle((prev) => prev || metadata.title);
        if (metadata.artist) setArtist((prev) => prev || metadata.artist);
        if (metadata.thumbnail) {
          setArtworkUrl(metadata.thumbnail);
          setPreviewError(false);
        }
      }
    } catch (error) {
      console.error('Error fetching Spotify metadata:', error);
      setFormError('Kunne ikke hente Spotify-data. Kontroller lenken.');
    } finally {
      setLoadingSpotify(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormMessage(null);

    if (!title.trim() || !artworkUrl.trim()) {
      setFormError('Tittel og bilde-URL må fylles ut.');
      return;
    }
    
    const newProject = {
      title,
      artist: artist || undefined,
      artworkUrl,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      spotifyUrl: spotifyUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      musicUrl: musicUrl || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });

      if (res.ok) {
        // Reset form
        setTitle('');
        setArtist('');
        setArtworkUrl('');
        setDescription('');
        setTags('');
        setSpotifyUrl('');
        setWebsiteUrl('');
        setMusicUrl('');
        setShowForm(false);
        setPreviewError(false);
        setFormMessage('Prosjektet ble lagret!');
        fetchProjects();
      } else {
        const data = await res.json();
        setFormError(data?.error || 'Kunne ikke lagre prosjektet.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setFormError('Kunne ikke legge til prosjekt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) return;

    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-green-500 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-2">PORTFOLIO PROJECTS</h2>
          <p className="text-green-600 font-mono text-sm">Manage projects displayed on frontend</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black"
        >
          {showForm ? '[CANCEL]' : '[+ NEW PROJECT]'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div 
          className="p-4 border border-green-500 bg-black"
        >
          <h3 className="text-lg font-mono font-bold mb-4 text-green-500">
            ADD NEW PROJECT
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1 text-green-500 uppercase">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm placeholder-green-600"
                  placeholder="F.eks: MODAN - Projections"
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Artist (valgfritt)
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-3 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm placeholder-green-600"
                  placeholder="F.eks: MODAN"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                Bilde URL *
              </label>
              <input
                type="text"
                value={artworkUrl}
                onChange={(e) => setArtworkUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded text-sm"
                style={{ 
                  backgroundColor: 'var(--section-bg-2)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
                placeholder="https://..."
              />
            </div>
            {artworkUrl && (
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  Forhåndsvisning
                </p>
                {!previewError ? (
                  <img
                    src={artworkUrl}
                    alt="Artwork preview"
                    className="w-full rounded-lg border border-white/10 object-cover max-h-60"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className="p-3 text-xs rounded border border-red-500/30 text-red-300">
                    Kunne ikke laste bildet. Kontroller URL.
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                Beskrivelse (valgfritt)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ 
                  backgroundColor: 'var(--section-bg-2)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
                placeholder="Beskriv prosjektet..."
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                Tags (kommadelt, valgfritt)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ 
                  backgroundColor: 'var(--section-bg-2)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
                placeholder="ambient, miksing, mastering"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Spotify URL {loadingSpotify && <span className="text-xs">(Henter metadata...)</span>}
                </label>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                  onBlur={(e) => {
                    // Also fetch on blur if URL is valid
                    if (e.target.value) {
                      handleSpotifyUrlChange(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm placeholder-green-600"
                  placeholder="https://open.spotify.com/track/..."
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Lim inn Spotify-link for å automatisk hente bilde og info
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Website URL
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm placeholder-green-600"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Musikk URL
                </label>
                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm placeholder-green-600"
                  placeholder="https://..."
                />
              </div>
            </div>

            {formError && (
              <div className="text-sm text-red-400">{formError}</div>
            )}
            {formMessage && (
              <div className="text-sm text-green-400">{formMessage}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 border border-green-500 bg-black text-green-500 font-mono text-sm disabled:opacity-60 hover:bg-green-500 hover:text-black"
            >
              {submitting ? '[SAVING...]' : '[ADD PROJECT]'}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Laster prosjekter...</div>
        </div>
      ) : projects.length === 0 ? (
        <div 
          className="p-12 text-center border border-green-500 bg-black"
        >
          <p className="text-gray-400">Ingen prosjekter ennå</p>
          <p className="text-gray-500 text-sm mt-2">Klikk &quot;+ Nytt Prosjekt&quot; for å legge til</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden border border-green-500 bg-black"
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
                    <span className="text-4xl" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-color)' }}>
                  {project.title}
                </h3>
                {project.artist && (
                  <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    {project.artist}
                  </p>
                )}
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded"
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

                {/* Links */}
                <div className="flex gap-2 mb-3 text-xs">
                  {project.spotifyUrl && (
                    <a 
                      href={project.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      Spotify
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Nettside
                    </a>
                  )}
                  {project.musicUrl && !project.spotifyUrl && (
                    <a 
                      href={project.musicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      Musikk
                    </a>
                  )}
                </div>

                <div className="text-[10px] text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString('no-NO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-full py-2 px-3 border border-red-500 bg-black text-red-500 font-mono text-xs hover:bg-red-500 hover:text-black"
                >
                  [DELETE]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

