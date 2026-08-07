// Single source of truth for the dashboard menu.
// Used by the sidebar, tablet drawer and (later) the profile dropdown so they stay in sync.

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ProfileIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
  </svg>
)

const CoursesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <rect x="5.5" y="3.5" width="14" height="17" rx="2" />
    <path d="M3.5 6.5v14a2 2 0 0 0 2 2h11" />
  </svg>
)

const CertificatesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
    <circle cx="12" cy="10" r="2.4" />
    <path d="M10.3 12.2 9 17.5l3-1.6 3 1.6-1.3-5.3" />
  </svg>
)

const WishlistIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z" />
  </svg>
)

const OrdersIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <rect x="5" y="4.5" width="14" height="17" rx="2" />
    <path d="M9.5 4.5v-1h5v2.5h-5v-1.5M9 11h6M9 15h6" />
  </svg>
)

const PaymentsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M3.5 9.5h17M7 15h4" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51.87Z" />
  </svg>
)

const HelpIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.7c0 1.6-2.5 2-2.5 3.4" />
    <circle cx="12" cy="16.6" r="0.4" fill="currentColor" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="M14 4.5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7" />
    <path d="M16 8.5l3.5 3.5-3.5 3.5M19.5 12H9.5" />
  </svg>
)

export const DASHBOARD_MENU = [
  { label: 'My Profile', to: '/profile', icon: ProfileIcon },
  { label: 'My Courses', to: '/profile/courses', icon: CoursesIcon },
  { label: 'My Certificates', to: '/profile/certificates', icon: CertificatesIcon },
  { label: 'My Wishlist', to: '/profile/wishlist', icon: WishlistIcon },
  { label: 'Order History', to: '/profile/orders', icon: OrdersIcon },
  { label: 'Payment Methods', to: '/profile/payments', icon: PaymentsIcon },
  { label: 'Settings', to: '/profile/settings', icon: SettingsIcon },
  { label: 'Help & Support', to: '/profile/help', icon: HelpIcon },
]

export { LogoutIcon }
