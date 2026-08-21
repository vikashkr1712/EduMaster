import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Navbar from '../Home/Navbar/Navbar.jsx'
import { useAuth } from '../Auth/AuthProvider.jsx'
import DashboardSidebar from './DashboardSidebar.jsx'
import './Dashboard.css'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading, hasSessionHint } = useAuth()
  const { pathname } = useLocation()

  // close the drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // lock page scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  if (isLoading) {
    // Do not leave a logged-out visitor on a blank dashboard while the
    // background session request waits to fail or time out.
    if (!hasSessionHint) return <Navigate to="/" replace />
    return (
      <div className="dash-page">
        <Navbar />
        <div className="dash-loading" aria-label="Loading dashboard" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="dash-page">
      <Navbar />
      <div className="container dash-shell">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="dash-main">{children}</main>
      </div>
    </div>
  )
}
