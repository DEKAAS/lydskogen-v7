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

  useEffect(() => {
    fetchProjects();
  }, []);

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
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Kunne ikke legge til prosjekt');
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Prosjekter</h2>
          <p className="text-gray-400 text-sm">Administrer prosjekter som vises på forsiden</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ 
            backgroundColor: showForm ? 'var(--card-bg)' : 'var(--accent-green)', 
            color: showForm ? 'var(--text-color)' : 'white',
            border: '1px solid var(--border-color)'
          }}
        >
          {showForm ? 'Avbryt' : '+ Nytt Prosjekt'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div 
          className="p-6 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
            Legg til nytt prosjekt
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Tittel *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ 
                    backgroundColor: 'var(--section-bg-2)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
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
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ 
                    backgroundColor: 'var(--section-bg-2)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
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

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                Beskrivelse *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
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
                  Spotify URL
                </label>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ 
                    backgroundColor: 'var(--section-bg-2)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder="https://open.spotify.com/..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Website URL
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ 
                    backgroundColor: 'var(--section-bg-2)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
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
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ 
                    backgroundColor: 'var(--section-bg-2)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded text-sm font-medium"
              style={{ 
                backgroundColor: 'var(--accent-green)', 
                color: 'white',
                border: '1px solid var(--accent-green)'
              }}
            >
              Legg til prosjekt
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
          className="p-12 rounded-lg text-center"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          <p className="text-gray-400">Ingen prosjekter ennå</p>
          <p className="text-gray-500 text-sm mt-2">Klikk &quot;+ Nytt Prosjekt&quot; for å legge til</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg overflow-hidden"
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

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-full py-2 px-3 rounded text-xs"
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    color: '#ff6b6b'
                  }}
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

