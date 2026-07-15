export default function WhyChooseIllustration() {
  return (
    <svg
      viewBox="0 0 700 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="whychoose-illustration-svg"
      role="img"
      aria-label="Female student learning online at her desk"
    >
      {/* ---------- background blob ---------- */}
      <path
        d="M120 300 C 90 170, 220 60, 380 60 C 540 60, 660 150, 660 300 C 660 440, 540 530, 370 530 C 210 530, 150 430, 120 300 Z"
        fill="#2563EB"
        opacity="0.07"
      />

      {/* ---------- dashed connector curves ---------- */}
      <path
        d="M120 140 C 200 70, 340 40, 460 70"
        stroke="#C4D2F2"
        strokeWidth="2"
        strokeDasharray="5 7"
      />
      <path
        d="M600 130 C 660 220, 660 330, 600 400"
        stroke="#C4D2F2"
        strokeWidth="2"
        strokeDasharray="5 7"
      />

      {/* ---------- floating decorations ---------- */}
      <g stroke="#4ECB8D" strokeWidth="2.4" strokeLinecap="round">
        <path d="M640 470 l9 9 M649 470 l-9 9" />
        <path d="M60 420 l9 9 M69 420 l-9 9" />
      </g>
      <g stroke="#8FA8DD" strokeWidth="2.4" strokeLinecap="round">
        <path d="M70 60 l9 9 M79 60 l-9 9" />
      </g>
      <circle cx="668" cy="240" r="5" fill="#F9B233" />
      <circle cx="40" cy="250" r="5" stroke="#2563EB" strokeWidth="2.4" fill="none" />
      <circle cx="620" cy="60" r="4" fill="#F97316" opacity="0.8" />
      <circle cx="140" cy="520" r="4.5" fill="#2563EB" opacity="0.5" />
      <g fill="#B9C6E4">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <circle key={`wd${r}-${c}`} cx={560 + c * 13} cy={470 + r * 13} r="2" />
          ))
        )}
      </g>

      {/* ---------- graduation cap card (top left) ---------- */}
      <g filter="url(#wcShadow)">
        <rect x="96" y="96" width="104" height="96" rx="14" fill="#FFFFFF" />
        <path d="M148 118 l38 15 -38 15 -38 -15 z" fill="#1B2B4B" />
        <path d="M126 141 v16 q22 12 44 0 v-16 l-22 9 z" fill="#2563EB" />
        <path d="M184 134 v18" stroke="#F9B233" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="184" cy="156" r="3.4" fill="#F9B233" />
      </g>

      {/* ---------- analytics card (mid left) ---------- */}
      <g filter="url(#wcShadow)">
        <rect x="60" y="240" width="128" height="104" rx="14" fill="#FFFFFF" />
        <rect x="78" y="296" width="14" height="30" rx="4" fill="#8FA8DD" />
        <rect x="98" y="284" width="14" height="42" rx="4" fill="#EC4899" />
        <rect x="118" y="272" width="14" height="54" rx="4" fill="#2563EB" />
        <path
          d="M78 276 l24 -18 16 8 30 -24"
          stroke="#44C76D"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M148 222 l4 14 -14 -3 z" fill="#44C76D" transform="rotate(12 148 229)" />
      </g>

      {/* ---------- video player card (top right) ---------- */}
      <g filter="url(#wcShadow)">
        <rect x="450" y="60" width="176" height="126" rx="12" fill="#FFFFFF" />
        <path d="M450 72 a12 12 0 0 1 12 -12 h152 a12 12 0 0 1 12 12 v13 h-176 z" fill="#1B2B4B" />
        <circle cx="466" cy="66" r="3" fill="#4ECB8D" />
        <circle cx="477" cy="66" r="3" fill="#F9B233" />
        <circle cx="488" cy="66" r="3" fill="#F56565" />
        <circle cx="538" cy="128" r="23" fill="#2563EB" />
        <path d="M531.5 116.5 l19 11.5 -19 11.5 z" fill="#FFFFFF" />
        <rect x="466" y="164" width="144" height="5" rx="2.5" fill="#E5EAF3" />
        <rect x="466" y="164" width="60" height="5" rx="2.5" fill="#2563EB" />
      </g>

      {/* ---------- checklist card (right) ---------- */}
      <g filter="url(#wcShadow)">
        <rect x="546" y="216" width="118" height="128" rx="14" fill="#FFFFFF" />
        {[0, 1, 2].map((i) => (
          <g key={`chk${i}`} transform={`translate(562, ${238 + i * 34})`}>
            <circle cx="9" cy="9" r="9" fill="#4ECB8D" />
            <path
              d="M5 9.5 l3 3 5.5 -6"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="26" y="4" width="60" height="6" rx="3" fill="#DCE4F2" />
            <rect x="26" y="13" width="42" height="5" rx="2.5" fill="#EDF1F8" />
          </g>
        ))}
      </g>

      {/* ---------- chat bubble (bottom right) ---------- */}
      <g filter="url(#wcShadow)">
        <rect x="560" y="374" width="86" height="54" rx="15" fill="#2563EB" />
        <path d="M578 426 l-7 15 20 -13 z" fill="#2563EB" />
        <circle cx="585" cy="401" r="4.6" fill="#FFFFFF" />
        <circle cx="603" cy="401" r="4.6" fill="#FFFFFF" />
        <circle cx="621" cy="401" r="4.6" fill="#FFFFFF" />
      </g>

      {/* ---------- desk ---------- */}
      <rect x="150" y="470" width="440" height="14" rx="7" fill="#D3DCEC" />
      <ellipse cx="370" cy="540" rx="230" ry="14" fill="#E5EAF4" />

      {/* ---------- books stack on desk (left of character) ---------- */}
      <g>
        <rect x="176" y="448" width="96" height="22" rx="6" fill="#2D5BCE" />
        <rect x="182" y="426" width="90" height="22" rx="6" fill="#44C76D" />
        <rect x="188" y="404" width="84" height="22" rx="6" fill="#F8B400" />
        <rect x="252" y="408" width="10" height="14" rx="3" fill="#FFFFFF" opacity="0.85" />
        <rect x="246" y="430" width="10" height="14" rx="3" fill="#FFFFFF" opacity="0.85" />
        <rect x="252" y="452" width="10" height="14" rx="3" fill="#FFFFFF" opacity="0.85" />
      </g>

      {/* ---------- female character at desk ---------- */}
      <g>
        {/* hair back — long black hair */}
        <path
          d="M348 210 q-32 10 -36 62 q-3 44 4 88 q2 16 18 16 l14 -2 q-10 -70 0 -164 z"
          fill="#1E2129"
        />
        {/* torso — blue shirt */}
        <path
          d="M330 300 q4 -42 42 -46 q40 -4 52 34 q8 28 6 66 l-100 6 q-4 -34 0 -60 z"
          fill="#2E63E8"
        />
        {/* left arm reaching to laptop */}
        <path
          d="M342 310 q-16 34 -2 66 l16 18 18 -10 -14 -20 q-8 -26 2 -48 z"
          fill="#3B71F5"
        />
        {/* right arm writing */}
        <path
          d="M414 300 q22 22 20 58 l-8 22 -20 -6 6 -20 q0 -28 -14 -44 z"
          fill="#2E63E8"
        />
        {/* hands */}
        <circle cx="362" cy="392" r="9" fill="#F2B98F" />
        <circle cx="410" cy="380" r="9" fill="#F2B98F" />
        {/* pencil in hand */}
        <path d="M410 380 l26 14" stroke="#F9B233" strokeWidth="5" strokeLinecap="round" />

        {/* neck + head */}
        <path d="M372 246 q10 8 20 6 l-2 16 q-10 4 -18 -2 z" fill="#E8A97E" />
        <circle cx="382" cy="222" r="32" fill="#F2B98F" />
        {/* face details */}
        <circle cx="372" cy="220" r="2.8" fill="#20242B" />
        <circle cx="394" cy="220" r="2.8" fill="#20242B" />
        <path d="M378 234 q5 5 12 1" stroke="#C77E52" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M366 212 q4 -4 9 -2 M388 210 q5 -2 9 2" stroke="#1E2129" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* hair front */}
        <path
          d="M350 216 q-4 -36 32 -38 q34 -2 36 32 q0 8 -4 12 q-2 -18 -14 -20 q-6 10 -22 8 q-14 -2 -20 8 q-4 6 -3 12 q-5 -6 -5 -14 z"
          fill="#1E2129"
        />
        {/* hair side strand */}
        <path d="M414 214 q10 26 4 60 q-2 14 -12 18 q8 -42 0 -72 z" fill="#1E2129" />
      </g>

      {/* ---------- laptop on desk ---------- */}
      <g>
        <path d="M296 400 l84 -6 q7 -0.5 8 6 l7 62 q1 7 -6 7.5 l-84 6 q-7 0.5 -8 -6 l-7 -62 q-1 -7 6 -7.5 z" fill="#BEC5D6" />
        <path d="M303 407 l74 -5 6 54 -74 5 z" fill="#E7EBF4" />
        <path d="M282 468 l118 -8 q8 -0.5 9 7 l1 3 -128 9 z" fill="#D9DDE7" />
      </g>

      {/* ---------- plant (bottom right) ---------- */}
      <g>
        <path d="M614 452 q-2 -30 14 -46 q3 20 -5 46 z" fill="#3FA95C" />
        <path d="M628 452 q0 -36 24 -52 q5 24 -13 52 z" fill="#4ECB8D" />
        <path d="M641 452 q9 -22 30 -28 q-3 20 -21 28 z" fill="#3FA95C" />
        <path d="M608 456 h52 l-7 40 q-1 8 -9 8 h-20 q-8 0 -9 -8 z" fill="#2D5BCE" />
        <rect x="604" y="452" width="60" height="9" rx="4.5" fill="#3E6DE0" />
      </g>

      <defs>
        <filter id="wcShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1B2B4B" floodOpacity="0.12" />
        </filter>
      </defs>
    </svg>
  )
}
