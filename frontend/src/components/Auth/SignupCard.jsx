import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './AuthCard.css'
import AuthField from './AuthField.jsx'
import SocialButtons from './SocialButtons.jsx'
import { CheckCircleIcon, UserPlusIcon } from './AuthIcons.jsx'
import { passwordRules } from '../../data/authData.js'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { useAuth } from './AuthProvider.jsx'

export default function SignupCard() {
  const notifications = useNotifications()
  const { signup } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!agreed) {
      notifications.error('Please accept the Terms & Conditions and Privacy Policy.')
      return
    }
    setLoading(true)
    try {
      await signup({ name: fullName, email, password, confirmPassword: confirm })
      notifications.success('Your account has been created successfully.')
      const redirectTo = location.state?.from
      navigate(
        redirectTo ? `${redirectTo.pathname}${redirectTo.search}${redirectTo.hash}` : '/',
        { replace: true, state: location.state?.purchaseAction ? { purchaseAction: location.state.purchaseAction } : null }
      )
    } catch (error) {
      notifications.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="authcard authcard--signup" onSubmit={onSubmit} noValidate>
      <h2 className="authcard-title">Create Your Account</h2>
      <p className="authcard-sub">Fill in your details to get started with EduMaster</p>

      <AuthField
        id="signup-name"
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        icon="user"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <AuthField
        id="signup-email"
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        icon="mail"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <AuthField
        id="signup-password"
        label="Password"
        type="password"
        placeholder="Create a password"
        icon="lock"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <AuthField
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        icon="lock"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <ul className="authcard-rules">
        {passwordRules.map((rule) => (
          <li key={rule.id} className="authcard-rule">
            <CheckCircleIcon />
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>

      <label className="authcard-check authcard-terms">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I agree to the <Link to="/about">Terms &amp; Conditions</Link> and <Link to="/about">Privacy Policy</Link>
        </span>
      </label>

      <button type="submit" className={`authcard-submit${loading ? ' is-loading' : ''}`} disabled={loading}>
        {loading ? <span className="authcard-spinner" aria-hidden="true" /> : <UserPlusIcon />}
        {loading ? 'Creating Account…' : 'Create Account'}
      </button>

      <div className="authcard-divider">
        <span>or sign up with</span>
      </div>

      <SocialButtons />

      <p className="authcard-switch">
        Already have an account? <Link to="/login" state={location.state}>Login</Link>
      </p>
    </form>
  )
}
