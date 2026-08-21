import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider.jsx'
import { DASHBOARD_MENU, LogoutIcon } from '../../Dashboard/dashboardMenu.jsx'
import { useLogoutConfirm } from '../../Dashboard/LogoutModal.jsx'
import ProfileAvatar from '../../Profile/ProfileAvatar.jsx'

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}

export default function ProfileDropdown({ open, onClose, avatar, defaultAvatar, triggerRef }) {
  const { user } = useAuth()
  const requestLogout = useLogoutConfirm()
  const panelRef = useRef(null)

  const closeAndRefocus = () => {
    onClose()
    triggerRef?.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      closeAndRefocus()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...(panelRef.current?.querySelectorAll('[data-menu-item]') ?? [])]
    if (!items.length) return
    const index = items.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown'
      ? (index + 1) % items.length
      : (index - 1 + items.length) % items.length
    items[next].focus()
  }

  return (
    <div
      className={`profile-dropdown${open ? ' is-open' : ''}`}
      ref={panelRef}
      role="menu"
      aria-hidden={!open}
      onKeyDown={onKeyDown}
    >
      <div className="profile-dropdown-header">
        <ProfileAvatar className="profile-dropdown-avatar" src={avatar} defaultSrc={defaultAvatar} />
        <div className="profile-dropdown-id">
          <p className="profile-dropdown-name">{user?.name || 'Learner'}</p>
          <p className="profile-dropdown-email">{user?.email || ''}</p>
          <Link
            to="/profile"
            className="profile-dropdown-view"
            role="menuitem"
            data-menu-item
            tabIndex={open ? 0 : -1}
            onClick={onClose}
          >
            View Profile <ArrowRightIcon />
          </Link>
        </div>
      </div>

      <div className="profile-dropdown-divider" />

      <nav className="profile-dropdown-menu" aria-label="Profile menu">
        {DASHBOARD_MENU.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/profile'}
            className={({ isActive }) => `profile-dropdown-item${isActive ? ' is-active' : ''}`}
            role="menuitem"
            data-menu-item
            tabIndex={open ? 0 : -1}
            onClick={onClose}
          >
            <span className="profile-dropdown-icon"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="profile-dropdown-divider" />

      <button
        type="button"
        className="profile-dropdown-item profile-dropdown-logout"
        role="menuitem"
        data-menu-item
        tabIndex={open ? 0 : -1}
        onClick={() => {
          onClose()
          requestLogout()
        }}
      >
        <span className="profile-dropdown-icon"><LogoutIcon /></span>
        Logout
      </button>
    </div>
  )
}
