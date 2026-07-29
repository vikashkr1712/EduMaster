import './HeroSection.css'
import EventsHero from '../../assets/svg/events/EventsHero.jsx'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'

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

function PlayCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#1B2B4B" strokeWidth="1.8" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#1B2B4B" />
    </svg>
  )
}

export default function HeroSection() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="programs-hero">
      <div className="container programs-hero-inner">
        <motion.div className="programs-hero-content" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={stagger(0.1)}>
          <motion.h1 className="programs-hero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            Our Events
            <br />
            Designed for <span>Your Success</span>
          </motion.h1>

          <motion.p className="programs-hero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            Join expertly curated events that help you master in-demand skills and accelerate
            your career growth.
          </motion.p>

          <motion.div className="programs-hero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
            <button className="programs-btn-explore">
              Explore Events
              <ArrowIcon />
            </button>
            <button className="programs-btn-how">
              <PlayCircleIcon />
              How It Works
            </button>
          </motion.div>
        </motion.div>

        <motion.div className="programs-hero-illustration" initial={reducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <EventsHero />
        </motion.div>
      </div>
    </section>
  )
}
