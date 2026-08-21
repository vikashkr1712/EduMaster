import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminHeader from './AdminHeader.jsx'
import AdminSidebar from './AdminSidebar.jsx'
import '../../pages/Admin/AdminDashboard.css'
import './AdminTheme.css'

export default function AdminLayout() {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setNavigationOpen(false), [location.pathname])

  useEffect(() => {
    if (!navigationOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setNavigationOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [navigationOpen])

  return (
    <div className="admin-shell">
      <AdminSidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="admin-main">
        <AdminHeader navigationOpen={navigationOpen} onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
