import './PopularEvents.css'
import { useEffect, useState } from 'react'
import EventCard from './EventCard.jsx'
import { getEvents } from '../../api/event.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const EVENTS_LIMIT = 6

// Backend events have no imageType; derive the illustration from category
const CAT_ILLUSTRATION = {
  Development: 'development',
  'Data Science': 'datascience',
  Design: 'design',
  Business: 'business',
  Marketing: 'marketing',
  'IT & Software': 'cloud',
  'Personal Development': 'productivity',
  Python: 'python',
  AI: 'ai',
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const eventDates = (event) => {
  const start = formatDate(event.startDate)
  if (!start) return null
  const end = event.endDate ? formatDate(event.endDate) : null
  return end && end !== start ? `${start} – ${end}` : start
}

const toCardEvent = (event) => ({
  ...event,
  imageType: event.imageType || CAT_ILLUSTRATION[event.category] || 'development',
  description: event.shortDescription || event.description,
  duration: event.duration ?? eventDates(event),
})

export default function PopularEvents() {
  const reducedMotion = useReducedMotion()
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'error' | 'success'

  useEffect(() => {
    let ignore = false

    getEvents({ limit: EVENTS_LIMIT, sort: 'startDate' })
      .then((response) => {
        if (ignore) return
        const data = response?.data ?? {}
        setEvents(Array.isArray(data.events) ? data.events.map(toCardEvent) : [])
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
    <section className="popular-programs">
      <div className="container">
        <motion.div className="popular-programs-head" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.55 }}>
          <span className="popular-programs-badge">UPCOMING EVENTS</span>
          <h2 className="popular-programs-title">
            Explore Our <span>Upcoming</span> Events
          </h2>
          <p className="popular-programs-sub">
            Industry-aligned events to help you upskill and advance your career
          </p>
        </motion.div>

        {status === 'loading' && (
          <p className="popular-programs-sub" role="status">
            Loading events…
          </p>
        )}

        {status === 'error' && (
          <p className="popular-programs-sub" role="alert">
            Unable to load events right now. Please try again later.
          </p>
        )}

        {status === 'success' && events.length === 0 && (
          <p className="popular-programs-sub">No upcoming events right now. Check back soon!</p>
        )}

        {status === 'success' && events.length > 0 && (
          <motion.div className="popular-programs-grid" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.2 }} variants={stagger(0.1)}>
            {events.map((p) => (
              <EventCard key={p._id ?? p.id} event={p} />
            ))}
          </motion.div>
        )}

        <motion.div className="popular-programs-cta" initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5 }}>
          <button className="popular-programs-viewall">
            View All Events
            <ArrowIcon />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
