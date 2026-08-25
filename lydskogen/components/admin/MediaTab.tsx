'use client';

import { useEffect, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

const ARTWORK_SLOTS = Array.from(
  { length: 6 },
  (_, index) => `artwork_showcase_${index + 1}`
);

export default function MediaTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.json())
      .then((data) => setContent(data || {}))
      .catch((error) => console.error('Error fetching media content:', error))
      .finally(() => setLoading(false));
  }, []);

  const saveContent = async (key: string, value: string) => {
    const response = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value,
        section: 'media',
        description: 'Artwork showcase-bilde',
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Kunne ikke lagre bildet');
    }

    setContent((current) => ({ ...current, [key]: value }));
    setSuccessKey(key);
    setTimeout(() => setSuccessKey(null), 2500);
  };

  const handleUpload = async (file: File, key: string) => {
    setWorkingKey(key);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);

      const uploadResponse = await fetch('/api/admin/upload-content-image', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Kunne ikke laste opp bildet');
      }

      const previousUrl = content[key];
      await saveContent(key, uploadData.url);

      if (previousUrl) {
        await fetch(`/api/admin/delete-image?url=${encodeURIComponent(previousUrl)}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Artwork upload error:', error);
      alert(error instanceof Error ? error.message : 'Feil ved opplasting');
    } finally {
      setWorkingKey(null);
    }
  };

  const handleDelete = async (key: string) => {
    const url = content[key];
    if (!url || !confirm('Vil du slette dette artwork-bildet?')) return;

    setWorkingKey(key);

    try {
      const deleteResponse = await fetch(`/api/admin/delete-image?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        const data = await deleteResponse.json().catch(() => ({}));
        throw new Error(data.error || 'Kunne ikke slette bildet');
      }

      await saveContent(key, '');
    } catch (error) {
      console.error('Artwork delete error:', error);
      alert(error instanceof Error ? error.message : 'Feil ved sletting');
    } finally {
      setWorkingKey(null);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Laster media...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h2 className="mb-1 text-2xl font-semibold text-white">Media</h2>
        <p className="text-sm text-gray-500">
          Administrer bildene som vises i artwork-eksempelet på forsiden.
        </p>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#111] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white">Artwork showcase</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Last opp opptil seks bilder. Rekkefølgen følger plass 1–6, og tomme plasser hoppes over i galleriet.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTWORK_SLOTS.map((key, index) => {
            const image = content[key];
            const isWorking = workingKey === key;

            return (
              <article key={key} className="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]">
                <div className="relative aspect-square">
                  {image ? (
                    <img
                      src={image}
                      alt={`Artwork showcase ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-600">
                      <ImagePlus size={30} strokeWidth={1.5} />
                      <span className="text-xs">Ingen bilde valgt</span>
                    </div>
                  )}

                  {isWorking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm text-white">
                      Jobber...
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Plass {index + 1}</span>
                    {successKey === key && <span className="text-xs text-green-400">Lagret</span>}
                  </div>

                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700">
                      {image ? 'Bytt bilde' : 'Last opp'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isWorking}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleUpload(file, key);
                          event.target.value = '';
                        }}
                      />
                    </label>

                    {image && (
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => handleDelete(key)}
                        className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                        aria-label={`Slett artwork ${index + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
