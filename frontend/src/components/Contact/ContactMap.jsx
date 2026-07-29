import './ContactMap.css'
import MapIllustrationSvg from '../../assets/svg/contact/MapIllustrationSvg.jsx'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ContactMap() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="cmap">
      <div className="container cmap-inner">
        <motion.div className="cmap-card" initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.25 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <MapIllustrationSvg />
        </motion.div>

        <motion.div className="cmap-content" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.25 }} variants={stagger(0.09)}>
          <motion.span className="cmap-badge" variants={fadeUp} transition={{ duration: 0.5 }}>Our Location</motion.span>
          <motion.h2 className="cmap-title" variants={fadeUp} transition={{ duration: 0.55 }}>
            Visit Our <span>Learning Center</span>
          </motion.h2>
          <motion.p className="cmap-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            We&rsquo;d love to meet you in person and show you around our learning environment.
          </motion.p>
          <motion.button className="cmap-btn" variants={fadeUp} transition={{ duration: 0.5 }}>
            View on Map
            <ExternalLinkIcon />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
