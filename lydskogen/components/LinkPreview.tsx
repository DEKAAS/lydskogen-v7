'use client'

import { useEffect, useRef, useState } from 'react'

interface LinkPreviewProps {
  url: string
  fallbackImage?: string
  height?: number
}

export default function LinkPreview({ url, fallbackImage = '/images/example/layout-example.png', height = 200 }: LinkPreviewProps) {
  const [loaded, setLoaded] = useState(false)
  const [canEmbed, setCanEmbed] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // Give the iframe some time to load; if it doesn't, fall back to image
    timerRef.current = window.setTimeout(() => {
      if (!loaded) setCanEmbed(false)
    }, 2500)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [loaded])

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
      {canEmbed ? (
        <div className="relative" style={{ height }}>
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full"
            style={{ border: '0' }}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
          {/* Overlay to capture click and open new tab */}
          <button
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            className="absolute inset-0"
            aria-label="Åpne forhåndsvisning i ny fane"
          />
        </div>
      ) : (
        <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} className="block w-full" aria-label="Åpne forhåndsvisning i ny fane">
          <img src={fallbackImage} alt="Forhåndsvisning" style={{ width: '100%', height, objectFit: 'cover' }} />
        </button>
      )}
    </div>
  )
}


