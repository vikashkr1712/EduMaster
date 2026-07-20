// Location pin icon for the "Visit Us" contact card.
export default function VisitPinIconSvg({ size = 26, color = '#8B5CF6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C7.9 2 4.5 5.4 4.5 9.5c0 5.6 7.5 12.5 7.5 12.5s7.5-6.9 7.5-12.5C19.5 5.4 16.1 2 12 2z"
        fill={color}
      />
      <circle cx="12" cy="9.5" r="3" fill="#FFFFFF" />
    </svg>
  )
}
