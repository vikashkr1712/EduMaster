import './ContactHero.css'
import ContactHeroSvgNew from '../../assets/svg/contact/ContactHeroSvgNew.jsx'
import { heroFeatures } from '../../data/contactData.js'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#2563EB" />
      <path
        d="M7.5 12.2l3 3 6-6.4"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function ContactHero() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="chero">
      <div className="container chero-inner">
        <motion.div className="chero-content" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={stagger(0.09)}>
          <motion.span className="chero-badge" variants={fadeUp} transition={{ duration: 0.5 }}>Contact Us</motion.span>

          <motion.h1 className="chero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            We&rsquo;d Love to
            <br />
            <span>Hear From You!</span>
          </motion.h1>

          <motion.p className="chero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            Have a question, suggestion, or just want to say hello? We&rsquo;re here to help and
            answer any questions you may have.
          </motion.p>

          <motion.ul className="chero-features" variants={stagger(0.08)}>
            {heroFeatures.map((f) => (
              <motion.li key={f} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.45 }}>
                <CheckIcon />
                <span>{f}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div className="chero-illustration" initial={reducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <ContactHeroSvgNew />
        </motion.div>
      </div>
    </section>
  )
}
