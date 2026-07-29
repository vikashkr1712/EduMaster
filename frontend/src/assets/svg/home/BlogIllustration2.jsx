export default function BlogIllustration2() {
  return (
    <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JavaScript programming">
      <rect width="300" height="130" fill="#EAF0FA" />

      {/* back code panel */}
      <g>
        <rect x="66" y="16" width="88" height="66" rx="8" fill="#22304F" />
        <circle cx="77" cy="26" r="2.4" fill="#F56565" />
        <circle cx="85" cy="26" r="2.4" fill="#F9B233" />
        <circle cx="93" cy="26" r="2.4" fill="#4ECB8D" />
        <rect x="76" y="36" width="46" height="4.6" rx="2.3" fill="#5A8DEE" />
        <rect x="76" y="46" width="62" height="4.6" rx="2.3" fill="#4ECB8D" />
        <rect x="84" y="56" width="42" height="4.6" rx="2.3" fill="#F9B233" />
        <rect x="76" y="66" width="52" height="4.6" rx="2.3" fill="#8FA8DD" />
      </g>

      {/* front code panel */}
      <g>
        <rect x="176" y="40" width="80" height="60" rx="8" fill="#1B2B4B" />
        <circle cx="187" cy="50" r="2.4" fill="#F56565" />
        <circle cx="195" cy="50" r="2.4" fill="#F9B233" />
        <circle cx="203" cy="50" r="2.4" fill="#4ECB8D" />
        <rect x="186" y="60" width="40" height="4.6" rx="2.3" fill="#4ECB8D" />
        <rect x="186" y="70" width="56" height="4.6" rx="2.3" fill="#5A8DEE" />
        <rect x="194" y="80" width="36" height="4.6" rx="2.3" fill="#F9B233" />
        <rect x="186" y="90" width="46" height="4.6" rx="2.3" fill="#8FA8DD" />
      </g>

      {/* JS badge */}
      <g>
        <rect x="106" y="52" width="62" height="62" rx="10" fill="#F8B400" />
        <rect x="106" y="52" width="62" height="62" rx="10" stroke="#E8A100" strokeWidth="2" />
        <text
          x="137"
          y="95"
          textAnchor="middle"
          fontFamily="Poppins, sans-serif"
          fontSize="30"
          fontWeight="700"
          fill="#1B2B4B"
        >
          JS
        </text>
      </g>

      {/* plant */}
      <g>
        <path d="M262 92 q-1 -14 8 -21 q1 10 -3.5 21 z" fill="#3FA95C" />
        <path d="M269 92 q1 -16 12 -23 q2 12 -7 23 z" fill="#4ECB8D" />
        <path d="M258 94 h22 l-3 16 q-0.6 4 -4.2 4 h-7.6 q-3.6 0 -4.2 -4 z" fill="#F97316" />
      </g>

      {/* decorations */}
      <circle cx="42" cy="36" r="3.4" fill="#F9B233" />
      <path d="M36 96 l6 6 M42 96 l-6 6" stroke="#8FA8DD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="272" cy="26" r="3" stroke="#2563EB" strokeWidth="1.8" fill="none" />
    </svg>
  )
}
