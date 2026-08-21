import './TestimonialsHero.css'
import { useNavigate } from 'react-router-dom'
import TestimonialsHeroIllustration from '../../assets/svg/testimonials/TestimonialsHeroIllustration.jsx'
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1B2B4B" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#fff" />
    </svg>
  )
}

export default function TestimonialsHero() {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()

  return (
    <section className="thero">
      <motion.div className="container thero-inner" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={stagger(0.09)}>
        <motion.span className="thero-badge" variants={fadeUp} transition={{ duration: 0.5 }}>What Our Learners Say</motion.span>

        <motion.h1 className="thero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          Trusted by Learners
          <br />
          <span>Worldwide</span>
        </motion.h1>

        <motion.p className="thero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
          See how EduMaster has helped thousands of students achieve their goals and advance
          their careers.
        </motion.p>

        <motion.div className="thero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
          <button className="thero-btn-explore" onClick={() => navigate('/courses')}>
            Explore Courses
            <ArrowIcon />
          </button>
          <button
            className="thero-btn-video"
            onClick={() => window.open('https://www.youtube.com/watch?v=zJSY8tbf_ys', '_blank', 'noopener,noreferrer')}
          >
            <PlayCircleIcon />
            Watch Video
          </button>
        </motion.div>

        <motion.div className="thero-illustration" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <TestimonialsHeroIllustration />
        </motion.div>
      </motion.div>
    </section>
  )
}
