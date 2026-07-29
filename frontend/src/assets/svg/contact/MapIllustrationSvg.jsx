// Stylized street map for the "Our Location" section — pure JSX SVG.
import LocationMarkerSvg from './LocationMarkerSvg.jsx'

function StreetLabel({ x, y, rotate = 0, children }) {
  return (
    <text
      x={x}
      y={y}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      fontFamily="Poppins, sans-serif"
      fontSize="11"
      fill="#8A97AB"
    >
      {children}
    </text>
  )
}

function PlaceLabel({ x, y, children }) {
  return (
    <text x={x} y={y} fontFamily="Poppins, sans-serif" fontSize="11.5" fontWeight="500" fill="#5A6B87">
      {children}
    </text>
  )
}

export default function MapIllustrationSvg() {
  return (
    <svg
      viewBox="0 0 860 260"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Map showing the EduMaster Learning Center location"
      className="svg-contact-map"
    >
      <rect width="860" height="260" fill="#E9EDF3" />

      {/* park areas */}
      <path d="M250 18l120-10 30 60-90 30-70-40z" fill="#CDEBD2" />
      <path d="M690 190l110-24 40 70-120 24z" fill="#CDEBD2" />
      <path d="M60 210l80-16 24 50-90 16z" fill="#CDEBD2" />

      {/* streets — horizontal */}
      <path d="M-10 90 L 870 60" stroke="#FFFFFF" strokeWidth="14" />
      <path d="M-10 170 L 870 140" stroke="#FFFFFF" strokeWidth="18" />
      <path d="M-10 240 L 870 230" stroke="#FFFFFF" strokeWidth="12" />
      {/* streets — vertical / diagonal */}
      <path d="M150 -10 L 190 270" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M420 -10 L 450 270" stroke="#FFFFFF" strokeWidth="14" />
      <path d="M640 -10 L 610 270" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M760 -10 L 800 270" stroke="#FFFFFF" strokeWidth="10" />
      {/* minor dashed lane */}
      <path d="M280 -10 L 300 270" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="14 10" />

      {/* street labels */}
      <StreetLabel x={210} y={158} rotate={-2}>Education St</StreetLabel>
      <StreetLabel x={520} y={148} rotate={-2}>Learning Ave</StreetLabel>
      <StreetLabel x={70} y={84} rotate={-2}>Laomidag Bvd</StreetLabel>
      <StreetLabel x={160} y={120} rotate={82}>Scholars Rd</StreetLabel>
      <StreetLabel x={432} y={60} rotate={86}>Campus Rd</StreetLabel>
      <StreetLabel x={200} y={252} rotate={-1}>Educating Ave</StreetLabel>

      {/* places */}
      <PlaceLabel x={292} y={44}>Central Park</PlaceLabel>
      <PlaceLabel x={236} y={196}>City Library</PlaceLabel>
      <PlaceLabel x={40} y={200}>Knowledge Hub</PlaceLabel>
      <PlaceLabel x={560} y={40}>Innovation House</PlaceLabel>
      <PlaceLabel x={648} y={110}>Future Tower</PlaceLabel>
      <PlaceLabel x={560} y={180}>Tech Park</PlaceLabel>
      <PlaceLabel x={742} y={214}>Green Garden</PlaceLabel>

      {/* small POI dots */}
      <circle cx="552" cy="174" r="4" fill="#22C55E" />
      <circle cx="330" cy="52" r="4" fill="#22C55E" />

      {/* location pin + label */}
      <g>
        <LocationMarkerSvg x={412} y={92} scale={1.15} color="#2563EB" />
        <text x={448} y={112} fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="700" fill="#1B2B4B">
          EduMaster
        </text>
        <text x={448} y={130} fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="500" fill="#5A6B87">
          Learning Center
        </text>
      </g>
    </svg>
  )
}
