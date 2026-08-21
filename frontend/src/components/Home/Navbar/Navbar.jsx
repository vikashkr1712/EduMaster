import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider.jsx'
import { LogoutIcon } from '../../Dashboard/dashboardMenu.jsx'
import { useLogoutConfirm } from '../../Dashboard/LogoutModal.jsx'
import { useAvatar } from '../../Profile/AvatarProvider.jsx'
import ProfileAvatar from '../../Profile/ProfileAvatar.jsx'
import NotificationDropdown from '../../Notifications/NotificationDropdown.jsx'
import { useCart } from '../../Cart/CartProvider.jsx'
import { useTheme } from '../../Theme/ThemeProvider.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import './Navbar.css'

function LogoMark({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" fill="none">
      {/* stacked layers graduation mark */}
      <path d="M23 6 L41 14 L23 22 L5 14 Z" fill="#1B2B4B" />
      <path d="M23 17 L37 23 L23 29 L9 23 Z" fill="#F9B233" />
      <path d="M23 26 L34 30.5 L23 35 L12 30.5 Z" fill="#2563EB" />
      <path d="M39 15 v9" stroke="#F9B233" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="39" cy="26" r="2.4" fill="#F9B233" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" />
      <path d="M10.3 20a2 2 0 0 0 3.4 0" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
    </svg>
  )
}

const navStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const HomeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <path d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-4v6H5.5a1 1 0 0 1-1-1Z" />
  </svg>
)
const CoursesNavIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <rect x="5.5" y="3.5" width="14" height="17" rx="2" />
    <path d="M3.5 6.5v14a2 2 0 0 0 2 2h11" />
  </svg>
)
const EventsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
)
const ServicesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <rect x="3.5" y="7" width="17" height="13" rx="2" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" />
  </svg>
)
const TestimonialsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2L12 16l-4.6 2.5.9-5.2-3.8-3.7 5.2-.7Z" />
  </svg>
)
const AboutIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.4" fill="currentColor" />
  </svg>
)
const ContactIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...navStroke}>
    <path d="M5 4.5h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z" />
  </svg>
)

const links = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Courses', to: '/courses', icon: CoursesNavIcon },
  { label: 'Events', to: '/events', icon: EventsIcon },
  { label: 'Services', to: '/services', icon: ServicesIcon },
  { label: 'Testimonials', to: '/testimonials', icon: TestimonialsIcon },
  { label: 'About Us', to: '/about', icon: AboutIcon },
  { label: 'Contact', to: '/contact', icon: ContactIcon },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const rootRef = useRef(null)
  const profileTriggerRef = useRef(null)
  const { isAuthenticated } = useAuth()
  const requestLogout = useLogoutConfirm()
  const { avatar, fallbackAvatar } = useAvatar()
  const { count: cartCount } = useCart()
  const { isDark, setTheme } = useTheme()
  const { pathname } = useLocation()

  // close everything when the route changes
  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
    setNotificationsOpen(false)
  }, [pathname])

  // outside click closes menu and dropdown
  useEffect(() => {
    if (!menuOpen && !profileOpen && !notificationsOpen) return
    const onOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setMenuOpen(false)
        setProfileOpen(false)
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [menuOpen, profileOpen, notificationsOpen])

  // escape closes menu and dropdown
  useEffect(() => {
    if (!menuOpen && !profileOpen && !notificationsOpen) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      setProfileOpen(false)
      setNotificationsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, profileOpen, notificationsOpen])

  // lock page scroll while the nav drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar" ref={rootRef}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <LogoMark />
          <span className="navbar-brand-text">
            <span className="navbar-brand-name">
              Edu<span>Master</span>
            </span>
            <span className="navbar-brand-tag">Learn. Grow. Succeed.</span>
          </span>
        </Link>

        <nav className="navbar-links">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
        <button
          type="button"
          className="navbar-theme-toggle"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className={`navbar-actions${isAuthenticated ? ' navbar-actions--authenticated' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="navbar-notifications">
                <button
                  type="button"
                  className="navbar-bell"
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  aria-haspopup="dialog"
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((value) => !value)
                    setProfileOpen(false)
                    setMenuOpen(false)
                  }}
                >
                  <BellIcon />
                  {unreadCount > 0 && <span className="navbar-notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                </button>
                <NotificationDropdown open={notificationsOpen} onClose={() => setNotificationsOpen(false)} onUnreadChange={setUnreadCount} />
              </div>
              <Link
                to="/cart"
                className="navbar-cart"
                aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span className="navbar-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </Link>
              <div className="navbar-profile">
                <button
                  type="button"
                  className="navbar-profile-trigger"
                  ref={profileTriggerRef}
                  aria-label="Profile menu"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                    const openAtStart = event.key === 'ArrowDown'
                    event.preventDefault()
                    setProfileOpen(true)
                    setMenuOpen(false)
                    setNotificationsOpen(false)
                    window.setTimeout(() => {
                      const items = [...(rootRef.current?.querySelectorAll('.profile-dropdown [data-menu-item]') || [])]
                      items[openAtStart ? 0 : items.length - 1]?.focus()
                    }, 50)
                  }}
                  onClick={() => {
                    setProfileOpen((v) => !v)
                    setMenuOpen(false)
                    setNotificationsOpen(false)
                  }}
                >
                  <span className="navbar-profile-avatar">
                    <ProfileAvatar src={avatar} defaultSrc={fallbackAvatar} />
                  </span>
                  <span className={`navbar-profile-chevron${profileOpen ? ' is-open' : ''}`}>
                    <ChevronIcon />
                  </span>
                </button>
                <ProfileDropdown
                  open={profileOpen}
                  onClose={() => setProfileOpen(false)}
                  avatar={avatar}
                  defaultAvatar={fallbackAvatar}
                  triggerRef={profileTriggerRef}
                />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        <button
          className={`navbar-burger${menuOpen ? ' is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          onClick={() => {
            setMenuOpen(!menuOpen)
            setProfileOpen(false)
            setNotificationsOpen(false)
          }}
        >
          <span />
          <span />
          <span />
        </button>
        </div>
      </div>

      {/* This is always website navigation. Account navigation stays in the avatar dropdown. */}
      <div
        className={`navbar-drawer-overlay${menuOpen ? ' is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        className={`navbar-drawer${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
      >
        <div className="navbar-drawer-top">
          <span className="navbar-brand">
            <LogoMark size={40} />
            <span className="navbar-brand-text">
              <span className="navbar-brand-name">
                Edu<span>Master</span>
              </span>
              <span className="navbar-brand-tag">Learn. Grow. Succeed.</span>
            </span>
          </span>
          <button
            type="button"
            className="navbar-drawer-close"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="navbar-drawer-links" aria-label="Site pages">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className="navbar-drawer-link"
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              <span className="navbar-drawer-icon"><Icon /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="navbar-drawer-link navbar-drawer-logout"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => {
                closeMenu()
                requestLogout()
              }}
            >
              <span className="navbar-drawer-icon"><LogoutIcon /></span>
              Logout
            </button>
          </>
        ) : (
          <div className="navbar-menu-actions">
            <Link to="/login" className="btn-login" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>
              Login
            </Link>
            <Link to="/signup" className="btn-signup" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
