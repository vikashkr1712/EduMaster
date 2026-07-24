import './CTA.css'
import { motion, useReducedMotion } from '../motion.jsx'

function CTAIllustration() {
  return (
    <svg width="120" height="86" viewBox="0 0 140 100" fill="none" aria-hidden="true">
      {/* books stack */}
      <rect x="24" y="66" width="64" height="14" rx="4" fill="#2D5BCE" />
      <rect x="28" y="52" width="58" height="14" rx="4" fill="#44C76D" />
      <rect x="32" y="38" width="52" height="14" rx="4" fill="#F8B400" />
      {/* graduation cap */}
      <path d="M58 18 l30 11 -30 11 -30 -11 z" fill="#F9B233" />
      <path d="M42 34 v10 q16 9 32 0 v-10 l-16 6 z" fill="#FFD34E" opacity="0.9" />
      <path d="M86 30 v14" stroke="#F9B233" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="86" cy="47" r="3" fill="#F9B233" />
      {/* sparkles */}
      <circle cx="112" cy="26" r="3.4" fill="#F9B233" opacity="0.9" />
      <path d="M116 66 l5 5 M121 66 l-5 5" stroke="#7CA4F5" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="30" r="2.6" fill="#7CA4F5" />
    </svg>
  )
}

export default function CTA() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="cta">
      <div className="container">
        <motion.div className="cta-banner" initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          {/* background curves */}
          <svg className="cta-bg" viewBox="0 0 1240 140" preserveAspectRatio="none" aria-hidden="true">
            <path d="M900 140 Q 1060 40 1240 90 L1240 140 Z" fill="#FFFFFF" opacity="0.05" />
            <path d="M980 140 Q 1120 70 1240 120 L1240 140 Z" fill="#FFFFFF" opacity="0.05" />
            <circle cx="80" cy="120" r="60" fill="#FFFFFF" opacity="0.04" />
          </svg>

          <div className="cta-left">
            <CTAIllustration />
            <div className="cta-copy">
              <h2>Ready to Start Your Learning Journey?</h2>
              <p>Join thousands of learners and take the first step towards your dream career.</p>
            </div>
          </div>
          <button className="btn-startlearning">
            Start Learning Now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="#1B2B4B"
                strokeWidth="2.4"
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
