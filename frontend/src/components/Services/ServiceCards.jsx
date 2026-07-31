import './ServiceCards.css'
import { useEffect, useState } from 'react'
import { getServices } from '../../api/service.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

const ICONS = {
  live: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4.5" width="18" height="12.5" rx="2.5" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M8 20.5h8" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="9.5" cy="10.5" r="1.9" fill="#2563EB" />
      <path d="M6.6 14.8c.5-1.5 1.6-2.4 2.9-2.4s2.4.9 2.9 2.4" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.2 9h3M15.2 12h2" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  career: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="3.4" stroke="#22C55E" strokeWidth="1.9" />
      <path d="M4 20c.7-3.4 3.2-5.4 6-5.4 1 0 2 .3 2.9.8" stroke="#22C55E" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16.4 14.2l1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2-1.6-1.6 2.2-.3 1-2z" fill="#22C55E" />
    </svg>
  ),
  placement: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" fill="#F9B233" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5" stroke="#F9B233" strokeWidth="1.9" />
      <path d="M3.5 12.5h17" stroke="#fff" strokeWidth="1.6" />
      <rect x="10.5" y="11" width="3" height="3" rx="1" fill="#fff" />
    </svg>
  ),
  certification: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4" width="17" height="12.5" rx="2" stroke="#8B5CF6" strokeWidth="1.9" />
      <circle cx="12" cy="9.5" r="2.6" stroke="#8B5CF6" strokeWidth="1.7" />
      <path d="M10.3 11.8l-1.2 4.6 2.9-1.6 2.9 1.6-1.2-4.6" stroke="#8B5CF6" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 20.5h8" stroke="#8B5CF6" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  corporate: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="2.6" fill="#F97316" />
      <circle cx="5.6" cy="9" r="2.2" fill="#F97316" opacity="0.75" />
      <circle cx="18.4" cy="9" r="2.2" fill="#F97316" opacity="0.75" />
      <path d="M8.2 19c.5-2.9 2-4.6 3.8-4.6s3.3 1.7 3.8 4.6" stroke="#F97316" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M2.5 17.5c.4-2.2 1.5-3.6 2.9-3.9M21.5 17.5c-.4-2.2-1.5-3.6-2.9-3.9" stroke="#F97316" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  resources: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.5c-1.8-1.6-4.2-2-8-2v13c3.8 0 6.2.4 8 2 1.8-1.6 4.2-2 8-2v-13c-3.8 0-6.2.4-8 2z" stroke="#2563EB" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 6.5v13" stroke="#2563EB" strokeWidth="1.9" />
    </svg>
  ),
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SERVICES_LIMIT = 3

// Tint per known backend icon key; unknown icons cycle through the palette
const ICON_TINT = {
  live: 'blue',
  career: 'green',
  placement: 'orange',
  certification: 'purple',
  corporate: 'orange',
  resources: 'blue',
}
const TINT_CYCLE = ['blue', 'green', 'orange', 'purple']

const toCard = (service, index) => ({
  ...service,
  tint: ICON_TINT[service.icon] || TINT_CYCLE[index % TINT_CYCLE.length],
  iconNode: ICONS[service.icon] || ICONS.resources,
  text: service.shortDescription || service.description || '',
})

export default function ServiceCards() {
  const reducedMotion = useReducedMotion()
  const [cards, setCards] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'error' | 'success'

  useEffect(() => {
    let ignore = false

    getServices({ limit: SERVICES_LIMIT })
      .then((response) => {
        if (ignore) return
        const data = response?.data ?? {}
        setCards(Array.isArray(data.services) ? data.services.map(toCard) : [])
        setStatus('success')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="scards">
      <div className="container">
        <motion.div className="scards-head" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.55 }}>
          <span className="scards-badge">Our Services</span>
          <h2 className="scards-title">Everything You Need To Learn &amp; Grow</h2>
          <p className="scards-sub">A complete ecosystem for students, professionals and institutions.</p>
        </motion.div>

        {status === 'loading' && (
          <p className="scards-sub" role="status">
            Loading services…
          </p>
        )}

        {status === 'error' && (
          <p className="scards-sub" role="alert">
            Unable to load services right now. Please try again later.
          </p>
        )}

        {status === 'success' && cards.length === 0 && (
          <p className="scards-sub">No services available right now. Check back soon!</p>
        )}

        {status === 'success' && cards.length > 0 && (
          <motion.div className="scards-grid" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.2 }} variants={stagger(0.08)}>
            {cards.slice(0, 3).map((card) => (
              <motion.article
                className={`scard scard-${card.tint}`}
                key={card._id ?? card.id}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reducedMotion ? undefined : { y: -6 }}
              >
                <motion.span className="scard-icon" variants={{ hidden: { opacity: 0, scale: 0.55 }, visible: { opacity: 1, scale: 1 } }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                  {card.iconNode}
                </motion.span>
                <div className="scard-body">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <a href="#" className="scard-link">
                    Learn More
                    <ArrowIcon />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
