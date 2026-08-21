import { useEffect, useState } from 'react'

function AvatarFallback() {
  return (
    <svg className="svg-man-fallback" viewBox="0 0 64 64" role="img" aria-label="Default profile avatar">
      <rect width="64" height="64" rx="32" fill="#E8EEF9" />
      <circle cx="32" cy="25" r="12" fill="#D49B6A" />
      <path d="M13 64c1.7-15.2 9.3-23 19-23s17.3 7.8 19 23" fill="#14213D" />
      <path d="M21 21c1-9.5 7-14 14-12 5 1.4 8.5 6.3 8 12-5-2.8-14-3.6-22 0Z" fill="#2A241F" />
    </svg>
  )
}

// Loading sequence: saved user avatar -> supplied PNG -> supplied SVG JSX.
// The SVG is rendered directly at the final stage, so the UI can never show a
// broken-image placeholder.
export default function ProfileAvatar({ src, defaultSrc, alt = '', className = '' }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    setStage(0)
  }, [src, defaultSrc])

  const imageSrc = stage === 0 ? src : defaultSrc

  return (
    <span className={`profile-avatar-image ${className}`.trim()}>
      {stage < 2 && imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          onError={() => setStage((current) => {
            // When no saved avatar exists, src is already the default PNG;
            // skip a duplicate request and go directly to the SVG fallback.
            if (current === 0 && src === defaultSrc) return 2
            return Math.min(current + 1, 2)
          })}
        />
      ) : (
        <AvatarFallback />
      )}
    </span>
  )
}
