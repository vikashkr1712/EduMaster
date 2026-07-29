import '../../components/Auth/AuthLayout.css'
import AuthLeftPanel from '../../components/Auth/AuthLeftPanel.jsx'
import SignupCard from '../../components/Auth/SignupCard.jsx'
import SignupIllustration from '../../assets/svg/auth/SignupIllustration.jsx'
import { signupFeatures } from '../../data/authData.js'

export default function SignupPage() {
  return (
    <div className="authpage authpage--signup">
      <div className="authpage-inner">
        <AuthLeftPanel
          badge="Create Your Account"
          title={
            <>
              Start Your Learning
              <br />
              Journey with Edu
              <span className="authpanel-hl">Master</span>
            </>
          }
          description="Join thousands of learners and unlock access to expert courses, live sessions, and career opportunities."
          features={signupFeatures}
          illustration={<SignupIllustration />}
        />

        <div className="authpage-card-col">
          <SignupCard />
        </div>
      </div>

      <footer className="authpage-footer">© 2024 EduMaster. All rights reserved.</footer>
    </div>
  )
}
