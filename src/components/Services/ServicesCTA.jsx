import './ServicesCTA.css'
import TrophyIllustration from '../../assets/svg/common/TrophyIllustration.jsx'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="#1B2B4B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ServicesCTA() {
  return (
    <section className="scta">
      <div className="container">
        <div className="scta-banner">
          <div className="scta-illustration">
            <TrophyIllustration />
          </div>

          <div className="scta-copy">
            <h2 className="scta-title">
              Ready To Transform
              <br />
              Your Learning Journey?
            </h2>
            <p className="scta-text">
              Join thousands of learners and take the first step towards your dream career.
            </p>
          </div>

          <button className="scta-btn">
            Get Started Today
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
