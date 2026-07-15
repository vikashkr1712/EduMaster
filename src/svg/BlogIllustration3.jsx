export default function BlogIllustration3() {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cloud computing with upload and database">
      <rect width="300" height="130" fill="#EDF2FB" />

      {/* main cloud */}
      <g>
        <path
          d="M104 66 a26 26 0 0 1 50 -10 a20 20 0 0 1 24 20 a17 17 0 0 1 -17 17 h-64 a19 19 0 0 1 -3 -37.8 z"
          fill="#3B82F6"
        />
        {/* upload arrow */}
        <path d="M136 78 v-24 M136 54 l-10 11 M136 54 l10 11" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* small back cloud */}
      <path
        d="M196 34 a14 14 0 0 1 27 -5 a11 11 0 0 1 13 11 a9.5 9.5 0 0 1 -9.5 9.5 h-34 a10.5 10.5 0 0 1 -1.5 -20.9 z"
        fill="#93B8F5"
      />

      {/* database */}
      <g>
        <ellipse cx="222" cy="76" rx="26" ry="9" fill="#7FA8EE" />
        <path d="M196 76 v30 q0 9 26 9 q26 0 26 -9 v-30" fill="#5A8DEE" />
        <path d="M196 91 q0 9 26 9 q26 0 26 -9" stroke="#FFFFFF" strokeWidth="2.4" fill="none" opacity="0.8" />
        <ellipse cx="222" cy="76" rx="26" ry="9" fill="#9BBCF6" />
      </g>

      {/* connection lines + nodes */}
      <g>
        <path d="M104 96 q-20 8 -40 6" stroke="#8FA8DD" strokeWidth="2.4" strokeDasharray="4 5" fill="none" />
        <path d="M170 92 q12 8 26 4" stroke="#8FA8DD" strokeWidth="2.4" strokeDasharray="4 5" fill="none" />
        <circle cx="60" cy="102" r="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.4" />
        <circle cx="88" cy="30" r="6" fill="#FFFFFF" stroke="#44C76D" strokeWidth="2.4" />
        <path d="M92 34 q10 8 18 20" stroke="#8FA8DD" strokeWidth="2.4" strokeDasharray="4 5" fill="none" />
      </g>

      {/* small tree/plant */}
      <g>
        <circle cx="42" cy="62" r="12" fill="#4ECB8D" />
        <circle cx="34" cy="70" r="9" fill="#3FA95C" />
        <rect x="39" y="72" width="6" height="18" rx="3" fill="#8B6244" />
      </g>

      {/* decorations */}
      <circle cx="270" cy="110" r="3.4" fill="#F9B233" />
      <path d="M262 16 l6 6 M268 16 l-6 6" stroke="#8FA8DD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
