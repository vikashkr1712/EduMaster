const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function normalizeYouTubeVideoId(value) {
  const input = String(value || '').trim()
  if (VIDEO_ID_PATTERN.test(input)) return input

  try {
    const parsed = new URL(input)
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
    let videoId = ''
    if (host === 'youtu.be') videoId = parsed.pathname.split('/').filter(Boolean)[0] || ''
    else if (host === 'youtube.com' || host === 'm.youtube.com') {
      videoId = parsed.searchParams.get('v') || ''
      if (!videoId) {
        const parts = parsed.pathname.split('/').filter(Boolean)
        if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || ''
      }
    }
    return VIDEO_ID_PATTERN.test(videoId) ? videoId : ''
  } catch {
    return ''
  }
}

export function getYouTubeThumbnailUrls(value) {
  const videoId = normalizeYouTubeVideoId(value)
  if (!videoId) return []
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ]
}
