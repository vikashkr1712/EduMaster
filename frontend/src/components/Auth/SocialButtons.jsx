import { GoogleIcon, MicrosoftIcon, AppleIcon } from './AuthIcons.jsx'

/* Third-party sign-in row shared by the Login and Signup cards. */
export default function SocialButtons() {
  return (
    <div className="authcard-social">
      <button type="button" className="authcard-social-btn">
        <GoogleIcon />
        Google
      </button>
      <button type="button" className="authcard-social-btn">
        <MicrosoftIcon />
        Microsoft
      </button>
      <button type="button" className="authcard-social-btn">
        <AppleIcon />
        Apple
      </button>
    </div>
  )
}
