export default function BlogIllustration1() {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Frontend developer working on laptop">
      <rect width="300" height="130" fill="#EDF2FB" />

      {/* floating code panel (left) */}
      <g>
        <rect x="26" y="18" width="66" height="48" rx="6" fill="#1B2B4B" />
        <circle cx="35" cy="26" r="2.2" fill="#F56565" />
        <circle cx="42" cy="26" r="2.2" fill="#F9B233" />
        <circle cx="49" cy="26" r="2.2" fill="#4ECB8D" />
        <rect x="33" y="34" width="34" height="4" rx="2" fill="#5A8DEE" />
        <rect x="33" y="42" width="46" height="4" rx="2" fill="#4ECB8D" />
        <rect x="40" y="50" width="32" height="4" rx="2" fill="#F9B233" />
        <rect x="33" y="58" width="40" height="4" rx="2" fill="#8FA8DD" />
      </g>

      {/* dashboard card (top right) */}
      <g>
        <rect x="228" y="16" width="52" height="40" rx="6" fill="#FFFFFF" />
        <rect x="235" y="23" width="24" height="4" rx="2" fill="#DCE4F2" />
        <rect x="235" y="31" width="38" height="4" rx="2" fill="#EDF1F8" />
        <rect x="235" y="41" width="10" height="9" rx="2" fill="#2563EB" />
        <rect x="248" y="38" width="10" height="12" rx="2" fill="#8FA8DD" />
        <rect x="261" y="43" width="10" height="7" rx="2" fill="#44C76D" />
      </g>

      {/* desk */}
      <rect x="96" y="106" width="130" height="7" rx="3.5" fill="#C9D4E8" />

      {/* female character with laptop */}
      <g>
        {/* hair back */}
        <path d="M142 58 q-8 4 -8 22 l4 22 8 -2 q-6 -22 -4 -42 z" fill="#1E2129" />
        {/* body */}
        <path d="M140 78 q2 -18 20 -18 q18 0 20 18 l2 26 -44 0 z" fill="#2E63E8" />
        {/* head */}
        <circle cx="160" cy="52" r="14" fill="#F2B98F" />
        <path d="M146 50 q0 -14 14 -14 q14 0 14 14 q-4 -8 -14 -8 q-10 0 -14 8 z" fill="#1E2129" />
        <circle cx="155" cy="52" r="1.4" fill="#20242B" />
        <circle cx="165" cy="52" r="1.4" fill="#20242B" />
        <path d="M157 58 q3 2.4 6 0" stroke="#C77E52" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* arms */}
        <path d="M144 84 q-4 12 6 20 l6 -6 q-6 -6 -4 -14 z" fill="#3B71F5" />
        <path d="M176 84 q4 12 -6 20 l-6 -6 q6 -6 4 -14 z" fill="#3B71F5" />
        {/* laptop */}
        <path d="M138 96 l44 0 4 10 -52 0 z" fill="#BEC5D6" />
        <path d="M142 98 l36 0 2.6 6 -41.2 0 z" fill="#D9DDE7" />
      </g>

      {/* plant bottom left */}
      <g>
        <path d="M52 96 q-1 -16 9 -24 q1 12 -4 24 z" fill="#3FA95C" />
        <path d="M60 96 q1 -18 14 -26 q2 13 -8 26 z" fill="#4ECB8D" />
        <path d="M48 98 h24 l-3.4 18 q-0.7 4 -4.6 4 h-8 q-3.9 0 -4.6 -4 z" fill="#2D5BCE" />
      </g>

      {/* decorations */}
      <circle cx="212" cy="90" r="3.4" fill="#F9B233" />
      <path d="M256 82 l6 6 M262 82 l-6 6" stroke="#8FA8DD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="106" cy="30" r="3" stroke="#2563EB" strokeWidth="1.8" fill="none" />
    </svg>
  )
}
