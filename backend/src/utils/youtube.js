import { ApiError } from './ApiError.js';

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const normalizeYouTubeVideoId = (value) => {
  const input = String(value ?? '').trim();
  if (VIDEO_ID_PATTERN.test(input)) return input;

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new ApiError(400, 'Enter a valid YouTube URL or 11-character video ID');
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  let videoId = '';

  if (host === 'youtu.be') {
    videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    videoId = parsed.searchParams.get('v') || '';
    if (!videoId) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || '';
    }
  }

  if (!VIDEO_ID_PATTERN.test(videoId)) {
    throw new ApiError(400, 'Enter a valid YouTube URL or 11-character video ID');
  }

  return videoId;
};
