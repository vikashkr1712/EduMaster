export default function CourseIllustration2() {
  return (
    <svg viewBox="0 0 380 190" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data science and machine learning">
      <rect width="380" height="190" fill="#7ED6A2" />

      {/* analytics board */}
      <g>
        <rect x="86" y="30" width="160" height="110" rx="10" fill="#FFFFFF" />
        {/* header lines */}
        <rect x="102" y="46" width="60" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="102" y="60" width="40" height="6" rx="3" fill="#EDF1F8" />
        {/* bar chart */}
        <rect x="104" y="104" width="12" height="22" rx="3" fill="#8FA8DD" />
        <rect x="122" y="94" width="12" height="32" rx="3" fill="#2563EB" />
        <rect x="140" y="84" width="12" height="42" rx="3" fill="#8FA8DD" />
        <rect x="158" y="72" width="12" height="54" rx="3" fill="#2563EB" />
        {/* trend line */}
        <path
          d="M182 118 l16 -16 12 8 22 -26"
          stroke="#44C76D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="232" cy="84" r="5" fill="#44C76D" />
        <rect x="184" y="46" width="48" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="184" y="60" width="34" height="6" rx="3" fill="#EDF1F8" />
      </g>

      {/* pie chart */}
      <g>
        <circle cx="292" cy="112" r="46" fill="#FFFFFF" />
        <path d="M292 112 L292 66 A46 46 0 0 1 335 129 Z" fill="#2563EB" />
        <path d="M292 112 L335 129 A46 46 0 0 1 268 152 Z" fill="#44C76D" />
        <circle cx="292" cy="112" r="18" fill="#FFFFFF" />
      </g>

      {/* decorations */}
      <circle cx="52" cy="46" r="5" fill="#FFFFFF" opacity="0.85" />
      <circle cx="340" cy="34" r="4" fill="#FFFFFF" opacity="0.75" />
      <path d="M40 130 l8 8 M48 130 l-8 8" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <path d="M352 64 h12 M358 58 v12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}
