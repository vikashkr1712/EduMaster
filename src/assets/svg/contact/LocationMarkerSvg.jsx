// Map location pin — reusable, position/scale/color via props.
export default function LocationMarkerSvg({ x = 0, y = 0, scale = 1, color = '#2563EB' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z"
        fill={color}
      />
      <circle cx="14" cy="14" r="6" fill="#FFFFFF" />
    </g>
  )
}
