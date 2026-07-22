import './ServicesHero.css'
import ServicesHeroSvg from '../../assets/svg/services/ServicesHeroSvg.jsx'

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

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.9" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

export default function ServicesHero() {
  return (
    <section className="shero">
      <div className="container shero-inner">
        <div className="shero-content">
          <span className="shero-badge">Our Services</span>

          <h1 className="shero-title">
            Empowering Your
            <br />
            <span>Learning</span> Beyond
            <br />
            Traditional Education
          </h1>

          <p className="shero-text">
            At EduMaster, we provide a complete ecosystem of learning services designed to help
            you achieve your goals and advance your career.
          </p>

          <div className="shero-actions">
            <button className="shero-btn-explore">
              Explore Services
              <ArrowIcon />
            </button>
            <button className="shero-btn-consult">
              <CalendarIcon />
              Book Free Consultation
            </button>
          </div>
        </div>

        <div className="shero-illustration">
          <ServicesHeroSvg />
        </div>
      </div>
    </section>
  )
}
