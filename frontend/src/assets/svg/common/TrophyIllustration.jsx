export default function TrophyIllustration() {
  return (
    <svg
      viewBox="0 0 240 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="trophy-illustration-svg"
      role="img"
      aria-label="Golden trophy with laurel leaves and confetti"
    >
      {/* confetti */}
      <circle cx="30" cy="30" r="4" fill="#F97316" />
      <circle cx="212" cy="44" r="3.4" fill="#2563EB" />
      <circle cx="196" cy="120" r="3" fill="#4ECB8D" />
      <rect x="52" y="14" width="8" height="8" rx="2" fill="#EC4899" transform="rotate(20 56 18)" />
      <rect x="180" y="16" width="7" height="7" rx="2" fill="#F9B233" transform="rotate(-16 183 19)" />
      <path d="M22 90 l3.5 7 7.5 1 -5.5 5.5 1.5 7.5 -7 -3.5 -7 3.5 1.5 -7.5 -5.5 -5.5 7.5 -1 z" fill="#F9B233" />
      <path
        d="M206 76 l2.5 5 5.5 0.8 -4 4 1 5.6 -5 -2.6 -5 2.6 1 -5.6 -4 -4 5.5 -0.8 z"
        fill="#F9B233"
      />
      <path d="M44 132 l6 6 M50 132 l-6 6" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />

      {/* laurel leaves — left */}
      <g fill="#4CAF6E">
        <path d="M56 168 q-26 -8 -34 -36 q22 2 32 24 q2 6 2 12 z" />
        <path d="M52 138 q-22 -12 -24 -40 q20 6 26 28 q1 7 -2 12 z" />
        <path d="M56 108 q-14 -18 -8 -42 q16 12 14 34 q-1 5 -6 8 z" />
      </g>
      {/* laurel leaves — right */}
      <g fill="#4CAF6E">
        <path d="M184 168 q26 -8 34 -36 q-22 2 -32 24 q-2 6 -2 12 z" />
        <path d="M188 138 q22 -12 24 -40 q-20 6 -26 28 q-1 7 2 12 z" />
        <path d="M184 108 q14 -18 8 -42 q-16 12 -14 34 q1 5 6 8 z" />
      </g>

      {/* trophy handles */}
      <path
        d="M78 52 h-18 q-10 0 -9 11 q2 24 30 30"
        stroke="#E8A100"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M162 52 h18 q10 0 9 11 q-2 24 -30 30"
        stroke="#E8A100"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {/* trophy cup */}
      <path
        d="M74 38 h92 v34 q0 34 -46 44 q-46 -10 -46 -44 z"
        fill="#FFC107"
      />
      <path d="M74 38 h92 v10 h-92 z" fill="#FFD34E" />
      {/* cup shine */}
      <path d="M88 52 q-2 30 14 48 q-24 -12 -22 -48 z" fill="#FFE28A" opacity="0.8" />
      {/* star emblem */}
      <path
        d="M120 62 l5 10.5 11.5 1.6 -8.3 8 2 11.4 -10.2 -5.4 -10.2 5.4 2 -11.4 -8.3 -8 11.5 -1.6 z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* stem + base */}
      <path d="M112 116 h16 l4 18 h-24 z" fill="#E8A100" />
      <rect x="96" y="134" width="48" height="12" rx="4" fill="#FFC107" />
      <rect x="86" y="146" width="68" height="16" rx="5" fill="#2D5BCE" />
      <rect x="86" y="146" width="68" height="6" rx="3" fill="#3E6DE0" />

      {/* shadow */}
      <ellipse cx="120" cy="172" rx="58" ry="7" fill="#E8B94A" opacity="0.45" />
    </svg>
  )
}
