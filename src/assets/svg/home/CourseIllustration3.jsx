export default function CourseIllustration3() {
  return (
    <svg viewBox="0 0 380 190" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UI and UX design">
      <rect width="380" height="190" fill="#F9BD4B" />

      {/* smartphone */}
      <g>
        <rect x="128" y="18" width="92" height="168" rx="16" fill="#1B2B4B" />
        <rect x="136" y="30" width="76" height="144" rx="8" fill="#FFFFFF" />
        {/* speaker notch */}
        <rect x="160" y="22" width="28" height="4" rx="2" fill="#3A4A6E" />
        {/* profile row */}
        <circle cx="152" cy="48" r="8" fill="#CBDBF7" />
        <rect x="166" y="42" width="36" height="5" rx="2.5" fill="#DCE4F2" />
        <rect x="166" y="51" width="24" height="4" rx="2" fill="#EDF1F8" />
        {/* UI blocks */}
        <rect x="144" y="66" width="60" height="30" rx="5" fill="#E3ECFF" />
        <rect x="144" y="102" width="28" height="24" rx="5" fill="#FDE9C8" />
        <rect x="176" y="102" width="28" height="24" rx="5" fill="#DCF7E5" />
        <rect x="144" y="132" width="60" height="6" rx="3" fill="#DCE4F2" />
        <rect x="144" y="144" width="42" height="6" rx="3" fill="#EDF1F8" />
        <rect x="144" y="158" width="60" height="10" rx="5" fill="#2563EB" />
      </g>

      {/* design sheet panel */}
      <g>
        <rect x="242" y="46" width="86" height="100" rx="10" fill="#FFFFFF" />
        {/* gear icon */}
        <g transform="translate(285, 78)">
          <circle r="16" fill="none" stroke="#1B2B4B" strokeWidth="5" strokeDasharray="6 4" />
          <circle r="6" fill="#1B2B4B" />
        </g>
        <rect x="258" y="106" width="54" height="6" rx="3" fill="#DCE4F2" />
        <rect x="258" y="120" width="38" height="6" rx="3" fill="#EDF1F8" />
        {/* orange dot */}
        <circle cx="316" cy="60" r="6" fill="#F97316" />
      </g>

      {/* decorations */}
      <circle cx="70" cy="50" r="6" fill="#FFFFFF" opacity="0.8" />
      <circle cx="94" cy="140" r="4" fill="#FFFFFF" opacity="0.7" />
      <path d="M52 100 l8 8 M60 100 l-8 8" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <path d="M340 160 h12 M346 154 v12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}
