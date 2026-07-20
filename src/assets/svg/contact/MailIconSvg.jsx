// Envelope icon for contact cards.
export default function MailIconSvg({ size = 26, color = '#2563EB' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill={color} />
      <path
        d="M4 7.2l7.1 5.3c.55.4 1.25.4 1.8 0L20 7.2"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
