import { useId } from 'react'

const PALETTES = {
  m1: ['#3158E8', '#6281F4'],
  m2: ['#0F766E', '#2FB29D'],
  m3: ['#B45309', '#F09A3E'],
  m4: ['#5B3CC4', '#8B6DE5'],
  f1: ['#7C3AED', '#A66DF2'],
  f2: ['#BE185D', '#E85B98'],
  f3: ['#166534', '#4DAF69'],
}

const initialsFor = (name) => {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'EM'
  return `${words[0][0]}${words.length > 1 ? words.at(-1)[0] : ''}`.toUpperCase()
}

export default function ProfileAvatar({ name, variant = 'm1', size = 40 }) {
  const gradientId = `profile-avatar-${useId().replace(/:/g, '')}`
  const [start, end] = PALETTES[variant] || PALETTES.m1

  return (
    <svg
      className="profile-avatar"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${name || 'EduMaster learner'} profile`}
    >
      <defs>
        <linearGradient id={gradientId} x1="7" y1="5" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={start} />
          <stop offset="1" stopColor={end} />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill={`url(#${gradientId})`} />
      <circle cx="13" cy="10" r="12" fill="#fff" fillOpacity=".08" />
      <path d="M35 3.5A24 24 0 0 1 45 15" stroke="#fff" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
      <text
        x="24"
        y="25"
        fill="#fff"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing=".35"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {initialsFor(name)}
      </text>
      <circle cx="24" cy="24" r="22.75" fill="none" stroke="#fff" strokeOpacity=".24" strokeWidth="1.5" />
    </svg>
  )
}
