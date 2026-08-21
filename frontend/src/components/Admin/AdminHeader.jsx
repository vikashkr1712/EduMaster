import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import AdminAvatar from './AdminAvatar.jsx'
import AdminIcon from './AdminIcons.jsx'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../Theme/ThemeProvider.jsx'

const getPageTitle = (pathname) => {
  if (pathname === '/admin/profile') return 'Admin Profile'
  if (pathname === '/admin/courses/new') return 'Add Course'
  if (/^\/admin\/courses\/[^/]+\/curriculum$/.test(pathname)) return 'Course Curriculum'
  if (/^\/admin\/courses\/[^/]+\/edit$/.test(pathname)) return 'Edit Course'
  if (pathname.startsWith('/admin/courses')) return 'Courses'
  if (/^\/admin\/users\/[^/]+$/.test(pathname)) return 'User Details'
  if (pathname.startsWith('/admin/users')) return 'Users'
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return 'Order Details'
  if (pathname.startsWith('/admin/orders')) return 'Orders'
  if (/^\/admin\/enrollments\/[^/]+$/.test(pathname)) return 'Enrollment Details'
  if (pathname.startsWith('/admin/enrollments')) return 'Enrollments'
  if (pathname === '/admin/quizzes/new') return 'Create Quiz'
  if (/^\/admin\/quizzes\/[^/]+\/edit$/.test(pathname)) return 'Edit Quiz'
  if (/^\/admin\/quizzes\/[^/]+$/.test(pathname)) return 'Quiz Details'
  if (pathname.startsWith('/admin/quizzes')) return 'Quizzes'
  if (pathname === '/admin/assignments/new') return 'Create Assignment'
  if (/^\/admin\/assignments\/[^/]+\/edit$/.test(pathname)) return 'Edit Assignment'
  if (/^\/admin\/assignments\/[^/]+\/submissions\/[^/]+$/.test(pathname)) return 'Submission Review'
  if (/^\/admin\/assignments\/[^/]+\/submissions$/.test(pathname)) return 'Assignment Submissions'
  if (/^\/admin\/assignments\/[^/]+$/.test(pathname)) return 'Assignment Details'
  if (pathname.startsWith('/admin/assignments')) return 'Assignments'
  if (/^\/admin\/certificates\/[^/]+$/.test(pathname)) return 'Certificate Details'
  if (pathname.startsWith('/admin/certificates')) return 'Certificates'
  if (/^\/admin\/discussions\/[^/]+$/.test(pathname)) return 'Discussion Details'
  if (pathname.startsWith('/admin/discussions')) return 'Discussions'
  if (pathname === '/admin/notifications/new') return 'Create Notification'
  if (/^\/admin\/notifications\/[^/]+$/.test(pathname)) return 'Notification Details'
  if (pathname.startsWith('/admin/notifications')) return 'Notifications'
  if (pathname.startsWith('/admin/reports')) return 'Reports & Analytics'
  if (pathname.startsWith('/admin/settings')) return 'Settings'
  return 'Dashboard'
}

export default function AdminHeader({ navigationOpen, onOpenNavigation }) {
  const { user, logout } = useAuth()
  const { isDark, setTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const profileRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout({ redirectTo: '/admin/login' })
    } catch {
      // AuthProvider clears local authentication in its finally block even
      // when the server cannot be reached, so no extra error UI is needed.
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          type="button"
          className="admin-header__menu"
          onClick={onOpenNavigation}
          aria-label="Open Admin navigation"
          aria-controls="admin-navigation"
          aria-expanded={navigationOpen}
        >
          <AdminIcon name="menu" size={22} />
        </button>
        <div>
          <span className="admin-header__context">Admin workspace</span>
          <strong className="admin-header__title">{getPageTitle(pathname)}</strong>
        </div>
      </div>

      <div className="admin-header__actions">
        <button
          type="button"
          className="admin-theme-toggle"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <AdminIcon name={isDark ? 'sun' : 'moon'} size={20} />
        </button>

        <div className="admin-header__profile" ref={profileRef}>
        <button
          type="button"
          className="admin-profile-trigger"
          onClick={() => setProfileOpen((current) => !current)}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          aria-controls="admin-profile-menu"
        >
          <AdminAvatar user={user} />
          <span className="admin-profile-trigger__identity">
            <strong>{user?.name || 'Admin'}</strong>
            <span>Administrator</span>
          </span>
          <AdminIcon name="chevron" size={17} className={profileOpen ? 'is-rotated' : ''} />
        </button>

          {profileOpen && (
          <div id="admin-profile-menu" className="admin-profile-menu" role="menu">
            <div className="admin-profile-menu__identity">
              <AdminAvatar user={user} size="large" />
              <div>
                <strong>{user?.name || 'Admin'}</strong>
                <span>{user?.email || 'No email available'}</span>
                <small>Role: Administrator</small>
              </div>
            </div>
            <Link role="menuitem" to="/admin/profile" onClick={() => setProfileOpen(false)}>
              <AdminIcon name="users" size={18} />
              Profile
            </Link>
            <button type="button" role="menuitem" onClick={handleLogout} disabled={loggingOut}>
              <AdminIcon name="logout" size={18} />
              {loggingOut ? 'Signing out…' : 'Logout'}
            </button>
          </div>
          )}
        </div>
      </div>
    </header>
  )
}
