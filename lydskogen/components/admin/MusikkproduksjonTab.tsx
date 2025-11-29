'use client';

import { useState, useEffect } from 'react';
import { genreData } from '@/data/genres';

interface DemoTrack {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  description?: string;
  duration?: string;
}

const MUSIC_GENRES = ['ambient', 'hiphop', 'lofi', 'soundscape'];

export default function MusikkproduksjonTab() {
  const [demoTracks, setDemoTracks] = useState<Record<string, DemoTrack[]>>({});
  const [backgrounds, setBackgrounds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadingBg, setUploadingBg] = useState<Record<string, boolean>>({});
  const [uploadSuccess, setUploadSuccess] = useState<Record<string, string | null>>({});
  const [bgUploadSuccess, setBgUploadSuccess] = useState<Record<string, string | null>>({});
  
  const [forms, setForms] = useState<Record<string, { title: string; description: string; file: File | null }>>({});
  const [bgFiles, setBgFiles] = useState<Record<string, File | null>>({});
  const [bgPreviews, setBgPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const musicRes = await fetch('/api/music');
      if (musicRes.ok) {
        const musicData = await musicRes.json();
        const tracks: DemoTrack[] = musicData.music || [];
        const grouped = tracks.reduce<Record<string, DemoTrack[]>>((acc, track) => {
          const genreKey = track.genre || 'annet';
          if (MUSIC_GENRES.includes(genreKey)) {
            if (!acc[genreKey]) acc[genreKey] = [];
            acc[genreKey].push(track);
          }
          return acc;
        }, {});
        setDemoTracks(grouped);
      }

      const bgRes = await fetch('/api/genres/backgrounds');
      if (bgRes.ok) {
        const bgData = await bgRes.json();
        setBackgrounds(bgData.backgrounds || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (genreId: string, file: File | null) => {
    setForms(prev => ({
      ...prev,
      [genreId]: { ...(prev[genreId] || { title: '', description: '', file: null }), file }
    }));
  };

  const handleBgFileChange = (genreId: string, file: File | null) => {
    setBgFiles(prev => ({ ...prev, [genreId]: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgPreviews(prev => ({ ...prev, [genreId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setBgPreviews(prev => { const n = { ...prev }; delete n[genreId]; return n; });
    }
  };

  const handleDemoUpload = async (genreId: string) => {
    const form = forms[genreId] || { title: '', description: '', file: null };
    if (!form.file || !form.title?.trim()) {
      alert('Tittel og fil er påkrevd');
      return;
    }

    setUploading(prev => ({ ...prev, [genreId]: true }));
    setUploadSuccess(prev => ({ ...prev, [genreId]: null }));

    try {
      const formData = new FormData();
      formData.append('file', form.file);
      formData.append('title', form.title);
      formData.append('description', form.description || '');
      formData.append('genre', genreId);
      formData.append('price', '0');
      formData.append('status', 'available');
      formData.append('artist', 'Lydskog');

      const response = await fetch('/api/admin/upload-music', { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok && (result.message || result.music)) {
        setUploadSuccess(prev => ({ ...prev, [genreId]: 'Lastet opp!' }));
        setForms(prev => ({ ...prev, [genreId]: { title: '', description: '', file: null } }));
        setTimeout(() => setUploadSuccess(prev => ({ ...prev, [genreId]: null })), 3000);
        fetchData();
      } else {
        throw new Error(result.error || 'Kunne ikke laste opp');
      }
    } catch (error) {
      alert(`Feil: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    } finally {
      setUploading(prev => ({ ...prev, [genreId]: false }));
    }
  };

  const handleBgUpload = async (genreId: string) => {
    const file = bgFiles[genreId];
    if (!file) return;

    setUploadingBg(prev => ({ ...prev, [genreId]: true }));
    setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('genreId', genreId);

      const response = await fetch('/api/admin/upload-genre-background', { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok) {
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: 'Lastet opp!' }));
        setBgFiles(prev => ({ ...prev, [genreId]: null }));
        setBgPreviews(prev => { const n = { ...prev }; delete n[genreId]; return n; });
        setTimeout(() => setBgUploadSuccess(prev => ({ ...prev, [genreId]: null })), 3000);
        fetchData();
      } else {
        alert(`Feil: ${result.error || 'Kunne ikke laste opp'}`);
      }
    } catch (error) {
      alert(`Feil: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
    } finally {
      setUploadingBg(prev => ({ ...prev, [genreId]: false }));
    }
  };

  const handleDeleteDemo = async (trackId: string) => {
    if (!confirm('Slette denne demoen?')) return;
    try {
      const response = await fetch(`/api/admin/music?id=${trackId}`, { method: 'DELETE' });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const genreCards = (genreData && Array.isArray(genreData)) 
    ? genreData.filter(genre => genre && MUSIC_GENRES.includes(genre.id)) 
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laster...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-1">Musikkproduksjon</h2>
        <p className="text-gray-500 text-sm">Last opp demoer og bakgrunnsbilder per sjanger</p>
      </div>

      {/* Genre Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {genreCards.map((genre) => {
          if (!genre?.id) return null;
          const genreId = genre.id;
          const demos = demoTracks[genreId] || [];
          const form = forms[genreId] || { title: '', description: '', file: null };
          const bgFile = bgFiles[genreId];
          const bgPreview = bgPreviews[genreId];
          const currentBg = backgrounds[genreId];
          const isUploading = uploading[genreId] || false;
          const isUploadingBg = uploadingBg[genreId] || false;
          const successMsg = uploadSuccess[genreId];
          const bgSuccessMsg = bgUploadSuccess[genreId];

          return (
            <div key={genreId} className="bg-[#111] rounded-lg border border-white/10 overflow-hidden">
              {/* Genre Header */}
              <div className="p-4 border-b border-white/10 bg-[#0a0a0a]">
                <h3 className="text-lg font-medium text-white capitalize">
                  {genre.title || genreId}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {genre.shortDescription || 'Ingen beskrivelse'}
                </p>
              </div>

              <div className="p-4 space-y-6">
                {/* Background Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Bakgrunnsbilde
                  </label>
                  
                  {(currentBg || bgPreview) && (
                    <div className="mb-3 rounded-md overflow-hidden border border-white/10">
                      <img
                        src={bgPreview || currentBg}
                        alt="Bakgrunn"
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBgFileChange(genreId, e.target.files?.[0] || null)}
                      className="hidden"
                      id={`bg-${genreId}`}
                    />
                    <label
                      htmlFor={`bg-${genreId}`}
                      className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-md text-gray-400 text-sm text-center cursor-pointer hover:border-white/20 transition-all"
                    >
                      {bgFile ? bgFile.name : 'Velg bilde'}
                    </label>
                    {bgFile && (
                      <button
                        onClick={() => handleBgUpload(genreId)}
                        disabled={isUploadingBg}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
                      >
                        {isUploadingBg ? 'Laster...' : 'Last opp'}
                      </button>
                    )}
                  </div>
                  {bgSuccessMsg && <p className="text-xs text-green-400 mt-2">{bgSuccessMsg}</p>}
                </div>

                {/* Demo Upload Section */}
                <div className="border-t border-white/10 pt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Last opp demo
                  </label>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Tittel"
                      value={form.title || ''}
                      onChange={(e) => setForms(prev => ({
                        ...prev,
                        [genreId]: { ...(prev[genreId] || { description: '', file: null }), title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-md text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
                    />
                    
                    <textarea
                      placeholder="Beskrivelse (valgfritt)"
                      value={form.description || ''}
                      onChange={(e) => setForms(prev => ({
                        ...prev,
                        [genreId]: { ...(prev[genreId] || { title: '', file: null }), description: e.target.value }
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-md text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none resize-none transition-all"
                    />

                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange(genreId, e.target.files?.[0] || null)}
                        className="hidden"
                        id={`file-${genreId}`}
                      />
                      <label
                        htmlFor={`file-${genreId}`}
                        className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-md text-gray-400 text-sm text-center cursor-pointer hover:border-white/20 transition-all truncate"
                      >
                        {form.file ? form.file.name : 'Velg lydfil'}
                      </label>
                      <button
                        onClick={() => handleDemoUpload(genreId)}
                        disabled={isUploading || !form.file || !form.title?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isUploading ? 'Laster...' : 'Last opp'}
                      </button>
                    </div>
                    
                    {successMsg && <p className="text-xs text-green-400">{successMsg}</p>}
                  </div>
                </div>

                {/* Demo List */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">
                      Demoer
                    </label>
                    <span className="text-xs text-gray-600">{demos.length} spor</span>
                  </div>
                  
                  {demos.length === 0 ? (
                    <div className="text-sm text-gray-600 text-center py-6 border border-dashed border-white/10 rounded-md">
                      Ingen demoer
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {demos.map((demo) => (
                        <div
                          key={demo.id}
                          className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-white/10 rounded-md"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{demo.title}</p>
                            {demo.description && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{demo.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteDemo(demo.id)}
                            className="ml-3 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Slett
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
