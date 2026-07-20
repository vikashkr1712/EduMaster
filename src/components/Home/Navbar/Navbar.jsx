import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

function LogoMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      {/* stacked layers graduation mark */}
      <path d="M23 6 L41 14 L23 22 L5 14 Z" fill="#1B2B4B" />
      <path d="M23 17 L37 23 L23 29 L9 23 Z" fill="#F9B233" />
      <path d="M23 26 L34 30.5 L23 35 L12 30.5 Z" fill="#2563EB" />
      <path d="M39 15 v9" stroke="#F9B233" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="39" cy="26" r="2.4" fill="#F9B233" />
    </svg>
  )
}

const links = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Programs', to: '/programs' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [open])

  return (
    <header className="navbar" ref={rootRef}>
      <div className="container navbar-inner">
        <a href="#" className="navbar-brand">
          <LogoMark />
          <span className="navbar-brand-text">
            <span className="navbar-brand-name">
              Edu<span>Master</span>
            </span>
            <span className="navbar-brand-tag">Learn. Grow. Succeed.</span>
          </span>
        </a>

        <nav className="navbar-links">
          {links.map((link) =>
            link.to === '#' ? (
              <a key={link.label} href="#">
                {link.label}
              </a>
            ) : (
              <NavLink key={link.label} to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="navbar-actions">
          <button className="btn-login">Login</button>
          <button className="btn-signup">Sign Up</button>
        </div>

        <button
          className={`navbar-burger${open ? ' is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar-menu${open ? ' open' : ''}`}>
        {links.map((link) =>
          link.to === '#' ? (
            <a key={link.label} href="#" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ) : (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          )
        )}
        <div className="navbar-menu-actions">
          <button className="btn-login">Login</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
    </header>
  )
}
