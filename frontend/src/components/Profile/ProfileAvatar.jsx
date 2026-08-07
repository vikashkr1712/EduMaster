import { useEffect, useState } from 'react'
import SvgMan from '../../svg/SvgMan.jsx'

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
    <span className={`profile-avatar-image is-loaded ${className}`.trim()}>
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
        <SvgMan alt={alt} />
      )}
    </span>
  )
}
