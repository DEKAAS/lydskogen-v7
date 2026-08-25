'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const serviceSections = [
  {
    id: 'miksing',
    label: 'Miksing',
    title: 'Miksing',
    eyebrow: 'Lyd som lander',
    description:
      'Ryddig miks med fokus på balanse, dybde og varme. For artister som vil at låten skal føles ferdig uten å miste uttrykket sitt.',
  },
  {
    id: 'artwork',
    label: 'Artwork',
    title: 'Artwork',
    eyebrow: 'Visuelt uttrykk',
    description:
      'Cover og visuelt materiale som henger sammen med lyden. Enkelt, stemningsfullt og tilpasset release, profil eller kampanje.',
  },
  {
    id: 'artist-side',
    label: 'Artist-side',
    title: 'Artist-side',
    eyebrow: 'Din egen profil',
    description:
      'En enkel nettside for artister med bio, utgivelser, lenker og kontakt. Et mer personlig hjem enn en standard lenkeside.',
  },
];

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

  const handleDeleteImage = async (key: string) => {
    const url = content[key];
    if (!url) return;

    if (!confirm('Er du sikker på at du vil slette dette bildet?')) return;

    setUploading(key); // Reuse uploading state to show activity
    try {
      const res = await fetch(`/api/admin/delete-image?url=${encodeURIComponent(url)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Remove from database/content
        handleSave(key, '', 'about'); // Save empty string
        setContent(prev => ({ ...prev, [key]: '' }));
      } else {
        alert('Feil ved sletting av bilde');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Feil ved sletting');
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

      {/* Services Settings */}
      <div className="bg-[#111] rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-2">Tjenester</h3>
        <p className="text-sm text-gray-500 mb-6">
          Tekstene som vises i tjenestekortene på forsiden.
        </p>

        <div className="space-y-8">
          {serviceSections.map((service) => {
            const titleKey = `service_${service.id}_title`;
            const eyebrowKey = `service_${service.id}_eyebrow`;
            const descriptionKey = `service_${service.id}_description`;

            return (
              <div key={service.id} className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-white">{service.label}</h4>
                    <p className="text-xs text-gray-500">Rediger overskrift, undertittel og kort beskrivelse.</p>
                  </div>
                  {success?.startsWith(`service_${service.id}_`) && (
                    <span className="text-xs text-green-400">Lagret</span>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tittel</label>
                    <input
                      type="text"
                      value={content[titleKey] ?? service.title}
                      onChange={(e) => setContent(prev => ({ ...prev, [titleKey]: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-md text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Liten undertittel</label>
                    <input
                      type="text"
                      value={content[eyebrowKey] ?? service.eyebrow}
                      onChange={(e) => setContent(prev => ({ ...prev, [eyebrowKey]: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-md text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Beskrivelse</label>
                  <textarea
                    value={content[descriptionKey] ?? service.description}
                    onChange={(e) => setContent(prev => ({ ...prev, [descriptionKey]: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-md text-white focus:border-blue-500 outline-none resize-y"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={async () => {
                      await handleSave(titleKey, content[titleKey] ?? service.title, 'services', `${service.label} tittel`);
                      await handleSave(eyebrowKey, content[eyebrowKey] ?? service.eyebrow, 'services', `${service.label} undertittel`);
                      await handleSave(descriptionKey, content[descriptionKey] ?? service.description, 'services', `${service.label} beskrivelse`);
                    }}
                    disabled={
                      saving === titleKey ||
                      saving === eyebrowKey ||
                      saving === descriptionKey
                    }
                    className="px-5 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving === titleKey || saving === eyebrowKey || saving === descriptionKey ? 'Lagrer...' : 'Lagre tjeneste'}
                  </button>
                </div>
              </div>
            );
          })}
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

          {/* About gallery */}
          <div className="pt-4 border-t border-white/5">
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-300">Bilder til «Kort om»</h4>
              <p className="mt-1 text-xs text-gray-500">
                Last opp opptil seks bilder. Bildene vises sammen med biografien på forsiden.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => {
                const key = `about_gallery_${index + 1}`;
                const image = content[key];

                return (
                  <div key={key}>
                    <p className="mb-2 text-xs font-medium text-gray-500">Bilde {index + 1}</p>
                    <div className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]">
                      {image ? (
                        <>
                          <img src={image} alt={`Kort om ${index + 1}`} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/65 opacity-0 transition-opacity group-hover:opacity-100">
                            <label className="cursor-pointer rounded bg-white px-3 py-2 text-xs font-bold text-black hover:bg-gray-200">
                              ENDRE
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], key)}
                              />
                            </label>
                            <button
                              onClick={() => handleDeleteImage(key)}
                              className="flex items-center gap-1 rounded bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                            >
                              <Trash2 size={14} /> SLETT
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-xs text-gray-600">
                          <span>Ledig bildeplass</span>
                          <label className="cursor-pointer rounded bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20">
                            LAST OPP
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], key)}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {uploading === key && <p className="mt-2 animate-pulse text-xs text-blue-400">Jobber...</p>}
                  </div>
                );
              })}
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
