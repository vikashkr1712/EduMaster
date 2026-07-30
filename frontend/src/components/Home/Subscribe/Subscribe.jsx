import { useState } from 'react'
import './Subscribe.css'
import { api } from '../../../lib/api.js'
import { useNotifications } from '../../Notifications/NotificationProvider.jsx'

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="#fff" />
      <path d="M4 7l8 6 8-6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Subscribe() {
  const notifications = useNotifications()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await api('/newsletter/subscribe', { method: 'POST', body: { email } })
      setEmail('')
      notifications.success('You’re subscribed to the newsletter.')
    } catch (error) {
      notifications.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="subscribe">
      <div className="container">
        <div className="subscribe-card">
          <div className="subscribe-left">
            <span className="subscribe-icon">
              <MailIcon />
            </span>
            <div>
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for the latest courses and offers.</p>
            </div>
          </div>
          <form className="subscribe-form" onSubmit={onSubmit}>
            <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="btn-subscribe" disabled={loading}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
