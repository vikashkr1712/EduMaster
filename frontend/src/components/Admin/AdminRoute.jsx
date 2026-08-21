import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider.jsx'

export default function AdminRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return fallback

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/forbidden" replace />
  }

  return children
}
