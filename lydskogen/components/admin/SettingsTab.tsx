'use client';

import { useState, useEffect } from 'react';

export default function SettingsTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string, section: string = 'hero', description: string = '') => {
    setSaving(key);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, section, description })
      });
      
      if (res.ok) {
        setContent(prev => ({ ...prev, [key]: value }));
        setSuccess(key);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Feil ved lagring: ${errorData.error || 'Ukjent feil'}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Feil ved lagring');
    } finally {
      setSaving(null);
    }
  };

  const handleImageUpload = async (file: File, key: string) => {
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);

      // Re-using the genre background upload route for now as it handles generic image uploads to storage
      // Alternatively, we could create a dedicated content-image route. 
      // Let's assume we can use a generic upload endpoint.
      const res = await fetch('/api/admin/upload-content-image', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        handleSave(key, data.url, 'about', 'Bilde for Om-seksjon');
      } else {
        alert('Feil ved opplasting');
      }
    } catch (error) {
      console.error(error);
      alert('Feil ved opplasting');
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laster innstillinger...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-1">Innstillinger</h2>
        <p className="text-gray-500 text-sm">Administrer nettsidens tekster og innhold</p>
      </div>

      {/* Hero Section Settings */}
      <div className="bg-[#111] rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Forside (Hero)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tagline / Undertittel
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Teksten som vises under &quot;LYDSKOG&quot; på forsiden.
            </p>
            <textarea
              value={content['hero_tagline'] || ''}
              onChange={(e) => setContent(prev => ({ ...prev, 'hero_tagline': e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Skriv inn tagline..."
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => handleSave(
                  'hero_tagline', 
                  content['hero_tagline'], 
                  'hero', 
                  'Hovedtekst under tittelen på forsiden'
                )}
                disabled={saving === 'hero_tagline'}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  success === 'hero_tagline' 
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {saving === 'hero_tagline' ? 'Lagrer...' : success === 'hero_tagline' ? 'Lagret!' : 'Lagre'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About / Bio Section Settings */}
      <div className="bg-[#111] rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-6">Biografi / Om Oss</h3>
        
        <div className="space-y-8">
          {/* Title Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tittel</label>
              <input
                type="text"
                value={content['about_title'] || ''}
                onChange={(e) => setContent(prev => ({ ...prev, 'about_title': e.target.value }))}
                placeholder="F.eks. Hvem er Lydskog"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tittel Font</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="font_mono"
                    checked={content['about_title_mono'] === 'true'}
                    onChange={() => {
                        setContent(prev => ({ ...prev, 'about_title_mono': 'true' }));
                        handleSave('about_title_mono', 'true', 'about');
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-gray-400 text-sm">Monospace</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="font_mono"
                    checked={content['about_title_mono'] !== 'true'}
                    onChange={() => {
                        setContent(prev => ({ ...prev, 'about_title_mono': 'false' }));
                        handleSave('about_title_mono', 'false', 'about');
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-gray-400 text-sm">Standard</span>
                </label>
              </div>
            </div>
          </div>

          {/* Title Size */}
          <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">Tittel Størrelse</label>
             <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-md border border-white/10 w-fit">
                {['small', 'medium', 'large', 'xl', 'giga'].map((size) => (
                    <button
                        key={size}
                        onClick={() => {
                            setContent(prev => ({ ...prev, 'about_title_size': size }));
                            handleSave('about_title_size', size, 'about');
                        }}
                        className={`px-3 py-1.5 text-xs rounded capitalize transition-colors ${
                            (content['about_title_size'] || 'medium') === size 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {size}
                    </button>
                ))}
             </div>
          </div>

          {/* Main Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Biografi Tekst</label>
            <p className="text-xs text-gray-500 mb-3">Bruk linjeskift for nye avsnitt.</p>
            <textarea
              value={content['about_content'] || ''}
              onChange={(e) => setContent(prev => ({ ...prev, 'about_content': e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-md text-white placeholder-gray-600 focus:border-blue-500 outline-none resize-y"
              placeholder="Skriv din historie her..."
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
             {/* Main Background Image */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Bakgrunnsbilde</label>
                <div className="relative aspect-video bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden mb-3 group">
                    {content['about_bg_image'] ? (
                        <img src={content['about_bg_image']} alt="Background" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Ingen bilde valgt</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200">
                            ENDRE BILDE
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'about_bg_image')}
                            />
                        </label>
                    </div>
                </div>
                {uploading === 'about_bg_image' && <p className="text-xs text-blue-400 animate-pulse">Laster opp...</p>}
             </div>

             {/* Side Image */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Sidebilde (Valgfritt)</label>
                <div className="relative aspect-[3/4] bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden mb-3 group w-2/3 mx-auto">
                    {content['about_side_image'] ? (
                        <img src={content['about_side_image']} alt="Side" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Ingen bilde valgt</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200">
                            ENDRE BILDE
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'about_side_image')}
                            />
                        </label>
                    </div>
                </div>
                {uploading === 'about_side_image' && <p className="text-xs text-blue-400 animate-pulse text-center">Laster opp...</p>}
             </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/10">
            <button
              onClick={() => {
                  handleSave('about_title', content['about_title'] || '', 'about');
                  handleSave('about_content', content['about_content'] || '', 'about');
                  // Other fields are saved on change/upload
                  setSuccess('all_about');
                  setTimeout(() => setSuccess(null), 3000);
              }}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {success === 'all_about' ? 'Lagret!' : 'Lagre Biografi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
