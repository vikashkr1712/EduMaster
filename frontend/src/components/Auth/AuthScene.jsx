import { useEffect, useState } from 'react'
import { useTheme } from '../Theme/ThemeProvider.jsx'

export default function AuthScene({ lightSrc, darkSrc, alt }) {
  const { isDark } = useTheme()
  const primarySrc = isDark ? darkSrc : lightSrc
  const fallbackSrc = isDark ? lightSrc : darkSrc
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    setUseFallback(false)
  }, [primarySrc])

  return (
    <img
      className="authpanel-photo"
      src={useFallback ? fallbackSrc : primarySrc}
      alt={alt}
      width="1448"
      height="1086"
      decoding="async"
      fetchPriority="high"
      onError={() => setUseFallback(true)}
    />
  )
}
