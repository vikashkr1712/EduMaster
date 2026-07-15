export default function BlogIllustration4() {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data scientist analyzing charts">
      <rect width="300" height="130" fill="#EDF2FB" />

      {/* pie chart card */}
      <g>
        <rect x="28" y="16" width="66" height="52" rx="7" fill="#FFFFFF" />
        <circle cx="52" cy="42" r="15" fill="#2563EB" />
        <path d="M52 42 L52 27 A15 15 0 0 1 66 47 Z" fill="#F9B233" />
        <path d="M52 42 L66 47 A15 15 0 0 1 45 55.5 Z" fill="#44C76D" />
        <rect x="72" y="30" width="16" height="4" rx="2" fill="#DCE4F2" />
        <rect x="72" y="38" width="12" height="4" rx="2" fill="#EDF1F8" />
        <rect x="72" y="46" width="14" height="4" rx="2" fill="#DCE4F2" />
      </g>

      {/* bar chart card */}
      <g>
        <rect x="106" y="12" width="72" height="56" rx="7" fill="#FFFFFF" />
        <rect x="116" y="46" width="9" height="14" rx="2.5" fill="#8FA8DD" />
        <rect x="129" y="38" width="9" height="22" rx="2.5" fill="#2563EB" />
        <rect x="142" y="30" width="9" height="30" rx="2.5" fill="#8FA8DD" />
        <rect x="155" y="22" width="9" height="38" rx="2.5" fill="#2563EB" />
      </g>

      {/* line chart / stats widget */}
      <g>
        <rect x="230" y="20" width="52" height="42" rx="6" fill="#FFFFFF" />
        <path d="M238 52 l10 -10 8 5 16 -16" stroke="#44C76D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="272" cy="31" r="3.4" fill="#44C76D" />
      </g>

      {/* desk */}
      <rect x="120" y="108" width="130" height="7" rx="3.5" fill="#C9D4E8" />

      {/* female character with laptop */}
      <g>
        <path d="M186 62 q-8 4 -8 22 l4 22 8 -2 q-6 -22 -4 -42 z" fill="#1E2129" />
        <path d="M184 82 q2 -18 20 -18 q18 0 20 18 l2 24 -44 0 z" fill="#2E63E8" />
        <circle cx="204" cy="56" r="14" fill="#F2B98F" />
        <path d="M190 54 q0 -14 14 -14 q14 0 14 14 q-4 -8 -14 -8 q-10 0 -14 8 z" fill="#1E2129" />
        <circle cx="199" cy="56" r="1.4" fill="#20242B" />
        <circle cx="209" cy="56" r="1.4" fill="#20242B" />
        <path d="M201 62 q3 2.4 6 0" stroke="#C77E52" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M188 88 q-4 12 6 18 l6 -6 q-6 -5 -4 -12 z" fill="#3B71F5" />
        <path d="M220 88 q4 12 -6 18 l-6 -6 q6 -5 4 -12 z" fill="#3B71F5" />
        <path d="M182 98 l44 0 4 10 -52 0 z" fill="#BEC5D6" />
        <path d="M186 100 l36 0 2.6 6 -41.2 0 z" fill="#D9DDE7" />
      </g>

      {/* stats floating widget (left of character) */}
      <g>
        <rect x="120" y="80" width="44" height="22" rx="5" fill="#FFFFFF" />
        <rect x="127" y="87" width="20" height="4" rx="2" fill="#2563EB" />
        <rect x="127" y="94" width="30" height="3.4" rx="1.7" fill="#DCE4F2" />
      </g>

      {/* decorations */}
      <circle cx="52" cy="98" r="3.4" fill="#F9B233" />
      <path d="M72 84 l6 6 M78 84 l-6 6" stroke="#8FA8DD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="268" cy="94" r="3" stroke="#2563EB" strokeWidth="1.8" fill="none" />
    </svg>
  )
}
