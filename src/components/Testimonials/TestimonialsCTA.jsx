import './TestimonialsCTA.css'
import TrophyIllustration from '../../assets/svg/common/TrophyIllustration.jsx'
import { motion, useReducedMotion } from '../Home/motion.jsx'

export default function TestimonialsCTA() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="tcta">
      <div className="container">
        <motion.div className="tcta-card" initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <div className="tcta-trophy">
            <TrophyIllustration />
          </div>
          <div className="tcta-copy">
            <h2>Join Thousands of Successful Learners</h2>
            <p>
              Start your learning journey today and achieve your goals with the support of
              world-class instructors.
            </p>
          </div>
          <button className="tcta-btn">
            Get Started Now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
