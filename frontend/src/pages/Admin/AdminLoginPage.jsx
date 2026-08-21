import { Link } from 'react-router-dom'
import AuthLeftPanel from '../../components/Auth/AuthLeftPanel.jsx'
import LoginCard from '../../components/Auth/LoginCard.jsx'
import { AdminLoginIcon } from '../../components/Auth/AuthIcons.jsx'
import '../../components/Auth/AuthLayout.css'
import SvgAdmin from '../../assets/svg/SvgAdmin.jsx'
import { adminIllustration } from '../../config/adminIllustration.config.js'

const adminFeatures = [
  { id: 'secure', icon: 'shield', tint: 'blue', title: 'Secure Access', text: 'Protected admin area with role-based access' },
  { id: 'overview', icon: 'chart', tint: 'orange', title: 'Overview Dashboard', text: 'Get real-time insights and analytics at a glance' },
  { id: 'content', icon: 'book', tint: 'green', title: 'Manage Content', text: 'Add, edit and organize courses, events and more' },
  { id: 'users', icon: 'people', tint: 'purple', title: 'User Management', text: 'Manage users and track engagement easily' },
]

export default function AdminLoginPage() {
  const illustrationStyle = {
    width: adminIllustration.illustration.width,
    height: adminIllustration.illustration.height,
    left: adminIllustration.illustration.x,
    top: adminIllustration.illustration.y,
  }
  const illustrationGroupStyle = {
    ...illustrationStyle,
    margin: adminIllustration.illustration.margin,
  }

  return (
    <main className="authpage authpage--admin">
      <div className="authpage-inner">
        <AuthLeftPanel
          variant="admin"
          badge="Welcome Back! 👋"
          title={<>Welcome Back,<br /><span className="authpanel-hl">Admin!</span></>}
          description="Sign in to access your dashboard and manage the platform effortlessly."
          features={adminFeatures}
          illustration={
            <SvgAdmin
              width={adminIllustration.illustration.width}
              height={adminIllustration.illustration.height}
            />
          }
          illustrationConfig={adminIllustration}
          illustrationGroupStyle={illustrationGroupStyle}
          showStats={false}
          footer=""
        />
        <div className="authpage-card-col">
          <LoginCard
            variant="admin"
            title="Admin Login"
            subtitle="Enter your credentials to access the admin panel"
            submitLabel="Sign In"
            headerIcon={<AdminLoginIcon />}
            requiredRole="admin"
            successRedirect="/admin/dashboard"
            footer={<p className="authcard-switch">Not an admin? <Link to="/">Back to Website</Link></p>}
          />
        </div>
      </div>
    </main>
  )
}
