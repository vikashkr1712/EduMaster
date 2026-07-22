import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthCard.css'
import AuthField from './AuthField.jsx'
import SocialButtons from './SocialButtons.jsx'
import { LoginArrowIcon } from './AuthIcons.jsx'

export default function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form className="authcard" onSubmit={onSubmit} noValidate>
      <h2 className="authcard-title">Login to Your Account</h2>
      <p className="authcard-sub">Enter your credentials to access your account</p>

      <AuthField
        id="login-email"
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        icon="mail"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <AuthField
        id="login-password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon="lock"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="authcard-row">
        <label className="authcard-check">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Remember Me</span>
        </label>
        <a href="#" className="authcard-forgot">
          Forgot Password?
        </a>
      </div>

      <button type="submit" className="authcard-submit">
        <LoginArrowIcon />
        Login
      </button>

      <div className="authcard-divider">
        <span>or continue with</span>
      </div>

      <SocialButtons />

      <p className="authcard-switch">
        Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </form>
  )
}
