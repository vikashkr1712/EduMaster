import './HeroSection.css'
import ProgramsHero from '../../svg/ProgramsHero.jsx'

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

function PlayCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#1B2B4B" strokeWidth="1.8" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#1B2B4B" />
    </svg>
  )
}

export default function HeroSection() {
  return (
    <section className="programs-hero">
      <div className="container programs-hero-inner">
        <div className="programs-hero-content">
          <h1 className="programs-hero-title">
            Our Programs
            <br />
            Designed for <span>Your Success</span>
          </h1>

          <p className="programs-hero-text">
            Choose from expertly designed programs that help you master in-demand skills and
            accelerate your career growth.
          </p>

          <div className="programs-hero-actions">
            <button className="programs-btn-explore">
              Explore Programs
              <ArrowIcon />
            </button>
            <button className="programs-btn-how">
              <PlayCircleIcon />
              How It Works
            </button>
          </div>
        </div>

        <div className="programs-hero-illustration">
          <ProgramsHero />
        </div>
      </div>
    </section>
  )
}
