import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './AuthCard.css'
import AuthField from './AuthField.jsx'
import SocialButtons from './SocialButtons.jsx'
import { LoginArrowIcon } from './AuthIcons.jsx'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { useAuth } from './AuthProvider.jsx'

export default function LoginCard({
  variant = 'login',
  title = 'Login to Your Account',
  subtitle = 'Enter your credentials to access your account',
  submitLabel = 'Login',
  headerIcon,
  footer,
  onSubmit: onFormSubmit,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const notifications = useNotifications()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (onFormSubmit) {
      onFormSubmit({ email, password, remember })
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      notifications.success('Welcome back! You are now signed in.')
      const redirectTo = location.state?.from
      navigate(
        redirectTo ? `${redirectTo.pathname}${redirectTo.search}${redirectTo.hash}` : '/',
        { replace: true }
      )
    } catch (error) {
      notifications.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={`authcard authcard--${variant}`} onSubmit={onSubmit} noValidate>
      {headerIcon && <div className="authcard-header-icon">{headerIcon}</div>}
      <h2 className="authcard-title">{title}</h2>
      <p className="authcard-sub">{subtitle}</p>

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

      <button type="submit" className={`authcard-submit${loading ? ' is-loading' : ''}`} disabled={loading}>
        {loading ? <span className="authcard-spinner" aria-hidden="true" /> : <LoginArrowIcon />}
        {loading ? 'Logging in…' : submitLabel}
      </button>

      <div className="authcard-divider">
        <span>or continue with</span>
      </div>

      <SocialButtons />

      {footer ?? (
        <p className="authcard-switch">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      )}
    </form>
  )
}
