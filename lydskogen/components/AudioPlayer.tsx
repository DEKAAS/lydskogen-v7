'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  title: string;
  src: string;
  duration?: string;
  bgClass?: string;
  accentColor?: string;
}

export default function AudioPlayer({
  title,
  src,
  duration = '0:00',
  // Rolig, jordnær standardbakgrunn – kan overstyres via props
  bgClass = 'bg-stone-900/85',
  // Dempet aksentfarge som fortsatt er tydelig, men ikke knæsj
  accentColor = 'rgb(148, 163, 184)',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Format time display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * totalDuration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setTotalDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <motion.div 
      className={`p-4 rounded-xl border border-stone-700/70 ${bgClass}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ translateY: -2 }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Title */}
      <h3 className="text-stone-50 font-medium mb-3 text-sm md:text-base tracking-tight">
        {title}
      </h3>
      
      {/* Controls and Progress */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: accentColor }}
          whileTap={{ scale: 0.96 }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            // Pause icon
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            // Play icon
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </motion.button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div 
            className="w-full h-1.5 bg-stone-800 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressClick}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-xs text-stone-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{totalDuration > 0 ? formatTime(totalDuration) : duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 