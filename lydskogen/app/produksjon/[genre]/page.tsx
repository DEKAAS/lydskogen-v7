'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getGenreBySlug, genreData, Genre } from '../../../data/genres';
import AudioPlayer from '../../../components/AudioPlayer';
import Container from '../../../components/Container';

interface GenrePageProps {
  params: Promise<{ genre: string }>;
}

// Note: generateStaticParams and generateMetadata cannot be used with 'use client'
// This will be a dynamic page for now. For production, consider server/client component split.

export default function GenrePage({ params }: GenrePageProps) {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [genreSlug, setGenreSlug] = useState<string>('');

  useEffect(() => {
    const loadGenre = async () => {
      try {
        const resolvedParams = await params;
        const foundGenre = getGenreBySlug(resolvedParams.genre);
        setGenre(foundGenre || null);
        setGenreSlug(resolvedParams.genre);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading genre:', error);
        setIsLoading(false);
      }
    };

    loadGenre();
  }, [params]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Laster...</div>
      </main>
    );
  }

  if (!genre) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={genre.heroImage}
          alt={genre.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
        
        <Container className="relative h-full flex items-end">
          <div className="pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                {genre.title}
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                {genre.shortDescription}
              </p>
            </motion.div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Om {genre.title}
              </h2>
              <div className="space-y-4 text-gray-200">
                {genre.description.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Characteristics */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Karakteristikker
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {genre.characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span 
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: genre.accentColor }}
                      />
                      {characteristic}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Audio Examples */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Lytteeksempler
              </h2>
              <div className="space-y-4">
                {genre.audioExamples.map((audio, index) => (
                  <AudioPlayer
                    key={index}
                    title={audio.title}
                    src={audio.src}
                    duration={audio.duration}
                    bgClass={genre.cardBgClass}
                    accentColor={genre.accentColor}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Priser for {genre.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(genre.pricing).map(([tier, price]) => (
                <div
                  key={tier}
                  className={`p-6 rounded-lg border border-white/10 ${genre.cardBgClass} backdrop-blur-sm`}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                    {tier === 'basic' ? 'Grunnpakke' : tier === 'premium' ? 'Premium' : 'Eksklusiv'}
                  </h3>
                  <div className="text-2xl font-bold text-white mb-4">
                    {price.toLocaleString('no-NO')} kr
                  </div>
                  <Link
                    href={`/kontakt?genre=${genre.slug}&package=${tier}`}
                    className="inline-block w-full text-center py-2 px-4 rounded transition-colors duration-200"
                    style={{ 
                      backgroundColor: genre.accentColor,
                      color: 'white'
                    }}
                  >
                    Bestill {tier === 'basic' ? 'Grunnpakke' : tier === 'premium' ? 'Premium' : 'Eksklusiv'}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Genre Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Utforsk andre sjangere
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {genreData.map((g) => (
                <Link
                  key={g.slug}
                  href={`/produksjon/${g.slug}`}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                    g.slug === genreSlug
                      ? 'text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  style={
                    g.slug === genreSlug
                      ? { backgroundColor: g.accentColor }
                      : {}
                  }
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </main>
  );
} 