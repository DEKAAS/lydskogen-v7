'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="services" className="bg-[#f4efe4] px-5 text-[#1d241d]">
      <div className="mx-auto max-w-6xl border-t border-[#d8caa8] py-16 md:py-24">
        <div className="mb-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Tjenester</p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#1d241d] md:text-6xl">
            Enkle løsninger for lyd, uttrykk og artistprofil.
            </h2>
          </div>
          <p className="text-base leading-8 text-[#4f5749] md:text-lg">
            Lydskog hjelper deg å forme helheten rundt prosjektet ditt, fra miks og visuell identitet til en egen artist-side.
          </p>
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
    </section>
  );
}
