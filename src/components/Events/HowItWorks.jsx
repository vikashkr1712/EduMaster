import './HowItWorks.css'
import { howItWorksSteps } from '../../data/eventsData.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function BrowseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M8 9h8M8 13h5" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function EnrollIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="#22C55E" strokeWidth="1.9" />
      <path d="M3.5 10h17" stroke="#22C55E" strokeWidth="1.9" />
      <path d="M7 15h4" stroke="#22C55E" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function LearnIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#F97316" strokeWidth="1.9" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#F97316" />
    </svg>
  )
}

function CertifiedIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.4" stroke="#8B5CF6" strokeWidth="1.9" />
      <circle cx="12" cy="9" r="2.2" fill="#8B5CF6" />
      <path
        d="M9.2 13.5L7.5 20.5l4.5-2.6 4.5 2.6-1.7-7"
        stroke="#8B5CF6"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ICONS = {
  '01': <BrowseIcon />,
  '02': <EnrollIcon />,
  '03': <LearnIcon />,
  '04': <CertifiedIcon />,
}

export default function HowItWorks() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="how-it-works">
      <div className="container">
        <motion.div className="how-it-works-head" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55 }}>
          <span className="how-it-works-badge">HOW IT WORKS</span>
          <h2 className="how-it-works-title">
            Simple Steps to <span>Get</span> Started
          </h2>
        </motion.div>

        <motion.div className="how-it-works-steps" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger(0.14)}>
          {howItWorksSteps.map((step, i) => (
            <motion.div className="hiw-step" key={step.number} variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <div className="hiw-step-top">
                <motion.span className="hiw-step-icon" style={{ background: step.tint }} variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                  {ICONS[step.number]}
                </motion.span>
                {i < howItWorksSteps.length - 1 && (
                  <motion.span
                    className="hiw-connector"
                    aria-hidden="true"
                    style={{ originX: 0 }}
                    variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </div>
              <span className="hiw-step-number">{step.number}</span>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-text">{step.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
