/**
 * Flat vector person avatar. Variants change skin/hair/shirt colors and
 * hairstyle so each testimonial/instructor face looks distinct.
 */
const VARIANTS = {
  m1: { bg: '#DCE7FB', skin: '#F2B98F', hair: '#20242B', shirt: '#2563EB', beard: true, long: false },
  m2: { bg: '#DCF7E5', skin: '#E8A97E', hair: '#2B2118', shirt: '#1B2B4B', beard: true, long: false },
  m3: { bg: '#FDE9C8', skin: '#F2B98F', hair: '#3A2E24', shirt: '#22C55E', beard: false, long: false },
  m4: { bg: '#EDE9FE', skin: '#E8A97E', hair: '#20242B', shirt: '#F97316', beard: true, long: false },
  f1: { bg: '#FDE7F1', skin: '#F2B98F', hair: '#2B2118', shirt: '#8B5CF6', beard: false, long: true },
  f2: { bg: '#E3ECFF', skin: '#E8A97E', hair: '#20242B', shirt: '#EC4899', beard: false, long: true },
  f3: { bg: '#DCF7E5', skin: '#F2B98F', hair: '#4A3421', shirt: '#2563EB', beard: false, long: true },
}

export default function Avatar({ variant = 'm1', size = 40 }) {
  const v = VARIANTS[variant] || VARIANTS.m1
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ borderRadius: '50%' }}>
      <circle cx="24" cy="24" r="24" fill={v.bg} />
      <clipPath id={`avclip-${variant}`}>
        <circle cx="24" cy="24" r="24" />
      </clipPath>
      <g clipPath={`url(#avclip-${variant})`}>
        {/* long hair back layer */}
        {v.long && <path d="M10 22 q0 -14 14 -14 q14 0 14 14 v20 h-28 z" fill={v.hair} />}
        {/* shoulders / shirt */}
        <path d="M8 48 q0 -12 16 -12 q16 0 16 12 z" fill={v.shirt} />
        {/* neck */}
        <rect x="20" y="28" width="8" height="8" rx="3" fill={v.skin} />
        {/* head */}
        <circle cx="24" cy="20" r="9.5" fill={v.skin} />
        {/* hair top */}
        {v.long ? (
          <path d="M14 20 q0 -11 10 -11 q10 0 10 11 q-3 -6 -10 -6 q-7 0 -10 6 z" fill={v.hair} />
        ) : (
          <path d="M14.5 19 q0 -10 9.5 -10 q9.5 0 9.5 10 q-2 -5.5 -9.5 -5.5 q-7.5 0 -9.5 5.5 z" fill={v.hair} />
        )}
        {/* beard */}
        {v.beard && (
          <path d="M16.5 22 q0 8 7.5 8 q7.5 0 7.5 -8 q-1 6 -7.5 6 q-6.5 0 -7.5 -6 z" fill={v.hair} opacity="0.85" />
        )}
        {/* eyes */}
        <circle cx="20.5" cy="19.5" r="1.1" fill="#20242B" />
        <circle cx="27.5" cy="19.5" r="1.1" fill="#20242B" />
        {/* smile */}
        <path d="M21.5 24.5 q2.5 2 5 0" stroke="#B5754A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}
