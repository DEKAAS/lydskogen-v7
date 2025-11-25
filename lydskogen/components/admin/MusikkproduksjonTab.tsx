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

interface GenreBackground {
  genre_id: string;
  background_image_url: string;
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
  
  // Form state per genre
  const [forms, setForms] = useState<Record<string, { title: string; description: string; file: File | null }>>({});
  const [bgFiles, setBgFiles] = useState<Record<string, File | null>>({});
  const [bgPreviews, setBgPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch demo tracks
      try {
        const musicRes = await fetch('/api/music');
        if (!musicRes.ok) {
          console.warn('Failed to fetch music tracks:', musicRes.status, musicRes.statusText);
          setDemoTracks({});
        } else {
          try {
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
          } catch (parseError) {
            console.error('Error parsing music data:', parseError);
            setDemoTracks({});
          }
        }
      } catch (musicError) {
        console.error('Error fetching music tracks:', musicError);
        setDemoTracks({});
      }

      // Fetch backgrounds
      try {
        const bgRes = await fetch('/api/genres/backgrounds');
        if (!bgRes.ok) {
          console.warn('Failed to fetch genre backgrounds:', bgRes.status, bgRes.statusText);
          setBackgrounds({});
        } else {
          const bgData = await bgRes.json();
          setBackgrounds(bgData.backgrounds || {});
        }
      } catch (bgError) {
        console.error('Error fetching backgrounds:', bgError);
        setBackgrounds({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty defaults on error
      setDemoTracks({});
      setBackgrounds({});
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (genreId: string, file: File | null) => {
    setForms(prev => ({
      ...prev,
      [genreId]: {
        ...(prev[genreId] || { title: '', description: '', file: null }),
        file
      }
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
      setBgPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[genreId];
        return newPreviews;
      });
    }
  };

  const handleDemoUpload = async (genreId: string) => {
    // Sørg for at vi alltid har et form-objekt med default-verdier
    const form = forms[genreId] || { title: '', description: '', file: null };
    const title = (form.title || '').trim();

    if (!form.file || !title) {
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

      const response = await fetch('/api/admin/upload-music', {
        method: 'POST',
        body: formData
      });

      // Parse JSON response
      let result: any;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Kunne ikke lese server-respons');
      }

      if (!response.ok) {
        const errorMsg = result.details || result.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      if (result.message || result.music) {
        setUploadSuccess(prev => ({ ...prev, [genreId]: 'Demo lastet opp!' }));
        setForms(prev => ({
          ...prev,
          [genreId]: { title: '', description: '', file: null }
        }));
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        }, 3000);
        fetchData();
      } else {
        throw new Error(result.error || 'Kunne ikke laste opp');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Det oppstod en feil ved opplasting';
      setUploadSuccess(prev => ({ ...prev, [genreId]: null }));
      alert(`Feil: ${errorMessage}`);
    } finally {
      setUploading(prev => ({ ...prev, [genreId]: false }));
    }
  };

  const handleBgUpload = async (genreId: string) => {
    const file = bgFiles[genreId];
    if (!file) {
      alert('Velg et bilde først');
      return;
    }

    setUploadingBg(prev => ({ ...prev, [genreId]: true }));
    setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('genreId', genreId);

      const response = await fetch('/api/admin/upload-genre-background', {
        method: 'POST',
        body: formData
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let result: any;
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        alert(`Feil: Server returnerte ugyldig respons. Sjekk konsollen for detaljer.`);
        return;
      }

      // Parse JSON response
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        alert(`Feil: Kunne ikke lese server-respons.`);
        return;
      }

      if (!response.ok) {
        const errorMsg = result.details || result.error || `HTTP ${response.status}: ${response.statusText}`;
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        alert(`Feil: ${errorMsg}`);
        return;
      }

      if (result.message || result.background) {
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: 'Bakgrunnsbilde lastet opp!' }));
        setBgFiles(prev => ({ ...prev, [genreId]: null }));
        setBgPreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[genreId];
          return newPreviews;
        });
        // Clear success message after 3 seconds
        setTimeout(() => {
          setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        }, 3000);
        fetchData();
      } else {
        const errorMsg = result.error || 'Kunne ikke laste opp';
        setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
        alert(`Feil: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Background upload error:', error);
      let errorMessage = 'Det oppstod en feil ved opplasting';
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        errorMessage = 'Server returnerte ugyldig respons. Sjekk at API-ruten fungerer.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setBgUploadSuccess(prev => ({ ...prev, [genreId]: null }));
      alert(`Feil: ${errorMessage}`);
    } finally {
      setUploadingBg(prev => ({ ...prev, [genreId]: false }));
    }
  };

  const handleDeleteDemo = async (trackId: string, genreId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne demo-låten?')) return;

    try {
      const response = await fetch(`/api/admin/music?id=${trackId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      } else {
        try {
          const errorData = await response.json();
          alert(`Kunne ikke slette demo-låten: ${errorData.error || 'Ukjent feil'}`);
        } catch (parseError) {
          alert(`Kunne ikke slette demo-låten: HTTP ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Det oppstod en feil ved sletting';
      alert(`Feil: ${errorMessage}`);
    }
  };

  const genreCards = (genreData && Array.isArray(genreData)) 
    ? genreData.filter(genre => genre && MUSIC_GENRES.includes(genre.id)) 
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="border border-green-500 p-8">
          <div className="text-green-500 font-mono">LOADING...</div>
        </div>
      </div>
    );
  }

  if (!genreCards || genreCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="border border-green-500 p-8">
          <div className="text-green-500 font-mono">ERROR: NO GENRE DATA</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center border-b border-green-800 pb-4 bg-black/60">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-400 mb-2 tracking-wide">
          MUSIKKPRODUKSJON · DEMOS
        </h2>
        <p className="text-green-600/80 font-mono text-sm">
          Last opp demoer og bakgrunner per sjanger
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {genreCards.map((genre) => {
          if (!genre || !genre.id) return null;
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
            <div
              key={genreId}
              className="border border-green-800/70 bg-black/80 shadow-[0_0_25px_rgba(0,255,140,0.1)]"
            >
              {/* Genre Header */}
              <div className="p-4 border-b border-green-800 bg-black/70">
                <h3 className="text-xl font-mono font-bold text-green-300 mb-1 tracking-wide">
                  {(genre.title || genreId || 'UNKNOWN').toUpperCase()}
                </h3>
                <p className="text-xs text-green-500/80 font-mono">
                  {genre.shortDescription || 'No description available'}
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* Background Image Upload */}
                <div>
                  <label className="block text-xs font-mono font-bold text-green-400 mb-2 uppercase tracking-wide">
                    Background Image
                  </label>
                  
                  {currentBg && (
                    <div className="mb-3 border border-green-900 overflow-hidden">
                      <img
                        src={currentBg}
                        alt={`${genre.title} bakgrunn`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {bgPreview && (
                    <div className="mb-3 border border-green-900 overflow-hidden">
                      <p className="text-xs text-green-500 font-mono mb-2 p-2 bg-black/80 border-b border-green-900">
                        PREVIEW:
                      </p>
                      <img
                        src={bgPreview}
                        alt="Forhåndsvisning"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleBgFileChange(genreId, e.target.files?.[0] || null)}
                      className="hidden"
                      id={`bg-${genreId}`}
                    />
                    <label
                      htmlFor={`bg-${genreId}`}
                      className="flex-1 px-3 py-2 border border-green-700 bg-black/80 text-green-400 font-mono text-xs cursor-pointer text-center hover:bg-green-500 hover:text-black transition"
                    >
                      {bgFile ? '[CHANGE]' : '[SELECT]'}
                    </label>
                    {bgFile && (
                      <button
                        onClick={() => handleBgUpload(genreId)}
                        disabled={isUploadingBg}
                        className="px-3 py-2 border border-green-700 bg-black/80 text-green-400 font-mono text-xs disabled:opacity-40 hover:bg-green-500 hover:text-black transition"
                      >
                        {isUploadingBg ? '[UPLOADING...]' : '[UPLOAD]'}
                      </button>
                    )}
                  </div>
                  {bgSuccessMsg && (
                    <p className="text-xs mt-2 text-green-400 font-mono">
                      {bgSuccessMsg}
                    </p>
                  )}
                </div>

                {/* Demo Upload Form */}
                <div>
                  <label className="block text-xs font-mono font-bold text-green-400 mb-2 uppercase tracking-wide">
                    Upload Demo Track
                  </label>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="TITLE *"
                      value={form.title || ''}
                      onChange={(e) => setForms(prev => ({
                        ...prev,
                        [genreId]: { ...(prev[genreId] || { description: '', file: null }), title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-green-700 bg-black/80 text-green-100 font-mono text-sm placeholder-green-700"
                    />
                    
                    <textarea
                      placeholder="DESCRIPTION (OPTIONAL)"
                      value={form.description}
                      onChange={(e) => setForms(prev => ({
                        ...prev,
                        [genreId]: { ...prev[genreId] || { title: '', file: null }, description: e.target.value }
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-green-700 bg-black/80 text-green-100 font-mono text-sm resize-none placeholder-green-700"
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
                        className="flex-1 px-3 py-2 border border-green-700 bg-black/80 text-green-100 font-mono text-xs cursor-pointer text-center hover:bg-green-500 hover:text-black transition"
                      >
                        {form.file ? form.file.name.toUpperCase() : '[SELECT FILE]'}
                      </label>
                      <button
                        onClick={() => handleDemoUpload(genreId)}
                        // Bruk trygg trimming slik at vi aldri kaller trim() på undefined
                        disabled={
                          isUploading ||
                          !form.file ||
                          !(form.title && (form.title as string).trim())
                        }
                        className="px-3 py-2 border border-green-700 bg-black/80 text-green-100 font-mono text-xs disabled:opacity-40 hover:bg-green-500 hover:text-black transition"
                      >
                        {isUploading ? '[UPLOADING...]' : '[UPLOAD]'}
                      </button>
                    </div>
                    
                    {successMsg && (
                      <p className="text-xs text-green-400 font-mono">
                        {successMsg}
                      </p>
                    )}
                  </div>
                </div>

                {/* Demo List */}
                <div>
                  <label className="block text-xs font-mono font-bold text-green-400 mb-2 uppercase tracking-wide">
                    Demos ({demos.length})
                  </label>
                  
                  {demos.length === 0 ? (
                    <div className="text-xs text-green-600 font-mono text-center py-4 border border-green-800 bg-black/70">
                      NO DEMOS
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {demos.map((demo) => (
                        <div
                          key={demo.id}
                          className="flex items-center justify-between p-2 border border-green-800 bg-black/80"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-mono font-bold text-green-300">{demo.title.toUpperCase()}</p>
                            {demo.description && (
                              <p className="text-xs text-green-500 font-mono mt-1">{demo.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteDemo(demo.id, genreId)}
                            className="px-2 py-1 border border-red-500 bg-black text-red-500 font-mono text-xs hover:bg-red-500 hover:text-black"
                          >
                            [DELETE]
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

