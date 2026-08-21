import { NavLink } from 'react-router-dom'
import AdminIcon from './AdminIcons.jsx'

const navigation = [
  { label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { label: 'Courses', icon: 'courses', to: '/admin/courses' },
  { label: 'Users', icon: 'users', to: '/admin/users' },
  { label: 'Orders', icon: 'orders', to: '/admin/orders' },
  { label: 'Enrollments', icon: 'enrollments', to: '/admin/enrollments' },
  { label: 'Certificates', icon: 'certificates', to: '/admin/certificates' },
  { label: 'Quizzes', icon: 'quizzes', to: '/admin/quizzes' },
  { label: 'Assignments', icon: 'assignments', to: '/admin/assignments' },
  { label: 'Discussions', icon: 'discussions', to: '/admin/discussions' },
  { label: 'Notifications', icon: 'notifications', to: '/admin/notifications' },
  { label: 'Reports', icon: 'reports', to: '/admin/reports' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' },
]

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <aside id="admin-navigation" className={`admin-sidebar${open ? ' is-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__mark" aria-hidden="true">E</div>
          <div>
            <strong>EduMaster</strong>
            <span>Admin Panel</span>
          </div>
          <button className="admin-sidebar__close" type="button" onClick={onClose} aria-label="Close Admin navigation">
            <AdminIcon name="close" />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <p className="admin-sidebar__eyebrow">Management</p>
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `admin-nav-item${isActive ? ' is-active' : ''}`}
            >
              <AdminIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <span className="admin-sidebar__status" aria-hidden="true" />
          Secure admin workspace
        </div>
      </aside>
      <button
        type="button"
        className={`admin-sidebar-backdrop${open ? ' is-visible' : ''}`}
        onClick={onClose}
        aria-label="Close Admin navigation"
        tabIndex={open ? 0 : -1}
      />
    </>
  )
}
