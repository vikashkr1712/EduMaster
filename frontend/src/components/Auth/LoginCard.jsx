import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthCard.css'
import AuthField from './AuthField.jsx'
import SocialButtons from './SocialButtons.jsx'
import { LoginArrowIcon } from './AuthIcons.jsx'
import { api } from '../../lib/api.js'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'

export default function LoginCard() {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      notifications.success('Welcome back! You are now signed in.')
      navigate('/', { replace: true })
    } catch (error) {
      notifications.error(error.message)
    } finally {
      setLoading(false)
    }
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

      <button type="submit" className={`authcard-submit${loading ? ' is-loading' : ''}`} disabled={loading}>
        {loading ? <span className="authcard-spinner" aria-hidden="true" /> : <LoginArrowIcon />}
        {loading ? 'Logging in…' : 'Login'}
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
