// Phone-in-talk icon for contact cards.
export default function PhoneIconSvg({ size = 26, color = '#22C55E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.4 3.5c.6-.6 1.6-.6 2.2 0l2 2c.6.6.6 1.6 0 2.2l-1 1c.9 2 2.7 3.8 4.7 4.7l1-1c.6-.6 1.6-.6 2.2 0l2 2c.6.6.6 1.6 0 2.2l-1.1 1.1c-.9.9-2.2 1.3-3.4.9-5.3-1.8-9.5-6-11.3-11.3-.4-1.2 0-2.5.9-3.4l.8-.4z"
        fill={color}
      />
      <path
        d="M14.5 5.5c2.2.5 3.9 2.2 4.4 4.4M14.8 2.5c3.6.7 6.4 3.5 7.1 7.1"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
