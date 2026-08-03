import './PricingSection.css'
import { useNavigate } from 'react-router-dom'
import { pricingPlans } from '../../data/servicesData.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#2563EB" strokeWidth="1.8" />
      <path d="M8.4 12.2l2.4 2.4 4.8-5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PricingSection() {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()

  return (
    <section className="spricing">
      <div className="container">
        <motion.div className="spricing-head" initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5 }}>
          <span className="spricing-badge">Service Packages</span>
        </motion.div>

        <motion.div className="spricing-grid" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.2 }} variants={stagger(0.12)}>
          {pricingPlans.map((plan) => (
            <motion.article
              className={`splan${plan.highlighted ? ' splan-highlighted' : ''}`}
              key={plan.id}
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {plan.highlighted && <span className="splan-ribbon">{plan.ribbon}</span>}
              <h3 className="splan-name">{plan.name}</h3>
              <p className="splan-tagline">{plan.tagline}</p>
              <div className="splan-price">
                {plan.price}
                <span>{plan.period}</span>
              </div>
              <ul className="splan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`splan-btn${plan.highlighted ? ' splan-btn-primary' : ''}`} onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
