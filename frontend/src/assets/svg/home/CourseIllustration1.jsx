export default function CourseIllustration1() {
  return (
    <svg viewBox="0 0 380 190" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Full stack web development">
      <rect width="380" height="190" fill="#CBDBF7" />

      {/* plant left */}
      <g>
        <path d="M52 122 q-2 -26 14 -40 q2 18 -6 40 z" fill="#3FA95C" />
        <path d="M64 122 q2 -30 22 -42 q4 20 -12 42 z" fill="#4ECB8D" />
        <path d="M48 128 h34 l-5 28 q-1 6 -7 6 h-10 q-6 0 -7 -6 z" fill="#F9B233" />
      </g>

      {/* laptop */}
      <g>
        <rect x="118" y="34" width="150" height="98" rx="10" fill="#FFFFFF" />
        <rect x="118" y="34" width="150" height="98" rx="10" stroke="#AFC4E8" strokeWidth="2" />
        {/* code symbol */}
        <path
          d="M168 66 l-16 17 16 17"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M218 66 l16 17 -16 17"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M200 60 l-14 46" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
        {/* base */}
        <path d="M104 132 h178 l-10 14 q-2 4 -8 4 h-142 q-6 0 -8 -4 z" fill="#94A9CE" />
        <path d="M104 132 h178 v5 h-178 z" fill="#B9C9E8" />
      </g>

      {/* dark code editor panel */}
      <g>
        <rect x="278" y="44" width="76" height="86" rx="8" fill="#1B2B4B" />
        <circle cx="290" cy="56" r="3" fill="#F56565" />
        <circle cx="300" cy="56" r="3" fill="#F9B233" />
        <circle cx="310" cy="56" r="3" fill="#4ECB8D" />
        <rect x="288" y="68" width="42" height="5" rx="2.5" fill="#4ECB8D" />
        <rect x="288" y="80" width="54" height="5" rx="2.5" fill="#5A8DEE" />
        <rect x="296" y="92" width="40" height="5" rx="2.5" fill="#F9B233" />
        <rect x="296" y="104" width="30" height="5" rx="2.5" fill="#8FA8DD" />
        <rect x="288" y="116" width="46" height="5" rx="2.5" fill="#5A8DEE" />
      </g>

      {/* decorations */}
      <circle cx="90" cy="40" r="5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="330" cy="24" r="4" fill="#FFFFFF" opacity="0.7" />
      <path d="M30 60 l8 8 M38 60 l-8 8" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}
