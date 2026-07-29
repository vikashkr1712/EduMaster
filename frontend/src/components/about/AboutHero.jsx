import AboutHeroIllustration from '../../assets/svg/about/AboutHeroIllustration.jsx'
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

export default function AboutHero() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="ahero">
      <motion.div className="container ahero-inner" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={stagger(0.09)}>
        <motion.span className="ahero-badge" variants={fadeUp} transition={{ duration: 0.5 }}>About Us</motion.span>

        <motion.h1 className="ahero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          Empowering Learners
          <br />
          To Build <span>Better Futures</span>
        </motion.h1>

        <motion.p className="ahero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
          At EduMaster, we believe education is the key to unlocking potential and creating
          opportunities. Our mission is to make high-quality learning accessible to everyone,
          everywhere.
        </motion.p>

        <motion.div className="ahero-actions" variants={fadeUp} transition={{ duration: 0.5 }}>
          <button className="ahero-btn">
            Our Events
            <ArrowIcon />
          </button>
        </motion.div>

        <motion.div className="ahero-illustration" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <AboutHeroIllustration className="svg-about-hero-inline" />
        </motion.div>
      </motion.div>
    </section>
  )
}
