const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const COURSE_ART = {
  code: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="13" rx="2" />
      <path d="m10 10-2 2 2 2M14 10l2 2-2 2" />
    </svg>
  ),
  python: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 4c-3 0-4 1.4-4 3v2.5h4V10H6.5C5 10 4 11 4 13.5S5 17 6.5 17H8v-2.5c0-1.7 1.3-2.5 3-2.5h2c1.7 0 3-.8 3-2.5V7c0-1.6-1-3-4-3Z" />
      <path d="M12 20c3 0 4-1.4 4-3v-2.5h-4V14h5.5c1.5 0 2.5-1 2.5-3.5" />
    </svg>
  ),
  chart: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 4v15.5h16" />
      <path d="M8.5 15.5v-4M12.5 15.5V8M16.5 15.5v-6.5" strokeWidth="2.2" />
    </svg>
  ),
  design: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9h17" />
      <rect x="6.5" y="12" width="5" height="4.5" rx="1" />
      <path d="M14.5 12.5h3.5M14.5 15.5h3.5" />
    </svg>
  ),
  megaphone: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l3.5 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M14 8.5a4.5 4.5 0 0 1 0 7M17 6a8 8 0 0 1 0 12" />
    </svg>
  ),
  cloud: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M7 18a4 4 0 0 1-.6-7.95 5.5 5.5 0 0 1 10.8 1.2A3.5 3.5 0 0 1 16.5 18Z" />
    </svg>
  ),
}

export const PAY_ICONS = {
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18M6.5 15h4" />
    </svg>
  ),
  upi: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="m13 3-7 11h5l-1 7 7-11h-5Z" />
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
      <rect x="4" y="8" width="17" height="11" rx="2" />
      <circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  bank: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="m3.5 9 8.5-5 8.5 5Z" />
      <path d="M5.5 9v8M10 9v8M14 9v8M18.5 9v8M3.5 20.5h17" />
    </svg>
  ),
}
