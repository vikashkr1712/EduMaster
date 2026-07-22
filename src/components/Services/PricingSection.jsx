import './PricingSection.css'
import { pricingPlans } from '../../data/servicesData.js'

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#2563EB" strokeWidth="1.8" />
      <path d="M8.4 12.2l2.4 2.4 4.8-5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PricingSection() {
  return (
    <section className="spricing">
      <div className="container">
        <div className="spricing-head">
          <span className="spricing-badge">Service Packages</span>
        </div>

        <div className="spricing-grid">
          {pricingPlans.map((plan) => (
            <article
              className={`splan${plan.highlighted ? ' splan-highlighted' : ''}`}
              key={plan.id}
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
              <button className={`splan-btn${plan.highlighted ? ' splan-btn-primary' : ''}`}>
                Get Started
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
