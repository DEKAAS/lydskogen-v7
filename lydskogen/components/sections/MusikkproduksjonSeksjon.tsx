'use client';

import { useEffect, useMemo, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { genreData } from '@/data/genres';

type DemoTrack = {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  duration?: string;
};

type ApiTrack = {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  duration?: string;
};

const ORDER_EMAIL = 'lydskog@proton.me';
const customDescriptions: Record<string, string> = {
  ambient: 'Rolige lydlandskap med feltopptak og teksturer som skaper ro og dybde.',
  hiphop: 'Her henter vi inspirasjon fra 90-tallets boombap – field recordings, støvete trommer og klassiske lyder.',
  lofi: 'Varme, nostalgiske beats med vinylstøy, myke trommer og jazzede akkorder.',
  soundscape: 'Cinematiske lydverdener med naturlyder, atmosfæriske pads og dramatisk dynamikk.'
};

export default function MusikkproduksjonSeksjon() {
  const [demoTracks, setDemoTracks] = useState<Record<string, DemoTrack[]>>({});
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    genre: 'ambient',
    brief: ''
  });
  const [orderErrors, setOrderErrors] = useState<Record<string, string>>({});
  const [orderSending, setOrderSending] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();
        const tracks: ApiTrack[] = data.music || [];

        const grouped = tracks.reduce<Record<string, DemoTrack[]>>((acc, track) => {
          const genreKey = track.genre || 'annet';
          if (!acc[genreKey]) acc[genreKey] = [];
          acc[genreKey].push({
            id: track.id,
            title: track.title,
            genre: track.genre,
            audioUrl: track.audioUrl,
            duration: track.duration
          });
          return acc;
        }, {});

        setDemoTracks(grouped);
      } catch (error) {
        console.error('Failed to fetch music tracks', error);
        setDemoTracks({});
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const genreCards = useMemo(() => genreData.filter((genre) =>
    ['ambient', 'hiphop', 'lofi', 'soundscape'].includes(genre.id)
  ), []);

  useEffect(() => {
    if (!genreCards.some((g) => g.id === orderForm.genre) && genreCards.length > 0) {
      setOrderForm((prev) => ({ ...prev, genre: genreCards[0].id }));
    }
  }, [genreCards, orderForm.genre]);

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
    if (orderErrors[name]) {
      setOrderErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateOrder = () => {
    const nextErrors: Record<string, string> = {};
    if (!orderForm.name.trim()) nextErrors.name = 'Navn er påkrevd';
    if (!orderForm.email.trim()) {
      nextErrors.email = 'E-post er påkrevd';
    } else if (!/^\S+@\S+\.\S+$/.test(orderForm.email)) {
      nextErrors.email = 'Ugyldig e-post';
    }
    if (!orderForm.brief.trim()) nextErrors.brief = 'Beskrivelse er påkrevd';

    setOrderErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOrder()) return;

    setOrderSending(true);
    const genreTitle = genreCards.find((g) => g.id === orderForm.genre)?.title || orderForm.genre;
    const subject = `Bestilling: ${genreTitle}`;
    const body = `Hei Lydskog!\n\nNavn: ${orderForm.name}\nE-post: ${orderForm.email}\nSjanger: ${genreTitle}\n\nProsjekt:\n${orderForm.brief}`;

    setTimeout(() => {
      window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setOrderSending(false);
      setOrderSuccess(true);
      setOrderForm({
        name: '',
        email: '',
        genre: orderForm.genre,
        brief: ''
      });
      setTimeout(() => setOrderSuccess(false), 4000);
    }, 400);
  };

  return (
    <section id="services" className="py-16" style={{ backgroundColor: 'var(--primary-bg)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Musikkproduksjon
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Velg sjanger, hør demo, bestill
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Fire spesialfelt – Ambient, Soundscape, Hip-hop og Lo-fi. Spill av et par eksempler og send bestilling når du er klar.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {genreCards.map((genre) => {
            const demos = (genre.id && demoTracks[genre.id]) || [];
            const topDemos = demos.slice(0, 2);

            return (
              <div
                key={genre.id}
                className="relative rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${genre.heroImage || genre.thumbnailImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(14px)',
                    transform: 'scale(1.1)',
                    opacity: 0.35
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(7,35,24,0.85), rgba(19,45,31,0.9))'
                  }}
                />

                <div className="relative p-6 flex flex-col gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-2xl md:text-3xl font-serif tracking-[0.05em]"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {genre.title}
                      </h3>
                      <span
                        className="text-xs uppercase tracking-[0.3em]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Skreddersøm
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {customDescriptions[genre.id] || genre.shortDescription}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                      Demoer fra arkivet
                    </p>
                    {loading ? (
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Laster inn demoer…
                      </div>
                    ) : topDemos.length > 0 ? (
                      <div className="space-y-3">
                        {topDemos.map((track) => (
                          <AudioPlayer
                            key={track.id}
                            title={track.title}
                            src={track.audioUrl}
                            duration={track.duration}
                            accentColor={genre.accentColor}
                            bgClass="bg-black/20"
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="rounded-lg p-4 text-sm text-center font-medium"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.35)',
                          border: '1px dashed var(--border-color)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        Demo kommer snart
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: 'rgba(0,0,0,0.35)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--text-muted)' }}>
                Bestillingsskjema
              </p>
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>
                Klar for et prosjekt?
              </h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Velg sjanger og beskriv kort hva du trenger. Vi tar kontakt for å avtale detaljer.
              </p>
            </div>

            {orderSuccess ? (
              <div
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}
              >
                Takk! Vi har mottatt forespørselen din.
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                      Navn
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={orderForm.name}
                      onChange={handleOrderChange}
                      className="w-full rounded-lg p-3 text-sm"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        border: orderErrors.name ? '1px solid #ef4444' : '1px solid var(--border-color)',
                        color: 'var(--text-color)'
                      }}
                    />
                    {orderErrors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{orderErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                      E-post
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleOrderChange}
                      className="w-full rounded-lg p-3 text-sm"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        border: orderErrors.email ? '1px solid #ef4444' : '1px solid var(--border-color)',
                        color: 'var(--text-color)'
                      }}
                    />
                    {orderErrors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{orderErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Sjanger
                  </label>
                  <select
                    name="genre"
                    value={orderForm.genre}
                    onChange={handleOrderChange}
                    className="w-full rounded-lg p-3 text-sm"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    {genreCards.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Prosjektbeskrivelse
                  </label>
                  <textarea
                    name="brief"
                    value={orderForm.brief}
                    onChange={handleOrderChange}
                    rows={4}
                    className="w-full rounded-lg p-3 text-sm resize-none"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: orderErrors.brief ? '1px solid #ef4444' : '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  ></textarea>
                  {orderErrors.brief && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{orderErrors.brief}</p>}
                </div>

                <button
                  type="submit"
                  disabled={orderSending}
                  className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-70"
                  style={{
                    backgroundColor: '#c8e6d0',
                    color: '#132d1f'
                  }}
                >
                  {orderSending ? 'Sender…' : 'Send bestilling'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}