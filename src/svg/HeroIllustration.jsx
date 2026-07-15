export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 720 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-illustration-svg"
      role="img"
      aria-label="Student learning online while sitting on a stack of books"
    >
      {/* ---------- decorative dashed connector paths ---------- */}
      <path
        d="M170 130 C 260 40, 420 30, 470 90"
        stroke="#C4D2F2"
        strokeWidth="2"
        strokeDasharray="5 7"
      />
      <path
        d="M120 260 C 90 360, 150 470, 250 520"
        stroke="#C4D2F2"
        strokeWidth="2"
        strokeDasharray="5 7"
      />
      <path
        d="M520 120 C 620 150, 660 240, 640 320"
        stroke="#C4D2F2"
        strokeWidth="2"
        strokeDasharray="5 7"
      />

      {/* ---------- dotted pattern (top left) ---------- */}
      <g fill="#B9C6E4">
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <circle key={`d${r}-${c}`} cx={64 + c * 14} cy={40 + r * 14} r="2.2" />
          ))
        )}
      </g>

      {/* ---------- floating decorations ---------- */}
      {/* x marks */}
      <g stroke="#8FA8DD" strokeWidth="2.4" strokeLinecap="round">
        <path d="M52 330 l10 10 M62 330 l-10 10" />
        <path d="M666 350 l10 10 M676 350 l-10 10" />
        <path d="M600 60 l9 9 M609 60 l-9 9" opacity="0.7" />
      </g>
      {/* + mark */}
      <g stroke="#4ECB8D" strokeWidth="2.6" strokeLinecap="round">
        <path d="M615 470 h14 M622 463 v14" />
      </g>
      {/* small circles */}
      <circle cx="690" cy="220" r="6" fill="#F9B233" />
      <circle cx="30" cy="470" r="5" stroke="#2563EB" strokeWidth="2.5" fill="none" />
      <circle cx="700" cy="430" r="4" fill="#2563EB" opacity="0.55" />
      <circle cx="160" cy="560" r="4.5" fill="#F9B233" opacity="0.8" />

      {/* ---------- light bulb (top) ---------- */}
      <g>
        {/* rays */}
        <g stroke="#FFC107" strokeWidth="3" strokeLinecap="round">
          <path d="M425 20 v-14" />
          <path d="M383 36 l-11 -10" />
          <path d="M467 36 l11 -10" />
          <path d="M368 74 h-15" />
          <path d="M482 74 h15" />
        </g>
        {/* bulb glass */}
        <circle cx="425" cy="74" r="30" fill="#FFC107" />
        <circle cx="425" cy="74" r="30" fill="url(#bulbShine)" />
        {/* filament */}
        <path
          d="M418 84 q7 -10 14 0"
          stroke="#E28E00"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* base */}
        <rect x="415" y="102" width="20" height="6" rx="3" fill="#94A3B8" />
        <rect x="417" y="109" width="16" height="5" rx="2.5" fill="#94A3B8" />
        <rect x="419" y="115" width="12" height="4" rx="2" fill="#94A3B8" />
      </g>

      {/* ---------- video player card (top left) ---------- */}
      <g filter="url(#cardShadow)">
        <rect x="90" y="130" width="180" height="128" rx="12" fill="#FFFFFF" />
        <path d="M90 142 a12 12 0 0 1 12 -12 h156 a12 12 0 0 1 12 12 v14 h-180 z" fill="#1B2B4B" />
        <circle cx="106" cy="143" r="3.2" fill="#4ECB8D" />
        <circle cx="118" cy="143" r="3.2" fill="#F9B233" />
        <circle cx="130" cy="143" r="3.2" fill="#F56565" />
        {/* play button */}
        <circle cx="180" cy="202" r="24" fill="#2563EB" />
        <path d="M173 190 l20 12 -20 12 z" fill="#FFFFFF" />
        {/* progress line */}
        <rect x="106" y="240" width="148" height="5" rx="2.5" fill="#E5EAF3" />
        <rect x="106" y="240" width="66" height="5" rx="2.5" fill="#F9B233" />
      </g>

      {/* ---------- analytics card (left) ---------- */}
      <g filter="url(#cardShadow)">
        <rect x="52" y="330" width="150" height="104" rx="12" fill="#FFFFFF" />
        {/* pie chart */}
        <circle cx="94" cy="374" r="24" fill="#E8EEF9" />
        <path d="M94 374 L94 350 A24 24 0 0 1 117 380 Z" fill="#F9B233" />
        <path d="M94 374 L117 380 A24 24 0 0 1 82 395 Z" fill="#2563EB" />
        {/* stat lines */}
        <rect x="130" y="356" width="56" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="130" y="371" width="42" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="130" y="386" width="50" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="70" y="410" width="116" height="7" rx="3.5" fill="#EDF1F8" />
      </g>

      {/* ---------- chat bubble (right) ---------- */}
      <g filter="url(#cardShadow)">
        <rect x="560" y="170" width="96" height="60" rx="16" fill="#2563EB" />
        <path d="M580 228 l-8 16 22 -14 z" fill="#2563EB" />
        <circle cx="588" cy="200" r="5" fill="#FFFFFF" />
        <circle cx="608" cy="200" r="5" fill="#FFFFFF" />
        <circle cx="628" cy="200" r="5" fill="#FFFFFF" />
      </g>

      {/* ---------- certificate card (right) ---------- */}
      <g filter="url(#cardShadow)">
        <rect x="572" y="300" width="132" height="98" rx="12" fill="#FFFFFF" />
        <rect x="588" y="318" width="100" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="588" y="334" width="72" height="7" rx="3.5" fill="#DCE4F2" />
        <rect x="588" y="350" width="86" height="7" rx="3.5" fill="#EDF1F8" />
        {/* medal badge */}
        <circle cx="668" cy="372" r="14" fill="#F9B233" />
        <circle cx="668" cy="372" r="8.5" fill="#FFD46A" />
        <path d="M661 383 l-5 14 12 -7 12 7 -5 -14" fill="#F0483E" />
      </g>

      {/* ---------- book stack ---------- */}
      <g>
        {/* soft ground shadow */}
        <ellipse cx="420" cy="566" rx="200" ry="16" fill="#E5EAF4" />

        {/* bottom book — blue */}
        <g>
          <rect x="252" y="494" width="344" height="62" rx="14" fill="#2D5BCE" />
          <rect x="252" y="494" width="344" height="14" rx="7" fill="#3E6DE0" />
          <rect x="560" y="504" width="24" height="42" rx="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="300" y="540" width="18" height="16" fill="#FFFFFF" opacity="0.35" />
        </g>

        {/* middle book — green */}
        <g>
          <rect x="278" y="434" width="300" height="60" rx="13" fill="#44C76D" />
          <rect x="278" y="434" width="300" height="13" rx="6.5" fill="#5AD581" />
          <rect x="546" y="444" width="22" height="40" rx="4" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* top book — yellow */}
        <g>
          <rect x="268" y="376" width="290" height="58" rx="13" fill="#F8B400" />
          <rect x="268" y="376" width="290" height="12" rx="6" fill="#FFC637" />
          <rect x="528" y="386" width="20" height="38" rx="4" fill="#FFFFFF" opacity="0.9" />
          {/* bookmark */}
          <path d="M330 376 h20 v-20 l-10 7 -10 -7 z" fill="#2563EB" />
        </g>
      </g>

      {/* ---------- student character ---------- */}
      <g>
        {/* back arm (behind torso, reaching to laptop) */}
        <path
          d="M395 268 q-40 22 -68 52 l-16 -14 q30 -36 70 -54 z"
          fill="#2E63E8"
        />

        {/* legs — navy pants, bent over the front of the stack */}
        <path
          d="M360 340 q-52 4 -70 26 q-14 18 -12 52 l-26 44 22 12 30 -46 q4 -30 20 -40 q22 -12 48 -14 z"
          fill="#1E2A4A"
        />
        <path
          d="M366 352 q-58 8 -74 34 q-10 18 -6 44 l-14 52 24 6 18 -52 q0 -22 14 -32 q20 -14 50 -16 z"
          fill="#27355C"
        />

        {/* shoes */}
        <path d="M252 462 l-26 40 q-4 8 4 12 l14 6 q8 2 12 -6 l22 -40 z" fill="#2563EB" />
        <path d="M268 486 l-14 50 q-2 10 8 11 l16 1 q8 0 8 -9 l8 -48 z" fill="#2E6BF0" />

        {/* torso — blue shirt */}
        <path
          d="M368 244 q34 -8 50 14 q14 20 12 52 q-2 26 -14 40 q-26 10 -56 -6 q-8 -30 -4 -62 q4 -28 12 -38 z"
          fill="#2E63E8"
        />

        {/* head */}
        <circle cx="392" cy="208" r="30" fill="#F2B98F" />
        {/* hair */}
        <path
          d="M362 202 q-2 -32 30 -34 q26 -2 32 22 q2 8 -2 12 q-2 -12 -12 -14 q-4 8 -16 8 q-16 0 -20 10 q-4 8 -4 14 q-8 -6 -8 -18 z"
          fill="#20242B"
        />
        {/* ear */}
        <circle cx="404" cy="212" r="5" fill="#E8A97E" />
        {/* smile */}
        <path d="M370 218 q4 5 10 4" stroke="#C77E52" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* eye */}
        <circle cx="372" cy="205" r="2.6" fill="#20242B" />
        {/* neck */}
        <path d="M382 232 q8 8 18 6 l-2 14 q-10 4 -18 -2 z" fill="#E8A97E" />

        {/* front arm to laptop */}
        <path
          d="M406 268 q-16 34 -60 56 l-18 -10 q40 -26 56 -56 z"
          fill="#3B71F5"
        />
        {/* hands */}
        <circle cx="330" cy="322" r="8" fill="#F2B98F" />
        <circle cx="312" cy="316" r="8" fill="#F2B98F" />

        {/* laptop */}
        <g>
          <path d="M266 306 l56 -32 q6 -3 10 2 l4 6 -60 36 q-6 3 -10 -2 z" fill="#BEC5D6" />
          <path d="M272 308 l50 -29 6 8 -50 30 z" fill="#D9DDE7" />
          <path d="M258 318 l72 -2 q8 0 8 8 l-2 4 q-2 6 -10 6 l-66 -4 q-8 -2 -6 -8 z" fill="#D9DDE7" />
          <path d="M258 318 l72 -2 q8 0 8 8 l-80 0 z" fill="#BEC5D6" />
        </g>
      </g>

      {/* ---------- plant (bottom right) ---------- */}
      <g>
        <path d="M652 512 q-2 -34 16 -52 q4 22 -6 52 z" fill="#3FA95C" />
        <path d="M668 512 q0 -40 26 -58 q6 26 -14 58 z" fill="#4ECB8D" />
        <path d="M682 512 q10 -26 34 -32 q-4 24 -24 32 z" fill="#3FA95C" />
        <path d="M646 512 h56 l-8 44 q-1 8 -9 8 h-22 q-8 0 -9 -8 z" fill="#1E2A4A" />
        <rect x="642" y="508" width="64" height="10" rx="5" fill="#27355C" />
      </g>

      <defs>
        <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1B2B4B" floodOpacity="0.12" />
        </filter>
        <radialGradient id="bulbShine" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#FFE28A" />
          <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
