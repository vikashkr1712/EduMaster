// Small inline icons shared by the authentication pages —
// feature tiles, stat tiles, form fields and social buttons.

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6.5C10.4 5.2 8.3 4.7 5.6 4.7c-.9 0-1.6.7-1.6 1.6v10c0 .9.7 1.6 1.6 1.6 2.7 0 4.8.5 6.4 1.8 1.6-1.3 3.7-1.8 6.4-1.8.9 0 1.6-.7 1.6-1.6v-10c0-.9-.7-1.6-1.6-1.6-2.7 0-4.8.5-6.4 1.8Z"
        fill="currentColor"
      />
      <path d="M12 6.5v13.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9.4l3-1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="13" width="3.4" height="7" rx="1" fill="currentColor" />
      <rect x="10.3" y="9.5" width="3.4" height="10.5" rx="1" fill="currentColor" />
      <rect x="16.6" y="12" width="3.4" height="8" rx="1" fill="currentColor" />
      <path
        d="M5 8.5l5.5-3.4 3.4 2.2L19 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19 4.6h-2.6M19 4.6v2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8.2 3h7.6l-2 5h-3.6l-2-5Z" fill="currentColor" opacity="0.55" />
      <circle cx="12" cy="13.5" r="5.4" fill="currentColor" />
      <path
        d="M12 11l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3L12 11Z"
        fill="#fff"
      />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 4h10v5.2a5 5 0 0 1-10 0V4Z"
        fill="currentColor"
      />
      <path
        d="M7 5.5H4.8a.8.8 0 0 0-.8.8c0 2.2 1.3 3.7 3 4M17 5.5h2.2c.5 0 .8.4.8.8 0 2.2-1.3 3.7-3 4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M12 14.5v3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 20a3.5 2.2 0 0 1 7 0v.5h-7V20Z" fill="currentColor" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.4" r="2.7" fill="currentColor" />
      <circle cx="6.2" cy="9.6" r="2.1" fill="currentColor" opacity="0.65" />
      <circle cx="17.8" cy="9.6" r="2.1" fill="currentColor" opacity="0.65" />
      <path
        d="M7.4 18.6c.3-2.5 2.2-4.1 4.6-4.1s4.3 1.6 4.6 4.1c0 .5-.4.9-.9.9H8.3a.9.9 0 0 1-.9-.9Z"
        fill="currentColor"
      />
      <path
        d="M4.6 17.4H3.2a.8.8 0 0 1-.8-.9c.2-1.9 1.6-3.2 3.4-3.4M19.4 17.4h1.4c.5 0 .9-.4.8-.9-.2-1.9-1.6-3.2-3.4-3.4"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8.6" r="3" fill="currentColor" />
      <path
        d="M4.4 18.4c.4-3 2.7-4.9 5.6-4.9s5.2 1.9 5.6 4.9c.1.5-.4.9-.9.9H5.3c-.5 0-1-.4-.9-.9Z"
        fill="currentColor"
      />
      <circle cx="16.6" cy="9.2" r="2.3" fill="currentColor" opacity="0.55" />
      <path
        d="M17.4 13.7c1.9.4 3.2 1.8 3.5 3.9.1.5-.4.9-.9.9h-2.4"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}

function InstructorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" fill="currentColor" />
      <path
        d="M5.8 19c.4-3.1 2.9-5 6.2-5s5.8 1.9 6.2 5c.1.5-.4.9-.9.9H6.7c-.5 0-1-.4-.9-.9Z"
        fill="currentColor"
      />
      <path
        d="M17.3 3.4l.7 1.4 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2.7-1.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

const featureIcons = {
  book: BookIcon,
  chart: ChartIcon,
  medal: MedalIcon,
  trophy: TrophyIcon,
  people: PeopleIcon,
  students: StudentsIcon,
  instructor: InstructorIcon,
}

export function AuthTileIcon({ name }) {
  const Icon = featureIcons[name] || BookIcon
  return <Icon />
}

/* ---- form field icons ---- */

export function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.2" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.4 19.2c.6-3.2 3.2-5 6.6-5s6 1.8 6.6 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.2" y="5" width="17.6" height="14" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m4.5 7.5 7.5 5.6 7.5-5.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4.8" y="10.4" width="14.4" height="9.6" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 10.2V8a3.8 3.8 0 0 1 7.6 0v2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="15.2" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 4.5l15 15M10 6.2A9.8 9.8 0 0 1 12 6c5.8 0 9.2 6 9.2 6a17.1 17.1 0 0 1-2.9 3.5M13.9 13.9a2.9 2.9 0 0 1-4-4.1M7.2 7.4A15.6 15.6 0 0 0 2.8 12s3.4 6.2 9.2 6.2a8.9 8.9 0 0 0 3.6-.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CheckCircleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="m7.6 12.2 2.9 2.9 5.9-6"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LoginArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 8V6.5A2.5 2.5 0 0 1 12.5 4h5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 10 17.5V16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M3.5 12h10.3m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function UserPlusIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="9.8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M3.6 19.4c.5-3 3-4.8 6.2-4.8 1.5 0 2.9.4 4 1.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M18 13.6v5M15.5 16.1h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

/* ---- social provider icons ---- */

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.2-4 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8L20 3.2A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z"
      />
    </svg>
  )
}

export function MicrosoftIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24">
      <rect x="1.5" y="1.5" width="10" height="10" fill="#F25022" />
      <rect x="12.5" y="1.5" width="10" height="10" fill="#7FBA00" />
      <rect x="1.5" y="12.5" width="10" height="10" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}

export function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
      <path d="M16.6 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.1 1-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.7ZM14.2 5.6c.7-.8 1.1-1.9 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  )
}
