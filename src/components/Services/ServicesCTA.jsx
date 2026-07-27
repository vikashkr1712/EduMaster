import './ServicesCTA.css'
import TrophyIllustration from '../../assets/svg/common/TrophyIllustration.jsx'
import { motion, useReducedMotion } from '../Home/motion.jsx'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="#1B2B4B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ServicesCTA() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="scta">
      <div className="container">
        <motion.div className="scta-banner" initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <div className="scta-illustration">
            <TrophyIllustration />
          </div>

          <div className="scta-copy">
            <h2 className="scta-title">
              Ready To Transform
              <br />
              Your Learning Journey?
            </h2>
            <p className="scta-text">
              Join thousands of learners and take the first step towards your dream career.
            </p>
          </div>

          <button className="scta-btn">
            Get Started Today
            <ArrowIcon />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
