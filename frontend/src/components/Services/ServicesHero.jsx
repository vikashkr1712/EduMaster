import './ServicesHero.css'
import { useNavigate } from 'react-router-dom'
import ServicesHeroSvg from '../../assets/svg/services/ServicesHeroSvg.jsx'
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

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.9" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

export default function ServicesHero() {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()

  return (
    <section className="shero">
      <div className="container shero-inner">
        <motion.div className="shero-content" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={stagger(0.09)}>
          <motion.span className="shero-badge" variants={fadeUp} transition={{ duration: 0.5 }}>Our Services</motion.span>

          <motion.h1 className="shero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            Empowering Your
            <br />
            <span>Learning</span> Beyond
            <br />
            Traditional Education
          </motion.h1>

          <motion.p className="shero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            At EduMaster, we provide a complete ecosystem of learning services designed to help
            you achieve your goals and advance your career.
          </motion.p>

          <motion.div className="shero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
            <button
              className="shero-btn-explore"
              onClick={() =>
                document.querySelector('.scards')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              Explore Services
              <ArrowIcon />
            </button>
            <button
              className="shero-btn-consult"
              onClick={() =>
                navigate('/contact', {
                  state: {
                    scrollTo: 'form',
                    subject: 'Free Consultation',
                    message: 'I would like to book a free consultation.',
                  },
                })
              }
            >
              <CalendarIcon />
              Book Free Consultation
            </button>
          </motion.div>
        </motion.div>

        <motion.div className="shero-illustration" initial={reducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <ServicesHeroSvg />
        </motion.div>
      </div>
    </section>
  )
}
