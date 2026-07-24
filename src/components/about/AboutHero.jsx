import AboutHeroIllustration from '../../assets/svg/about/AboutHeroIllustration.jsx'

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

export default function AboutHero() {
  return (
    <section className="ahero">
      <div className="container ahero-inner">
        <span className="ahero-badge">About Us</span>

        <h1 className="ahero-title">
          Empowering Learners
          <br />
          To Build <span>Better Futures</span>
        </h1>

        <p className="ahero-text">
          At EduMaster, we believe education is the key to unlocking potential and creating
          opportunities. Our mission is to make high-quality learning accessible to everyone,
          everywhere.
        </p>

        <div className="ahero-actions">
          <button className="ahero-btn">
            Our Events
            <ArrowIcon />
          </button>
        </div>

        <div className="ahero-illustration">
          <AboutHeroIllustration className="svg-about-hero-inline" />
        </div>
      </div>
    </section>
  )
}
