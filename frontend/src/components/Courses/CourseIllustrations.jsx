import { useId } from 'react'

// Eight reusable, self-contained SVG scenes for course-card thumbnails.
// The generated ids keep gradients isolated when many cards render together.
function useSvgId(prefix) {
  return `${prefix}-${useId().replace(/:/g, '')}`
}

function ArtworkSvg({ label, children }) {
  return (
    <svg
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  )
}

export function BusinessIllustration() {
  const id = useSvgId('business')
  return (
    <ArtworkSvg label="Business growth dashboard on a laptop">
      <defs>
        <linearGradient id={`${id}-bg`} x1="20" y1="5" x2="296" y2="155" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE7A3" />
          <stop offset="1" stopColor="#FFBD58" />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="108" y1="43" x2="210" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#FFF1D2" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <circle cx="281" cy="20" r="48" fill="#FFF4C8" opacity=".42" />
      <circle cx="35" cy="142" r="56" fill="#F6A934" opacity=".24" />
      <ellipse cx="163" cy="139" rx="112" ry="9" fill="#A96823" opacity=".18" />
      <path d="M45 123c-3-17 0-31 8-44 10 12 13 26 8 44" fill="#53A953" />
      <path d="M55 124c2-20 10-34 24-43 3 18-3 33-16 44" fill="#2E8B57" />
      <path d="M34 124c0-14-5-25-14-34-5 15 0 27 10 36" fill="#7FBE5C" />
      <path d="M27 120h43l-5 20H32z" fill="#C9824E" />
      <rect x="91" y="25" width="143" height="100" rx="10" fill="#263247" />
      <rect x="99" y="34" width="127" height="82" rx="5" fill={`url(#${id}-screen)`} />
      <circle cx="109" cy="43" r="3" fill="#FF7A59" />
      <circle cx="119" cy="43" r="3" fill="#F9C74F" />
      <circle cx="129" cy="43" r="3" fill="#55B88A" />
      <rect x="110" y="53" width="50" height="5" rx="2.5" fill="#E8D3AE" />
      <rect x="110" y="88" width="13" height="18" rx="3" fill="#2F67D8" />
      <rect x="130" y="77" width="13" height="29" rx="3" fill="#35A768" />
      <rect x="150" y="84" width="13" height="22" rx="3" fill="#F5A524" />
      <rect x="170" y="66" width="13" height="40" rx="3" fill="#F97316" />
      <rect x="190" y="55" width="13" height="51" rx="3" fill="#2463C7" />
      <path d="M111 78l26-14 21 6 33-20" fill="none" stroke="#F26922" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M181 48l11 2-2 11" fill="none" stroke="#F26922" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 125h165l-12 11H93z" fill="#BBC3CC" />
      <path d="M139 125h46l-5 5h-36z" fill="#939EAA" />
      <circle cx="263" cy="86" r="25" fill="#FFF9E9" />
      <path d="M269 73h-18m0 8h20m-20-8c14 0 14 15 0 15l19 17" fill="none" stroke="#E58A18" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </ArtworkSvg>
  )
}

export function DevelopmentIllustration() {
  const id = useSvgId('development')
  return (
    <ArtworkSvg label="Code editor on a laptop in a dark workspace">
      <defs>
        <linearGradient id={`${id}-bg`} x1="24" y1="0" x2="296" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#03142E" />
          <stop offset="1" stopColor="#0A3971" />
        </linearGradient>
        <linearGradient id={`${id}-desk`} x1="0" y1="125" x2="320" y2="151" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A3260" />
          <stop offset="1" stopColor="#061B38" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <circle cx="160" cy="70" r="78" fill="#0F4E8B" opacity=".22" />
      <rect y="125" width="320" height="35" fill={`url(#${id}-desk)`} />
      <ellipse cx="163" cy="143" rx="104" ry="7" fill="#020A17" opacity=".55" />
      <path d="M34 126c-7-18-6-34 2-49 11 13 15 29 9 49" fill="#3D8E1B" />
      <path d="M42 127c1-23 8-42 20-55 7 21 2 40-12 56" fill="#58AF24" />
      <path d="M29 126c-1-13-8-25-19-34 0 17 6 29 16 36" fill="#72C336" />
      <path d="M20 124h40l-4 20H24z" fill="#D9D4CD" />
      <rect x="77" y="23" width="169" height="109" rx="10" fill="#070A0F" stroke="#8F9AA9" strokeWidth="2" />
      <rect x="87" y="33" width="149" height="89" rx="5" fill="#061B38" />
      <rect x="96" y="43" width="48" height="6" rx="3" fill="#163D69" />
      <circle cx="100" cy="46" r="2" fill="#FF6B6B" />
      <circle cx="108" cy="46" r="2" fill="#FDCB6E" />
      <circle cx="116" cy="46" r="2" fill="#49D6A0" />
      <path d="M137 65l-21 15 21 15M187 65l21 15-21 15M174 58l-24 47" fill="none" stroke="#A8E6FF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="95" y="108" width="36" height="4" rx="2" fill="#17518E" />
      <rect x="193" y="108" width="34" height="4" rx="2" fill="#17518E" />
      <path d="M66 132h191l-14 12H80z" fill="#7D8793" />
      <path d="M137 132h51l-6 6h-39z" fill="#56616D" />
      <path d="M265 95v34m-13-19h26" stroke="#203C5F" strokeWidth="3" strokeLinecap="round" />
      <path d="M253 130h25l-3 13h-19z" fill="#111923" />
    </ArtworkSvg>
  )
}

export function DataScienceIllustration() {
  const id = useSvgId('data-science')
  return (
    <ArtworkSvg label="Purple analytics dashboard with rising charts">
      <defs>
        <linearGradient id={`${id}-bg`} x1="20" y1="4" x2="302" y2="153" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D0C55" />
          <stop offset=".55" stopColor="#352080" />
          <stop offset="1" stopColor="#160944" />
        </linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8A00" />
          <stop offset="1" stopColor="#FFD74A" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <circle cx="68" cy="130" r="48" fill="#6836E8" opacity=".16" />
      <circle cx="283" cy="21" r="50" fill="#6C3BF0" opacity=".1" />
      <rect x="38" y="24" width="191" height="116" rx="12" fill="#3A2088" stroke="#5132A9" strokeWidth="2" />
      <circle cx="52" cy="37" r="3" fill="#7958D4" />
      <circle cx="62" cy="37" r="3" fill="#7958D4" />
      <circle cx="72" cy="37" r="3" fill="#7958D4" />
      <path d="M54 123V54M54 123h157" stroke="#603FB3" strokeWidth="2" />
      <g stroke="#51339C" strokeWidth="1" opacity=".65">
        <path d="M54 101h157M54 79h157M54 57h157" />
        <path d="M86 54v69M119 54v69M152 54v69M185 54v69" />
      </g>
      <rect x="68" y="101" width="14" height="22" rx="3" fill={`url(#${id}-bar)`} />
      <rect x="93" y="88" width="14" height="35" rx="3" fill={`url(#${id}-bar)`} />
      <rect x="118" y="78" width="14" height="45" rx="3" fill={`url(#${id}-bar)`} />
      <rect x="143" y="83" width="14" height="40" rx="3" fill={`url(#${id}-bar)`} />
      <rect x="168" y="68" width="14" height="55" rx="3" fill={`url(#${id}-bar)`} />
      <rect x="193" y="54" width="14" height="69" rx="3" fill="#FF7900" />
      <path d="M68 92l27-24 24 11 27-28 27 13 35-35" fill="none" stroke="#8052F5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M196 31l13-3-3 13" fill="none" stroke="#8052F5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="239" y="40" width="61" height="94" rx="10" fill="#321B77" stroke="#5132A9" strokeWidth="2" />
      <circle cx="270" cy="75" r="22" fill="none" stroke="#FFB21A" strokeWidth="10" />
      <path d="M270 53a22 22 0 0120 13" fill="none" stroke="#FF7900" strokeWidth="10" />
      <path d="M248 75a22 22 0 0011 19" fill="none" stroke="#7652F5" strokeWidth="10" />
      <rect x="251" y="109" width="38" height="5" rx="2.5" fill="#5937B2" />
      <rect x="251" y="119" width="25" height="5" rx="2.5" fill="#5937B2" />
    </ArtworkSvg>
  )
}

export function DesignIllustration() {
  const id = useSvgId('design')
  return (
    <ArtworkSvg label="Green UI and UX design workspace">
      <defs>
        <linearGradient id={`${id}-bg`} x1="10" y1="0" x2="306" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#269D7B" />
          <stop offset="1" stopColor="#087059" />
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="99" y1="41" x2="221" y2="119" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF5" />
          <stop offset="1" stopColor="#E5F6EB" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <rect y="127" width="320" height="33" fill="#08654F" />
      <ellipse cx="162" cy="145" rx="109" ry="7" fill="#013F33" opacity=".45" />
      <rect x="74" y="22" width="174" height="112" rx="12" fill="#062F2B" stroke="#A5D5C0" strokeWidth="2" />
      <rect x="83" y="32" width="156" height="92" rx="5" fill={`url(#${id}-panel)`} />
      <rect x="83" y="32" width="156" height="17" rx="5" fill="#14936D" />
      <circle cx="94" cy="40.5" r="3" fill="#A1E5C9" />
      <circle cx="104" cy="40.5" r="3" fill="#A1E5C9" />
      <circle cx="114" cy="40.5" r="3" fill="#A1E5C9" />
      <rect x="96" y="61" width="52" height="48" rx="6" fill="#7CD4AE" />
      <path d="M101 101l15-17 10 9 12-15 10 23z" fill="#168866" />
      <circle cx="112" cy="75" r="6" fill="#FFF7DC" />
      <rect x="160" y="61" width="62" height="7" rx="3.5" fill="#7ACDAA" />
      <rect x="160" y="75" width="50" height="6" rx="3" fill="#A9DFC8" />
      <rect x="160" y="88" width="62" height="6" rx="3" fill="#A9DFC8" />
      <rect x="160" y="102" width="31" height="7" rx="3.5" fill="#43B98B" />
      <path d="M64 134h194l-14 11H79z" fill="#A6B9B5" />
      <path d="M139 134h48l-5 5h-38z" fill="#7F9691" />
      <rect x="19" y="36" width="43" height="43" rx="8" fill="#075B4B" opacity=".9" />
      <rect x="27" y="44" width="27" height="27" rx="4" fill="none" stroke="#BCEBD5" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="27" cy="44" r="3" fill="#E0F8EB" />
      <circle cx="54" cy="44" r="3" fill="#E0F8EB" />
      <circle cx="27" cy="71" r="3" fill="#E0F8EB" />
      <circle cx="54" cy="71" r="3" fill="#E0F8EB" />
      <rect x="261" y="29" width="42" height="45" rx="8" fill="#075B4B" />
      <path d="M282 39l-9 20 9 7 9-7z" fill="#61C49B" />
      <circle cx="282" cy="52" r="3" fill="#083D35" />
      <path d="M282 39v13" stroke="#083D35" strokeWidth="2" />
      <path d="M271 82h12v12h-12zM287 82h12v12h-12z" fill="#45B68B" />
    </ArtworkSvg>
  )
}

export function MarketingIllustration() {
  const id = useSvgId('marketing')
  return (
    <ArtworkSvg label="Purple megaphone with social media engagement icons">
      <defs>
        <linearGradient id={`${id}-bg`} x1="8" y1="8" x2="310" y2="151" gradientUnits="userSpaceOnUse">
          <stop stopColor="#371078" />
          <stop offset=".55" stopColor="#5723A1" />
          <stop offset="1" stopColor="#2A0B65" />
        </linearGradient>
        <linearGradient id={`${id}-horn`} x1="39" y1="58" x2="153" y2="119" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B66AFF" />
          <stop offset="1" stopColor="#7135BD" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <circle cx="64" cy="77" r="67" fill="#8A42D8" opacity=".12" />
      <circle cx="272" cy="129" r="63" fill="#6B2DBD" opacity=".18" />
      <ellipse cx="120" cy="139" rx="82" ry="8" fill="#17063C" opacity=".35" />
      <path d="M68 84l73-39v76L68 93z" fill={`url(#${id}-horn)`} stroke="#C381FF" strokeWidth="3" />
      <ellipse cx="141" cy="83" rx="13" ry="38" fill="#A762E6" stroke="#D09AFF" strokeWidth="3" />
      <path d="M58 79h19v21H58c-7 0-12-5-12-11s5-10 12-10z" fill="#7135BD" />
      <path d="M71 98l12 37h18L87 94z" fill="#8B49D0" />
      <path d="M83 132h17l-4 8H79z" fill="#57259E" />
      <path d="M160 65l19-9M163 82h22M160 99l19 9" stroke="#BB73FF" strokeWidth="5" strokeLinecap="round" />
      <rect x="196" y="26" width="58" height="47" rx="10" fill="#351074" opacity=".92" />
      <rect x="206" y="53" width="8" height="11" rx="2" fill="#FFB31C" />
      <rect x="220" y="44" width="8" height="20" rx="2" fill="#9A54E8" />
      <rect x="234" y="35" width="8" height="29" rx="2" fill="#B86BFF" />
      <path d="M205 47l13-12 10 6 14-13" fill="none" stroke="#9347E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="202" y="91" width="55" height="43" rx="10" fill="#351074" />
      <circle cx="229" cy="112" r="13" fill="#FFB31C" />
      <circle cx="224" cy="109" r="2" fill="#45207E" />
      <circle cx="234" cy="109" r="2" fill="#45207E" />
      <path d="M222 116c5 5 10 5 14 0" fill="none" stroke="#45207E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="279" cy="55" r="18" fill="#EF5B29" />
      <path d="M279 66c-10-8-14-12-14-18a7 7 0 0114-2 7 7 0 0114 2c0 6-4 10-14 18z" fill="#FFF" />
      <circle cx="282" cy="112" r="18" fill="#3154D8" />
      <path d="M275 113h5v8h5v-8h5l-8-10z" fill="#FFF" />
    </ArtworkSvg>
  )
}

export function AiIllustration() {
  const id = useSvgId('ai')
  return (
    <ArtworkSvg label="Glowing artificial intelligence brain and circuitry">
      <defs>
        <radialGradient id={`${id}-bg`} cx="0" cy="0" r="1" gradientTransform="translate(160 80) rotate(90) scale(103 190)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#063C91" />
          <stop offset=".58" stopColor="#031E52" />
          <stop offset="1" stopColor="#010D26" />
        </radialGradient>
        <linearGradient id={`${id}-brain`} x1="97" y1="35" x2="220" y2="132" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CEBFF" />
          <stop offset="1" stopColor="#1678FF" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <g stroke="#1266D9" strokeWidth="1.5" opacity=".65">
        <path d="M0 38h48l15 14h27M0 60h57l13 10h19M0 86h65l14-10h16M0 113h52l16-14h24" />
        <path d="M320 38h-48l-15 14h-27M320 60h-57l-13 10h-19M320 86h-65l-14-10h-16M320 113h-52l-16-14h-24" />
      </g>
      <g fill="#18BFFF">
        <circle cx="48" cy="38" r="3" /><circle cx="57" cy="60" r="3" /><circle cx="65" cy="86" r="3" /><circle cx="52" cy="113" r="3" />
        <circle cx="272" cy="38" r="3" /><circle cx="263" cy="60" r="3" /><circle cx="255" cy="86" r="3" /><circle cx="268" cy="113" r="3" />
      </g>
      <path d="M159 36c-10-13-32-10-38 4-15-4-29 7-28 22-15 5-20 24-10 36-5 15 7 31 22 31 8 13 29 14 39 3 8 0 15-7 15-16z" fill="#07378C" stroke={`url(#${id}-brain)`} strokeWidth="5" strokeLinejoin="round" />
      <path d="M161 36c10-13 32-10 38 4 15-4 29 7 28 22 15 5 20 24 10 36 5 15-7 31-22 31-8 13-29 14-39 3-8 0-15-7-15-16z" fill="#07378C" stroke={`url(#${id}-brain)`} strokeWidth="5" strokeLinejoin="round" />
      <g fill="none" stroke="#43E6FF" strokeWidth="3.5" strokeLinecap="round">
        <path d="M145 52c-12-6-23 3-21 14-12 1-17 15-9 23-9 9-1 24 11 22 4 10 17 12 24 5M137 66c12 4 13 16 7 23M117 90c10-2 18 4 18 13" />
        <path d="M175 52c12-6 23 3 21 14 12 1 17 15 9 23 9 9 1 24-11 22-4 10-17 12-24 5M183 66c-12 4-13 16-7 23M203 90c-10-2-18 4-18 13" />
        <path d="M160 45v79" />
      </g>
      <circle cx="160" cy="80" r="20" fill="#0950C9" stroke="#5BF1FF" strokeWidth="3" />
      <path d="M149 91l8-23h6l8 23M153 82h14M177 69v22" fill="none" stroke="#E8FCFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="#1774EF" opacity=".75">
        <rect x="24" y="22" width="5" height="5" /><rect x="35" y="22" width="5" height="5" /><rect x="24" y="31" width="5" height="5" />
        <rect x="286" y="122" width="5" height="5" /><rect x="297" y="122" width="5" height="5" /><rect x="297" y="131" width="5" height="5" />
      </g>
    </ArtworkSvg>
  )
}

export function PersonalDevelopmentIllustration() {
  const id = useSvgId('personal-development')
  return (
    <ArtworkSvg label="Two people climbing steps together toward a success flag">
      <defs>
        <radialGradient id={`${id}-bg`} cx="0" cy="0" r="1" gradientTransform="translate(160 77) rotate(90) scale(103 190)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#48D6E1" />
          <stop offset=".58" stopColor="#1998C0" />
          <stop offset="1" stopColor="#08628F" />
        </radialGradient>
        <linearGradient id={`${id}-mountain`} x1="0" y1="92" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#167DA6" />
          <stop offset="1" stopColor="#075980" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <path d="M0 129l43-44 32 33 28-24 42 42 36-38 30 27 39-54 70 75H0z" fill={`url(#${id}-mountain)`} opacity=".63" />
      <path d="M0 143l47-28 34 20 37-19 36 28 53-31 38 21 40-20 35 20v26H0z" fill="#06547C" opacity=".7" />
      <g fill="#8BE1EA" opacity=".38">
        <path d="M25 39c7-14 28-10 30 4 10-4 20 2 21 12H18c0-8 3-13 7-16z" />
        <path d="M256 48c6-11 22-8 24 3 8-3 16 2 17 10h-47c0-6 2-11 6-13z" />
      </g>
      <path d="M61 143h54v-21h50v-22h49V79h48v81H61z" fill="#063B67" />
      <path d="M67 143h48M121 122h44M171 100h43M220 79h42" stroke="#0C4A78" strokeWidth="2" />
      <g fill="#062D58" stroke="#062D58" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="139" cy="78" r="8" />
        <path d="M132 89l15 2 12 12-7 6-10-10-3 20h-10l2-17-13 15-7-5 18-23z" strokeWidth="4" />
        <circle cx="204" cy="54" r="8" />
        <path d="M197 65l15 2 12 10-7 7-9-8-2 22h-10l2-18-13 15-7-5 18-25z" strokeWidth="4" />
        <path d="M151 102l34-24" fill="none" strokeWidth="5" />
      </g>
      <path d="M252 24v55" stroke="#06325C" strokeWidth="4" strokeLinecap="round" />
      <path d="M254 27c14-9 27 8 43-2l-5 18c-14 6-24-8-38 2z" fill="#FFB21A" />
      <circle cx="252" cy="24" r="4" fill="#06325C" />
    </ArtworkSvg>
  )
}

export function FinanceIllustration() {
  const id = useSvgId('finance')
  return (
    <ArtworkSvg label="Rupee coins and an upward finance chart">
      <defs>
        <linearGradient id={`${id}-bg`} x1="14" y1="3" x2="305" y2="157" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4510B" />
          <stop offset="1" stopColor="#D82F08" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF07A" />
          <stop offset=".48" stopColor="#FFB20D" />
          <stop offset="1" stopColor="#E67A00" />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${id}-bg)`} />
      <circle cx="49" cy="25" r="58" fill="#FF7A16" opacity=".18" />
      <circle cx="282" cy="137" r="72" fill="#B92108" opacity=".18" />
      <ellipse cx="145" cy="143" rx="110" ry="10" fill="#8E1E07" opacity=".3" />
      <path d="M170 87l34-31 24 16 48-45" fill="none" stroke="#FF8D05" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M263 26l15-2-2 15" fill="none" stroke="#FFB218" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="204" y="91" width="17" height="38" rx="3" fill="#FFD34B" />
      <rect x="232" y="75" width="17" height="54" rx="3" fill="#FFC12A" />
      <rect x="260" y="55" width="17" height="74" rx="3" fill="#FFAA10" />
      <path d="M194 130h96" stroke="#9F2A09" strokeWidth="5" strokeLinecap="round" />
      <g>
        <rect x="49" y="112" width="57" height="14" rx="7" fill="#D97700" />
        <ellipse cx="77.5" cy="112" rx="28.5" ry="10" fill={`url(#${id}-gold)`} stroke="#FFE266" strokeWidth="2" />
        <rect x="49" y="126" width="57" height="11" rx="5.5" fill="#E48600" />
        <ellipse cx="77.5" cy="126" rx="28.5" ry="9" fill={`url(#${id}-gold)`} stroke="#FFE266" strokeWidth="2" />
      </g>
      <g>
        <rect x="102" y="67" width="65" height="64" rx="12" fill="#D97700" />
        <ellipse cx="134.5" cy="67" rx="32.5" ry="12" fill={`url(#${id}-gold)`} stroke="#FFE873" strokeWidth="3" />
        <path d="M105 82c18 8 41 8 59 0M105 98c18 8 41 8 59 0M105 114c18 8 41 8 59 0" fill="none" stroke="#FFBB13" strokeWidth="4" />
      </g>
      <circle cx="160" cy="112" r="35" fill={`url(#${id}-gold)`} stroke="#FFE873" strokeWidth="4" />
      <circle cx="160" cy="112" r="27" fill="#F5A009" stroke="#D97800" strokeWidth="2" />
      <path d="M172 98h-27m0 10h29m-29-10c20 0 20 19 0 19l27 23" fill="none" stroke="#FFF4C4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </ArtworkSvg>
  )
}

const ILLUSTRATIONS = {
  business: BusinessIllustration,
  development: DevelopmentIllustration,
  dataScience: DataScienceIllustration,
  design: DesignIllustration,
  marketing: MarketingIllustration,
  ai: AiIllustration,
  personalDevelopment: PersonalDevelopmentIllustration,
  finance: FinanceIllustration,
}

const TYPE_ALIASES = {
  datascience: 'dataScience',
  data: 'dataScience',
  python: 'development',
  react: 'development',
  js: 'development',
  cloud: 'development',
  productivity: 'personalDevelopment',
  personal: 'personalDevelopment',
}

export default function CourseIllustration({ type = 'development' }) {
  const normalizedType = TYPE_ALIASES[type] || type
  const Illustration = ILLUSTRATIONS[normalizedType] || DevelopmentIllustration
  return <Illustration />
}
