'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type SiteContent = Record<string, string>;

const DEFAULT_SERVICES = [
  {
    id: 'miksing',
    title: 'Miksing',
    eyebrow: 'Lyd som lander',
    description:
      'Ryddig miks med fokus på balanse, dybde og varme. For artister som vil at låten skal føles ferdig uten å miste uttrykket sitt.',
    details: ['Balanse og EQ', 'Dynamikk og rom', 'Klar fil til videre master eller publisering'],
  },
  {
    id: 'artwork',
    title: 'Artwork',
    eyebrow: 'Visuelt uttrykk',
    description:
      'Cover og visuelt materiale som henger sammen med lyden. Enkelt, stemningsfullt og tilpasset release, profil eller kampanje.',
    details: ['Cover til singel eller EP', 'Format til streaming og SoMe', 'Jordlig og tydelig visuell retning'],
  },
  {
    id: 'artist-side',
    title: 'Artist-side',
    eyebrow: 'Din egen profil',
    description:
      'En enkel nettside for artister med bio, utgivelser, lenker og kontakt. Et mer personlig hjem enn en standard lenkeside.',
    details: ['Kort artistbio', 'Lenker til musikk og sosiale medier', 'Kontakt eller bookingseksjon'],
  },
];

export default function ServicesSection() {
  const [content, setContent] = useState<SiteContent>({});
  const [showArtistInfo, setShowArtistInfo] = useState(false);
  const [showArtworkGallery, setShowArtworkGallery] = useState(false);
  const [activeArtwork, setActiveArtwork] = useState(0);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => setContent(data || {}))
      .catch((error) => console.error('Failed to load service content:', error));
  }, []);

  const services = DEFAULT_SERVICES.map((service) => ({
    ...service,
    title: content[`service_${service.id}_title`] || service.title,
    eyebrow: content[`service_${service.id}_eyebrow`] || service.eyebrow,
    description: content[`service_${service.id}_description`] || service.description,
  }));
  const artworkImages = Array.from(
    { length: 6 },
    (_, index) => content[`artwork_showcase_${index + 1}`]
  ).filter(Boolean);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showPreviousArtwork = () => {
    setActiveArtwork((current) => (
      artworkImages.length > 0
        ? (current - 1 + artworkImages.length) % artworkImages.length
        : 0
    ));
  };

  const showNextArtwork = () => {
    setActiveArtwork((current) => (
      artworkImages.length > 0
        ? (current + 1) % artworkImages.length
        : 0
    ));
  };

  return (
    <section id="services" className="bg-[#f4efe4] px-5 text-[#1d241d] [contain:none]">
      <div className="mx-auto max-w-6xl pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Tjenester</p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#1d241d] md:text-6xl">
            Enkle løsninger for lyd, uttrykk og artistprofil.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex min-h-[360px] flex-col justify-between rounded-[1.5rem] border border-[#d8caa8] bg-white/40 p-6 transition-colors hover:bg-[#eee6d5]"
            >
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#8a7d62]">{service.eyebrow}</p>
                <h3 className="text-3xl font-semibold tracking-tight text-[#1d241d]">{service.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#4f5749]">{service.description}</p>
              </div>

              <div className="mt-8">
                <ul className="space-y-3 border-t border-[#d8caa8] pt-5 text-sm text-[#5c604f]">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8a7d62]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col gap-3">
                  {service.id === 'artist-side' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowArtistInfo(true)}
                        className="rounded-full border border-[#d8caa8] px-5 py-3 text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                      >
                        Hvordan fungerer Artist-side?
                      </button>
                      <Link
                        href="/artist/eksempel-artist"
                        className="rounded-full border border-[#d8caa8] px-5 py-3 text-center text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                      >
                        Se enkel showcase
                      </Link>
                    </>
                  ) : service.id === 'artwork' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveArtwork(0);
                          setShowArtworkGallery(true);
                        }}
                        className="rounded-full bg-[#b8c9a7] px-5 py-3 text-sm font-semibold text-[#263024] transition-colors hover:bg-[#c9d8ba]"
                      >
                        Vis eksempel
                      </button>
                      <button
                        type="button"
                        onClick={scrollToContact}
                        className="rounded-full border border-[#d8caa8] px-5 py-3 text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                      >
                        Ta kontakt om {service.title.toLowerCase()}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={scrollToContact}
                      className="rounded-full border border-[#d8caa8] px-5 py-3 text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
                    >
                      Ta kontakt om {service.title.toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {showArtistInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d241d]/45 px-4 backdrop-blur-sm"
          onClick={() => setShowArtistInfo(false)}
        >
          <div
            className="w-full max-w-xl rounded-[1.5rem] border border-[#d8caa8] bg-[#f4efe4] p-8 text-[#1d241d] shadow-2xl shadow-[#8a7d62]/25"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8a7d62]">Artist-side</p>
                <h3 className="text-3xl font-semibold tracking-tight">Slik fungerer det</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowArtistInfo(false)}
                className="rounded-full border border-[#d8caa8] px-4 py-2 text-sm text-[#5c604f] transition-colors hover:bg-[#e7ddc9]"
              >
                Lukk
              </button>
            </div>

            <div className="space-y-5 text-sm leading-7 text-[#4f5749]">
              <p>
                Artist-side er en enkel nettside som samler artistprofilen din på ett sted: bio, musikklenker,
                visuelt uttrykk og kontaktinformasjon.
              </p>
              <p>
                Du sender tekst, bilder, relevante lenker og ønsket stemning. Lydskog setter opp siden i et rent
                design som passer uttrykket ditt, og vi kan hjelpe med justeringer før publisering.
              </p>
              <p>
                Målet er at siden skal være lett å dele med publikum, presse, booking og samarbeidspartnere.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/artist/eksempel-artist"
                className="rounded-full bg-[#35412f] px-5 py-3 text-center text-sm font-semibold text-[#f8f3e8] transition-colors hover:bg-[#4f5749]"
              >
                Se showcase
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowArtistInfo(false);
                  scrollToContact();
                }}
                className="rounded-full border border-[#d8caa8] px-5 py-3 text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
              >
                Start en forespørsel
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showArtworkGallery && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d241d]/70 px-4 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowArtworkGallery(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Artwork-eksempler"
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-[#d8caa8] bg-[#f4efe4] shadow-2xl shadow-black/30"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#d8caa8] px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8a7d62]">Artwork</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#1d241d]">Utvalgte eksempler</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArtworkGallery(false)}
                  className="rounded-full border border-[#d8caa8] p-2 text-[#5c604f] transition-colors hover:bg-[#e7ddc9]"
                  aria-label="Lukk artwork-galleri"
                >
                  <X size={18} />
                </button>
              </div>

              {artworkImages.length > 0 ? (
                <>
                  <div className="relative flex min-h-[360px] items-center justify-center bg-[#ded2ba] p-4 md:min-h-[560px] md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={artworkImages[activeArtwork]}
                        src={artworkImages[activeArtwork]}
                        alt={`Artwork-eksempel ${activeArtwork + 1}`}
                        className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-xl shadow-[#8a7d62]/20"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.22 }}
                      />
                    </AnimatePresence>

                    {artworkImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={showPreviousArtwork}
                          className="absolute left-3 rounded-full bg-[#f4efe4]/90 p-3 text-[#263024] shadow-lg transition-colors hover:bg-white md:left-6"
                          aria-label="Forrige artwork"
                        >
                          <ChevronLeft size={22} />
                        </button>
                        <button
                          type="button"
                          onClick={showNextArtwork}
                          className="absolute right-3 rounded-full bg-[#f4efe4]/90 p-3 text-[#263024] shadow-lg transition-colors hover:bg-white md:right-6"
                          aria-label="Neste artwork"
                        >
                          <ChevronRight size={22} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex gap-2">
                      {artworkImages.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setActiveArtwork(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === activeArtwork ? 'w-7 bg-[#35412f]' : 'w-2.5 bg-[#c9bda2]'
                          }`}
                          aria-label={`Vis artwork ${index + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#5c604f]">
                      {activeArtwork + 1} / {artworkImages.length}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] items-center justify-center px-8 text-center">
                  <p className="max-w-md text-lg leading-8 text-[#4f5749]">
                    Artwork-eksempler kommer snart.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
