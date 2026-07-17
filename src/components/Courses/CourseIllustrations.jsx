// Reusable card illustrations for course cards.
// One component per imageType, all sharing the 300x150 canvas and pastel style.

function Pot({ x, y, scale = 1, leaf = '#44C76D' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M8 22 Q0 10 10 2 Q14 12 12 22 Z" fill={leaf} />
      <path d="M16 22 Q26 12 20 0 Q12 10 14 22 Z" fill="#2FA95C" />
      <path d="M4 22 h18 l-2.5 12 h-13 Z" fill="#E8955C" />
    </g>
  )
}

function LaptopBase({ x, y, w = 120 }) {
  return (
    <g>
      <rect x={x - 8} y={y} width={w + 16} height="7" rx="3.5" fill="#C7D2E5" />
      <rect x={x + w / 2 - 14} y={y} width="28" height="4" rx="2" fill="#ABB9D2" />
    </g>
  )
}

export function DevelopmentIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Code editor on laptop">
      <rect width="300" height="150" fill="#E4E9FF" />
      <Pot x={70} y={78} />
      <rect x="105" y="32" width="120" height="78" rx="6" fill="#33415C" />
      <rect x="111" y="38" width="108" height="66" rx="4" fill="#1B2B4B" />
      <path d="M138 60 l-10 10 10 10" stroke="#5A8DEE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M192 60 l10 10 -10 10" stroke="#5A8DEE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M172 54 l-14 34" stroke="#F9B233" strokeWidth="5" strokeLinecap="round" />
      <LaptopBase x={105} y={110} />
      <rect x="238" y="52" width="34" height="44" rx="5" fill="#FFFFFF" />
      <rect x="244" y="60" width="22" height="4" rx="2" fill="#5A8DEE" />
      <rect x="244" y="68" width="16" height="4" rx="2" fill="#DCE4F2" />
      <rect x="244" y="76" width="20" height="4" rx="2" fill="#DCE4F2" />
      <circle cx="251" cy="88" r="4" fill="#44C76D" />
    </svg>
  )
}

export function DataScienceIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Analytics dashboard with charts">
      <rect width="300" height="150" fill="#DCF3E4" />
      <rect x="60" y="28" width="128" height="86" rx="8" fill="#FFFFFF" />
      <rect x="74" y="82" width="13" height="20" rx="3" fill="#2563EB" />
      <rect x="93" y="66" width="13" height="36" rx="3" fill="#44C76D" />
      <rect x="112" y="74" width="13" height="28" rx="3" fill="#F9B233" />
      <rect x="131" y="52" width="13" height="50" rx="3" fill="#2563EB" />
      <path d="M74 56 L96 44 L118 50 L144 34" stroke="#8FA8DD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="222" cy="62" r="26" fill="#2563EB" />
      <path d="M222 62 L222 36 A26 26 0 0 1 246 74 Z" fill="#44C76D" />
      <path d="M222 62 L246 74 A26 26 0 0 1 210 85 Z" fill="#F9B233" />
      <rect x="200" y="98" width="44" height="6" rx="3" fill="#B9E4C7" />
      <rect x="207" y="110" width="30" height="6" rx="3" fill="#B9E4C7" />
    </svg>
  )
}

export function DesignIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mobile app design mockup">
      <rect width="300" height="150" fill="#FCEBB9" />
      <rect x="118" y="20" width="64" height="110" rx="10" fill="#33415C" />
      <rect x="123" y="27" width="54" height="96" rx="6" fill="#FFFFFF" />
      <rect x="129" y="34" width="42" height="26" rx="4" fill="#5A8DEE" />
      <rect x="129" y="66" width="26" height="5" rx="2.5" fill="#33415C" />
      <rect x="129" y="76" width="42" height="4" rx="2" fill="#DCE4F2" />
      <rect x="129" y="84" width="36" height="4" rx="2" fill="#DCE4F2" />
      <rect x="129" y="96" width="20" height="18" rx="4" fill="#F9B233" />
      <rect x="153" y="96" width="18" height="18" rx="4" fill="#44C76D" />
      <g transform="translate(206 42)">
        <circle cx="18" cy="18" r="18" fill="#FFFFFF" />
        <circle cx="18" cy="18" r="10" fill="#F97316" />
        <circle cx="18" cy="18" r="4" fill="#FFFFFF" />
      </g>
      <g transform="translate(58 48)">
        <rect width="40" height="40" rx="8" fill="#FFFFFF" />
        <path d="M10 26 L20 12 L30 26 Z" fill="#8B5CF6" />
        <circle cx="27" cy="13" r="4" fill="#F9B233" />
      </g>
      <circle cx="228" cy="106" r="5" fill="#F97316" opacity="0.6" />
      <circle cx="80" cy="112" r="4" fill="#8B5CF6" opacity="0.5" />
    </svg>
  )
}

export function MarketingIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Megaphone with social engagement">
      <rect width="300" height="150" fill="#E4E9FF" />
      <rect x="96" y="34" width="120" height="76" rx="6" fill="#33415C" />
      <rect x="102" y="40" width="108" height="64" rx="4" fill="#FFFFFF" />
      <g transform="translate(120 52) rotate(-12)">
        <path d="M0 18 L34 4 V40 L0 26 Z" fill="#F97316" />
        <rect x="-14" y="16" width="16" height="12" rx="4" fill="#F9B233" />
        <path d="M6 28 l4 14 h8 l-5 -16" fill="#E8760C" />
      </g>
      <path d="M172 58 q10 -12 20 0" stroke="#5A8DEE" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M176 68 q8 -9 15 0" stroke="#44C76D" strokeWidth="3" strokeLinecap="round" fill="none" />
      <LaptopBase x={96} y={110} />
      <g transform="translate(232 44)">
        <circle cx="14" cy="14" r="14" fill="#FFFFFF" />
        <path d="M14 20 C9 15.5 6 13 6 9.8 A4.4 4.4 0 0 1 14 7.6 A4.4 4.4 0 0 1 22 9.8 C22 13 19 15.5 14 20 Z" fill="#EC4899" />
      </g>
      <g transform="translate(48 66)">
        <circle cx="13" cy="13" r="13" fill="#FFFFFF" />
        <path d="M8 13 l3.5 3.5 L18.5 9" stroke="#44C76D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

export function BusinessIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Business growth dashboard">
      <rect width="300" height="150" fill="#FCEBB9" />
      <rect x="92" y="30" width="118" height="80" rx="6" fill="#33415C" />
      <rect x="98" y="36" width="106" height="68" rx="4" fill="#FFFFFF" />
      <rect x="108" y="80" width="12" height="16" rx="3" fill="#2563EB" />
      <rect x="126" y="68" width="12" height="28" rx="3" fill="#44C76D" />
      <rect x="144" y="74" width="12" height="22" rx="3" fill="#F9B233" />
      <rect x="162" y="58" width="12" height="38" rx="3" fill="#2563EB" />
      <path d="M108 58 L132 48 L156 54 L184 40" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M184 40 l-8 -1 m8 1 l-1 8" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <LaptopBase x={92} y={110} />
      <g transform="translate(224 48)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" />
        <path d="M16 8 v16 M11 12 h8 a3.5 3.5 0 0 1 0 7 h-6 a3.5 3.5 0 0 0 0 7 h9" stroke="#44C76D" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </g>
      <Pot x={52} y={80} scale={0.9} />
    </svg>
  )
}

export function PythonIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Python programming on laptop">
      <rect width="300" height="150" fill="#FBDDE7" />
      <rect x="92" y="30" width="118" height="80" rx="6" fill="#33415C" />
      <rect x="98" y="36" width="106" height="68" rx="4" fill="#1B2B4B" />
      <g transform="translate(128 46)">
        <path d="M23 2 C12 2 13 7 13 12 v6 h20 v3 H8 C3 21 0 26 0 34 c0 8 3 13 8 13 h6 v-8 c0 -6 5 -11 11 -11 h14 c5 0 9 -4 9 -9 V12 C48 6 44 2 38 2 Z" fill="#5A8DEE" />
        <path d="M23 66 c11 0 10 -5 10 -10 v-6 H13 v-3 h25 c5 0 8 -5 8 -13 c0 -8 -3 -13 -8 -13 h-6 v8 c0 6 -5 11 -11 11 H7 c-5 0 -9 4 -9 9 v7 c0 6 4 10 10 10 Z" fill="#F9B233" transform="translate(10 2)" />
        <circle cx="19" cy="9" r="2.6" fill="#FFFFFF" />
        <circle cx="38" cy="59" r="2.6" fill="#1B2B4B" />
      </g>
      <LaptopBase x={92} y={110} />
      <Pot x={230} y={72} />
      <rect x="46" y="52" width="34" height="42" rx="5" fill="#FFFFFF" />
      <rect x="52" y="60" width="22" height="4" rx="2" fill="#5A8DEE" />
      <rect x="52" y="68" width="16" height="4" rx="2" fill="#DCE4F2" />
      <rect x="52" y="76" width="20" height="4" rx="2" fill="#DCE4F2" />
    </svg>
  )
}

export function ReactIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="React development environment">
      <rect width="300" height="150" fill="#E4E9FF" />
      <rect x="60" y="34" width="104" height="72" rx="6" fill="#1B2B4B" />
      <circle cx="72" cy="44" r="2.5" fill="#F56565" />
      <circle cx="80" cy="44" r="2.5" fill="#F9B233" />
      <circle cx="88" cy="44" r="2.5" fill="#4ECB8D" />
      <rect x="70" y="54" width="40" height="4" rx="2" fill="#5A8DEE" />
      <rect x="70" y="63" width="56" height="4" rx="2" fill="#4ECB8D" />
      <rect x="78" y="72" width="42" height="4" rx="2" fill="#F9B233" />
      <rect x="70" y="81" width="50" height="4" rx="2" fill="#8FA8DD" />
      <rect x="78" y="90" width="34" height="4" rx="2" fill="#5A8DEE" />
      <g transform="translate(150 26)">
        <rect x="0" y="14" width="96" height="66" rx="6" fill="#FFFFFF" />
        <g transform="translate(48 47)">
          <circle r="6" fill="#5AC8E8" />
          <ellipse rx="26" ry="10.5" stroke="#5AC8E8" strokeWidth="3" fill="none" />
          <ellipse rx="26" ry="10.5" stroke="#5AC8E8" strokeWidth="3" fill="none" transform="rotate(60)" />
          <ellipse rx="26" ry="10.5" stroke="#5AC8E8" strokeWidth="3" fill="none" transform="rotate(120)" />
        </g>
      </g>
      <LaptopBase x={82} y={110} w={130} />
      <Pot x={252} y={76} scale={0.9} />
    </svg>
  )
}

export function AIIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Neural network diagram">
      <rect width="300" height="150" fill="#DCF3E4" />
      {/* connections */}
      <g stroke="#8FA8DD" strokeWidth="2">
        <path d="M84 46 L150 34 M84 46 L150 74 M84 75 L150 34 M84 75 L150 74 M84 75 L150 112 M84 104 L150 74 M84 104 L150 112" />
        <path d="M150 34 L216 55 M150 74 L216 55 M150 74 L216 93 M150 112 L216 93" />
      </g>
      {/* input layer */}
      <circle cx="84" cy="46" r="11" fill="#2563EB" />
      <circle cx="84" cy="75" r="11" fill="#2563EB" />
      <circle cx="84" cy="104" r="11" fill="#2563EB" />
      {/* hidden layer */}
      <circle cx="150" cy="34" r="11" fill="#44C76D" />
      <circle cx="150" cy="74" r="11" fill="#44C76D" />
      <circle cx="150" cy="112" r="11" fill="#44C76D" />
      {/* output layer */}
      <circle cx="216" cy="55" r="11" fill="#F9B233" />
      <circle cx="216" cy="93" r="11" fill="#F9B233" />
      <circle cx="252" cy="36" r="5" fill="#2563EB" opacity="0.4" />
      <circle cx="52" cy="118" r="5" fill="#44C76D" opacity="0.5" />
    </svg>
  )
}

export function ProductivityIllustration() {
  return (
    <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Clock and planner on desk">
      <rect width="300" height="150" fill="#E4E9FF" />
      <g transform="translate(120 24)">
        <circle cx="34" cy="34" r="34" fill="#FFFFFF" />
        <circle cx="34" cy="34" r="27" fill="#F5F7FB" />
        <circle cx="34" cy="34" r="3.5" fill="#1B2B4B" />
        <path d="M34 34 V16" stroke="#1B2B4B" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 34 L48 42" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
        <rect x="28" y="-8" width="12" height="7" rx="2.5" fill="#2563EB" />
      </g>
      <g transform="translate(48 58)">
        <rect width="52" height="52" rx="7" fill="#FFFFFF" />
        <rect x="8" y="10" width="10" height="10" rx="3" fill="#44C76D" />
        <rect x="24" y="13" width="20" height="4" rx="2" fill="#DCE4F2" />
        <rect x="8" y="28" width="10" height="10" rx="3" fill="#F9B233" />
        <rect x="24" y="31" width="20" height="4" rx="2" fill="#DCE4F2" />
      </g>
      <Pot x={222} y={70} />
      <rect x="96" y="112" width="120" height="7" rx="3.5" fill="#C7D2E5" />
      <circle cx="242" cy="42" r="5" fill="#F9B233" opacity="0.6" />
    </svg>
  )
}

const ILLUSTRATIONS = {
  development: DevelopmentIllustration,
  datascience: DataScienceIllustration,
  design: DesignIllustration,
  marketing: MarketingIllustration,
  business: BusinessIllustration,
  python: PythonIllustration,
  react: ReactIllustration,
  ai: AIIllustration,
  productivity: ProductivityIllustration,
}

export default function CourseIllustration({ type }) {
  const Comp = ILLUSTRATIONS[type] || DevelopmentIllustration
  return <Comp />
}
