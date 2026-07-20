import './ContactHero.css'
import ContactHeroSvgNew from '../../assets/svg/contact/ContactHeroSvgNew.jsx'
import { heroFeatures } from '../../data/contactData.js'

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
  return (
    <section className="chero">
      <div className="container chero-inner">
        <div className="chero-content">
          <span className="chero-badge">Contact Us</span>

          <h1 className="chero-title">
            We&rsquo;d Love to
            <br />
            <span>Hear From You!</span>
          </h1>

          <p className="chero-text">
            Have a question, suggestion, or just want to say hello? We&rsquo;re here to help and
            answer any questions you may have.
          </p>

          <ul className="chero-features">
            {heroFeatures.map((f) => (
              <li key={f}>
                <CheckIcon />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="chero-illustration">
          <ContactHeroSvgNew />
        </div>
      </div>
    </section>
  )
}
