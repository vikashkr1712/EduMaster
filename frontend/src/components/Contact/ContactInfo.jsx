import './ContactInfo.css'
import { useState } from 'react'
import MailIconSvg from '../../assets/svg/contact/MailIconSvg.jsx'
import PhoneIconSvg from '../../assets/svg/contact/PhoneIconSvg.jsx'
import VisitPinIconSvg from '../../assets/svg/contact/VisitPinIconSvg.jsx'
import ClockIconSvg from '../../assets/svg/contact/ClockIconSvg.jsx'
import { contactCards } from '../../data/contactData.js'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'
import { api } from '../../lib/api.js'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'

const cardIcons = {
  mail: <MailIconSvg />,
  phone: <PhoneIconSvg />,
  pin: <VisitPinIconSvg />,
  clock: <ClockIconSvg />,
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.5 2.5L10.8 13.2M21.5 2.5l-6.8 19-3.9-8.3-8.3-3.9 19-6.8z"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ContactInfo() {
  const reducedMotion = useReducedMotion()
  const notifications = useNotifications()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    const formElement = e.currentTarget
    setLoading(true)
    try {
      const form = new FormData(formElement)
      await api('/contact', {
        method: 'POST',
        body: Object.fromEntries(form),
      })
      formElement.reset()
      notifications.success('Your message has been sent. We’ll be in touch soon.')
    } catch (error) {
      notifications.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="cinfo">
      <div className="container cinfo-inner">
        <motion.div className="cinfo-left" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.2 }} variants={stagger(0.08)}>
          <motion.h2 className="cinfo-title" variants={fadeUp} transition={{ duration: 0.55 }}>
            Get in <span>Touch</span>
          </motion.h2>
          <motion.p className="cinfo-subtitle" variants={fadeUp} transition={{ duration: 0.5 }}>Choose the best way to reach us. We&rsquo;re here to assist you!</motion.p>

          <motion.div className="cinfo-cards" variants={stagger(0.08)}>
            {contactCards.map((card) => (
              <motion.div className={`cinfo-card cinfo-card-${card.tint}`} key={card.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <span className="cinfo-card-icon">{cardIcons[card.icon]}</span>
                <div className="cinfo-card-body">
                  <h3>{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="cinfo-form-card" initial={reducedMotion ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="cinfo-form-title">Send Us a Message</h2>
          <p className="cinfo-form-subtitle">
            Fill out the form below and we&rsquo;ll get back to you as soon as possible.
          </p>

          <form className="cinfo-form" onSubmit={onSubmit}>
            <div className="cinfo-form-row">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <input type="text" name="subject" placeholder="Subject" required />
            <textarea name="message" placeholder="Your Message" rows="5" required />
            <button type="submit" className={`cinfo-form-btn${loading ? ' is-loading' : ''}`} disabled={loading}>
              {loading ? 'Sending…' : 'Send Message'}
              {loading ? <span className="cinfo-spinner" aria-hidden="true" /> : <SendIcon />}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
