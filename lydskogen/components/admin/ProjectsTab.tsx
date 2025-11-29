'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  artist?: string;
  artworkUrl: string;
  description: string;
  tags?: string[];
  credits?: string[];
  spotifyUrl?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  musicUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// Available credit options
const CREDIT_OPTIONS = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'produced', label: 'Produced' },
  { id: 'mastered', label: 'Mastered' },
  { id: 'artwork', label: 'Artwork' },
  { id: 'sound_design', label: 'Sound Design' },
  { id: 'composed', label: 'Composed' },
];

// Helper to extract YouTube video ID
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

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [artworkUrl, setArtworkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [credits, setCredits] = useState<string[]>([]);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [youtubeThumbnail, setYoutubeThumbnail] = useState<string | null>(null);

  const toggleCredit = (creditId: string) => {
    setCredits(prev => 
      prev.includes(creditId) 
        ? prev.filter(c => c !== creditId)
        : [...prev, creditId]
    );
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Spotify metadata when URL is entered
  const handleSpotifyUrlChange = async (url: string) => {
    setSpotifyUrl(url);
    setFormError(null);
    
    const spotifyUrlPattern = /^https?:\/\/(open|play)\.spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+/;
    if (!spotifyUrlPattern.test(url)) return;

    setLoadingSpotify(true);
    try {
      const response = await fetch(`/api/spotify/metadata?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        const metadata = data.metadata;
        if (metadata.title && !title) setTitle(metadata.title);
        if (metadata.artist && !artist) setArtist(metadata.artist);
        if (metadata.thumbnail && !artworkUrl) {
          setArtworkUrl(metadata.thumbnail);
          setPreviewError(false);
        }
      }
    } catch (error) {
      console.error('Error fetching Spotify metadata:', error);
    } finally {
      setLoadingSpotify(false);
    }
  };

  // Fetch YouTube thumbnail when URL is entered
  const handleYoutubeUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    setYoutubeThumbnail(null);
    
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return;

    setLoadingYoutube(true);
    try {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setYoutubeThumbnail(thumbnailUrl);
      
      if (!artworkUrl) {
        setArtworkUrl(thumbnailUrl);
        setPreviewError(false);
      }
    } catch (error) {
      console.error('Error fetching YouTube thumbnail:', error);
    } finally {
      setLoadingYoutube(false);
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

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setArtworkUrl('');
    setDescription('');
    setTags('');
    setCredits([]);
    setSpotifyUrl('');
    setWebsiteUrl('');
    setYoutubeUrl('');
    setMusicUrl('');
    setShowForm(false);
    setEditingProject(null);
    setPreviewError(false);
    setYoutubeThumbnail(null);
    setFormError(null);
    setFormMessage(null);
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setArtist(project.artist || '');
    setArtworkUrl(project.artworkUrl);
    setDescription(project.description || '');
    setTags(project.tags?.join(', ') || '');
    setCredits(project.credits || []);
    setSpotifyUrl(project.spotifyUrl || '');
    setWebsiteUrl(project.websiteUrl || '');
    setYoutubeUrl(project.youtubeUrl || '');
    setMusicUrl(project.musicUrl || '');
    setShowForm(true);
    setPreviewError(false);
    
    // Set YouTube thumbnail if URL exists
    if (project.youtubeUrl) {
      const videoId = getYouTubeVideoId(project.youtubeUrl);
      if (videoId) {
        setYoutubeThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      }
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
    
    const projectData = {
      id: editingProject?.id,
      title,
      artist: artist || undefined,
      artworkUrl,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      credits: credits.length > 0 ? credits : undefined,
      spotifyUrl: spotifyUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      youtubeUrl: youtubeUrl || undefined,
      musicUrl: musicUrl || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/projects', {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (res.ok) {
        resetForm();
        setFormMessage(editingProject ? 'Prosjektet ble oppdatert!' : 'Prosjektet ble lagret!');
        fetchProjects();
      } else {
        const data = await res.json();
        setFormError(data?.error || 'Kunne ikke lagre prosjektet.');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setFormError('Kunne ikke lagre prosjekt.');
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">Prosjekter</h2>
          <p className="text-gray-500 text-sm">Administrer prosjekter som vises på forsiden</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
            showForm 
              ? 'bg-white/10 text-white border border-white/20' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showForm ? 'Avbryt' : '+ Nytt prosjekt'}
        </button>
      </div>

      {/* Success Message (outside form) */}
      {formMessage && !showForm && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-green-400 text-sm">
          {formMessage}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[#111] rounded-lg border border-white/10 p-6 space-y-6">
          <h3 className="text-lg font-medium text-white">
            {editingProject ? `Rediger: ${editingProject.title}` : 'Legg til nytt prosjekt'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tittel <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Prosjektnavn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Artistnavn"
                />
              </div>
            </div>

            {/* Artwork URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bilde URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={artworkUrl}
                onChange={(e) => { setArtworkUrl(e.target.value); setPreviewError(false); }}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {artworkUrl && (
                <div className="mt-3">
                  {!previewError ? (
                    <img
                      src={artworkUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-white/10"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="text-red-400 text-sm">Kunne ikke laste bildet</div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Beskrivelse
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Kort beskrivelse av prosjektet..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags <span className="text-gray-500 text-xs">(kommaseparert)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="ambient, miksing, mastering"
              />
            </div>

            {/* Credits Section */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Kreditering - By Lydskog</h4>
              <p className="text-xs text-gray-500 mb-4">Velg hva Lydskog bidro med på dette prosjektet</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CREDIT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                      credits.includes(option.id)
                        ? 'bg-blue-500/20 border-blue-500/50 text-white'
                        : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={credits.includes(option.id)}
                      onChange={() => toggleCredit(option.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      credits.includes(option.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-white/20'
                    }`}>
                      {credits.includes(option.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Media Links Section */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Medielenker</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YouTube URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube URL {loadingYoutube && <span className="text-blue-400 text-xs ml-2">Henter...</span>}
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {youtubeThumbnail && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={youtubeThumbnail}
                        alt="YouTube thumbnail"
                        className="w-24 h-14 object-cover rounded border border-white/10"
                        onError={() => setYoutubeThumbnail(null)}
                      />
                      <span className="text-xs text-gray-500">YouTube thumbnail</span>
                    </div>
                  )}
                </div>

                {/* Spotify URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spotify URL {loadingSpotify && <span className="text-green-400 text-xs ml-2">Henter...</span>}
                  </label>
                  <input
                    type="text"
                    value={spotifyUrl}
                    onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                    placeholder="https://open.spotify.com/track/..."
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nettside URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>

                {/* Music URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Direkte musikk-URL
                  </label>
                  <input
                    type="text"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm">
                {formError}
              </div>
            )}
            {formMessage && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-green-400 text-sm">
                {formMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Lagrer...' : editingProject ? 'Lagre endringer' : 'Legg til prosjekt'}
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
                >
                  Avbryt
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Laster prosjekter...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#111] rounded-lg border border-white/10 p-12 text-center">
          <p className="text-gray-400 mb-2">Ingen prosjekter ennå</p>
          <p className="text-gray-600 text-sm">Klikk &quot;+ Nytt prosjekt&quot; for å legge til</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111] rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-all group"
            >
              {/* Artwork */}
              <div className="aspect-video relative bg-[#0a0a0a]">
                {project.artworkUrl ? (
                  <img 
                    src={project.artworkUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-700">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-white text-lg">
                    {project.title}
                  </h3>
                  {project.artist && (
                    <p className="text-gray-500 text-sm">{project.artist}</p>
                  )}
                </div>

                {project.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Credits */}
                {project.credits && project.credits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.credits.map((credit) => (
                      <span
                        key={credit}
                        className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {CREDIT_OPTIONS.find(c => c.id === credit)?.label || credit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.youtubeUrl && (
                    <a 
                      href={project.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      YouTube
                    </a>
                  )}
                  {project.spotifyUrl && (
                    <a 
                      href={project.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      Spotify
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      Nettside
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString('no-NO')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(project)}
                      className="text-xs px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-xs px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Slett
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
