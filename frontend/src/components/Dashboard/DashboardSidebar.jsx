import { NavLink } from 'react-router-dom'
import { DASHBOARD_MENU, LogoutIcon } from './dashboardMenu.jsx'
import { useLogoutConfirm } from './LogoutModal.jsx'
import ProfileSummary from './ProfileSummary.jsx'
import SupportCard from './SupportCard.jsx'

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function DashboardSidebar({ open, onClose }) {
  const requestLogout = useLogoutConfirm()

  return (
    <>
      <div
        className={`dash-sidebar-overlay${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`dash-sidebar${open ? ' is-open' : ''}`} aria-label="Dashboard navigation">
        <button className="dash-sidebar-close" aria-label="Close menu" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="dash-sidebar-card">
          <ProfileSummary />

          <nav className="dash-menu">
            {DASHBOARD_MENU.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/profile'}
                className={({ isActive }) => `dash-menu-item${isActive ? ' is-active' : ''}`}
                onClick={onClose}
              >
                <span className="dash-menu-icon"><Icon /></span>
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              className="dash-menu-item dash-menu-logout"
              onClick={() => {
                onClose()
                requestLogout()
              }}
            >
              <span className="dash-menu-icon"><LogoutIcon /></span>
              Logout
            </button>
          </nav>
        </div>

        <SupportCard />
      </aside>
    </>
  )
}
