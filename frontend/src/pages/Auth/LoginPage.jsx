import '../../components/Auth/AuthLayout.css'
import AuthLeftPanel from '../../components/Auth/AuthLeftPanel.jsx'
import LoginCard from '../../components/Auth/LoginCard.jsx'
import LoginIllustration from '../../assets/svg/auth/LoginIllustration.jsx'
import { loginFeatures } from '../../data/authData.js'

export default function LoginPage() {
  return (
    <div className="authpage authpage--login">
      <div className="authpage-inner">
        <AuthLeftPanel
          badge="Welcome Back!"
          title={
            <>
              Welcome Back to
              <br />
              Edu<span className="authpanel-hl">Master</span>
            </>
          }
          description="Login to continue your learning journey and achieve your goals."
          features={loginFeatures}
          illustration={<LoginIllustration />}
        />

        <div className="authpage-card-col">
          <LoginCard />
        </div>
      </div>

      <footer className="authpage-footer">© 2024 EduMaster. All rights reserved.</footer>
    </div>
  )
}
