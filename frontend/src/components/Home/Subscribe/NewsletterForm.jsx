import { useState } from 'react'
import { api } from '../../../lib/api.js'
import { useNotifications } from '../../Notifications/NotificationProvider.jsx'

export default function NewsletterForm({ formClassName, inputProps, buttonClassName }) {
  const notifications = useNotifications()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
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
    <form className={formClassName} onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        {...inputProps}
      />
      <button type="submit" className={buttonClassName} disabled={loading}>
        Subscribe
      </button>
    </form>
  )
}
