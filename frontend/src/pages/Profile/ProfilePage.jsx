import { useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import { DASHBOARD_MENU } from '../../components/Dashboard/dashboardMenu.jsx'
import './ProfilePage.css'

// Phase 1: shared layout only. Each menu route renders a placeholder here
// until its page content is built in a later phase.
export default function ProfilePage() {
  const { pathname } = useLocation()
  const active = DASHBOARD_MENU.find((item) => item.to === pathname) || DASHBOARD_MENU[0]

  return (
    <DashboardLayout>
      <DashboardHeader
        title={active.label}
        subtitle="This section is coming soon."
      />
      <DashboardContent>
        <div className="profile-placeholder-card">
          <p>{active.label} content will appear here.</p>
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
