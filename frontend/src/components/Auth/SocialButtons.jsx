import { GoogleIcon, MicrosoftIcon, AppleIcon } from './AuthIcons.jsx'

/* Third-party sign-in row shared by the Login and Signup cards. */
export default function SocialButtons({ onGoogleClick, googleLoading = false, disabled = false }) {
  return (
    <div className="authcard-social">
      <button
        type="button"
        className={`authcard-social-btn${googleLoading ? ' is-loading' : ''}`}
        onClick={onGoogleClick}
        disabled={disabled || googleLoading}
        aria-label="Continue with Google"
      >
        {googleLoading ? <span className="authcard-spinner" aria-hidden="true" /> : <GoogleIcon />}
        {googleLoading ? 'Connecting…' : 'Google'}
      </button>
      <button type="button" className="authcard-social-btn" disabled={disabled}>
        <MicrosoftIcon />
        Microsoft
      </button>
      <button type="button" className="authcard-social-btn" disabled={disabled}>
        <AppleIcon />
        Apple
      </button>
    </div>
  )
}
