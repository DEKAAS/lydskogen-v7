'use client';

import { useState, useEffect } from 'react';

export default function SettingsTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laster innstillinger...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
              rows={4}
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
    </div>
  );
}
