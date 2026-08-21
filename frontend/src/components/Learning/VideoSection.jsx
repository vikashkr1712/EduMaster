import { useEffect, useRef, useState } from 'react'

let youtubeApiPromise

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise
  youtubeApiPromise = new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT)
    }
    const existing = document.getElementById('youtube-iframe-api')
    if (existing) {
      existing.addEventListener('error', () => reject(new Error('YouTube player unavailable')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.id = 'youtube-iframe-api'
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('YouTube player unavailable'))
    document.head.appendChild(script)
  })
  return youtubeApiPromise
}

export default function VideoSection({ lesson, onWatchProgress }) {
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const saveIntervalRef = useRef(null)
  const progressCallbackRef = useRef(onWatchProgress)
  const [visible, setVisible] = useState(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => { progressCallbackRef.current = onWatchProgress }, [onWatchProgress])

  useEffect(() => {
    if (!hostRef.current || visible) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '180px' })
    observer.observe(hostRef.current)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible || !lesson?.videoId || fallback) return
    let cancelled = false
    const clearSaveInterval = () => {
      if (saveIntervalRef.current) window.clearInterval(saveIntervalRef.current)
      saveIntervalRef.current = null
    }
    const saveCurrentTime = (completed = false) => {
      const player = playerRef.current
      if (!player?.getCurrentTime) return
      const seconds = Math.max(0, Math.floor(player.getCurrentTime() || 0))
      progressCallbackRef.current?.(seconds, completed)
    }

    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return
      playerRef.current = new YT.Player(hostRef.current, {
        videoId: lesson.videoId,
        width: '100%',
        height: '100%',
        playerVars: { controls: 1, rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: 1 },
        events: {
          onReady: (event) => {
            event.target.getIframe()?.setAttribute('loading', 'lazy')
            event.target.getIframe()?.setAttribute('title', lesson.title)
          },
          onStateChange: (event) => {
            clearSaveInterval()
            if (event.data === YT.PlayerState.PLAYING) {
              saveIntervalRef.current = window.setInterval(() => saveCurrentTime(false), 15000)
            } else if (event.data === YT.PlayerState.PAUSED) {
              saveCurrentTime(false)
            } else if (event.data === YT.PlayerState.ENDED) {
              saveCurrentTime(true)
            }
          },
        },
      })
    }).catch(() => { if (!cancelled) setFallback(true) })

    return () => {
      cancelled = true
      clearSaveInterval()
      try { playerRef.current?.destroy?.() } catch { /* YouTube may already have removed the iframe. */ }
      playerRef.current = null
    }
  }, [fallback, lesson?.title, lesson?.videoId, visible])

  return (
    <section className="learn-video-card" aria-label={`Video: ${lesson?.title || 'Lesson'}`}>
      {!visible && <div className="learn-video-loading"><span /> Preparing video…</div>}
      {fallback ? (
        <iframe
          src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
          title={lesson.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div ref={hostRef} className="learn-youtube-host" />
      )}
    </section>
  )
}
