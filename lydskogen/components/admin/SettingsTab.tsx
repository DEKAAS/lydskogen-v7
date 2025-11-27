'use client';

import { useState, useEffect } from 'react';

export default function SettingsTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

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
        const data = await res.json();
        setContent(prev => ({ ...prev, [key]: value }));
      } else {
        alert('Feil ved lagring');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Feil ved lagring');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Laster innstillinger...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Innstillinger</h2>
        <p className="text-gray-400">Administrer nettsidens tekster og innhold</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Forside (Hero)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Tagline / Undertittel</label>
            <p className="text-sm text-gray-500 mb-2">Teksten som vises under &quot;LYDSKOG&quot; på forsiden.</p>
            <textarea
              value={content['hero_tagline'] || ''}
              onChange={(e) => setContent(prev => ({ ...prev, 'hero_tagline': e.target.value }))}
              rows={4}
              className="w-full p-4 bg-black/50 text-white rounded border border-white/20 focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleSave(
                  'hero_tagline', 
                  content['hero_tagline'], 
                  'hero', 
                  'Hovedtekst under tittelen på forsiden'
                )}
                disabled={saving === 'hero_tagline'}
                className="px-4 py-2 bg-accent-green text-base-dark font-semibold rounded hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
              >
                {saving === 'hero_tagline' ? 'Lagrer...' : 'Lagre endringer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

