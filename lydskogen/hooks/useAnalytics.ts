'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

let sessionId: string | null = null
let heartbeatInterval: NodeJS.Timeout | null = null

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  if (!sessionId) {
    // Try to get existing session ID from sessionStorage
    sessionId = sessionStorage.getItem('analytics_session_id')
    
    if (!sessionId) {
      // Generate new session ID
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
  }
  
  return sessionId
}

async function trackPageView(pageUrl: string, referrer?: string) {
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageUrl,
        referrer: document.referrer || undefined,
        sessionId: getSessionId()
      })
    })
    
    if (!response.ok) {
      console.warn('Failed to track page view:', response.statusText)
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error)
  }
}

async function sendHeartbeat(pageUrl: string) {
  try {
    await fetch('/api/analytics/heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: getSessionId(),
        pageUrl
      })
    })
  } catch (error) {
    console.warn('Heartbeat error:', error)
  }
}

async function trackEvent(
  eventType: 'click' | 'form_submit' | 'audio_play' | 'scroll' | 'download' | 'custom',
  eventName: string,
  properties?: Record<string, any>,
  element?: HTMLElement
) {
  try {
    const elementSelector = element ? getElementSelector(element) : undefined
    const elementText = element?.textContent?.trim().substring(0, 100) || undefined
    
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventType,
        eventName,
        pageUrl: window.location.href,
        elementSelector,
        elementText,
        properties
      })
    })
  } catch (error) {
    console.warn('Event tracking error:', error)
  }
}

function getElementSelector(element: HTMLElement): string {
  // Generate a simple selector for the element
  let selector = element.tagName.toLowerCase()
  
  if (element.id) {
    selector += `#${element.id}`
  } else if (element.className) {
    const classes = element.className.split(' ').filter(c => c).slice(0, 2)
    if (classes.length > 0) {
      selector += `.${classes.join('.')}`
    }
  }
  
  return selector
}

export function useAnalytics() {
  const pathname = usePathname()
  const trackedPages = useRef(new Set<string>())

  const trackCustomEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackEvent('custom', eventName, properties)
  }, [])

  const trackClick = useCallback((element: HTMLElement, eventName?: string) => {
    const name = eventName || `click_${element.tagName.toLowerCase()}`
    trackEvent('click', name, undefined, element)
  }, [])

  const trackFormSubmit = useCallback((form: HTMLFormElement, formName?: string) => {
    const name = formName || 'form_submit'
    trackEvent('form_submit', name, undefined, form)
  }, [])

  const trackAudioPlay = useCallback((audioName: string, properties?: Record<string, any>) => {
    trackEvent('audio_play', audioName, properties)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentUrl = window.location.href
    
    // Track page view
    if (!trackedPages.current.has(currentUrl)) {
      trackedPages.current.add(currentUrl)
      
      const timer = setTimeout(() => {
        trackPageView(currentUrl, document.referrer)
      }, 100)

      // Start heartbeat for this page
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
      
      heartbeatInterval = setInterval(() => {
        sendHeartbeat(window.location.href)
      }, 30000) // Send heartbeat every 30 seconds

      // Track scroll events
      let hasScrolled = false
      const handleScroll = () => {
        if (!hasScrolled && window.scrollY > 100) {
          hasScrolled = true
          trackEvent('scroll', 'page_scroll', { scrollY: window.scrollY })
        }
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        clearTimeout(timer)
        window.removeEventListener('scroll', handleScroll)
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
      }
    }
  }, [pathname])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
        heartbeatInterval = null
      }
    }
  }, [])

  return {
    trackEvent: trackCustomEvent,
    trackClick,
    trackFormSubmit,
    trackAudioPlay
  }
}