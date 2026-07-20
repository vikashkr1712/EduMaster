// Clock icon for the "Working Hours" contact card.
export default function ClockIconSvg({ size = 26, color = '#F9B233' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2.4" />
      <path d="M12 7.5V12l3.2 2.4" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
