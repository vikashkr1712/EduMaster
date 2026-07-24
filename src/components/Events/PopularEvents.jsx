import './PopularEvents.css'
import EventCard from './EventCard.jsx'
import { popularEvents } from '../../data/eventsData.js'
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

export default function PopularEvents() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="popular-programs">
      <div className="container">
        <motion.div className="popular-programs-head" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55 }}>
          <span className="popular-programs-badge">UPCOMING EVENTS</span>
          <h2 className="popular-programs-title">
            Explore Our <span>Upcoming</span> Events
          </h2>
          <p className="popular-programs-sub">
            Industry-aligned events to help you upskill and advance your career
          </p>
        </motion.div>

        <motion.div className="popular-programs-grid" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger(0.1)}>
          {popularEvents.map((p) => (
            <EventCard key={p.id} event={p} />
          ))}
        </motion.div>

        <motion.div className="popular-programs-cta" initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
          <button className="popular-programs-viewall">
            View All Events
            <ArrowIcon />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
