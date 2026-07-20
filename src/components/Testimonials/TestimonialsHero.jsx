import './TestimonialsHero.css'
import TestimonialsHeroIllustration from '../../assets/svg/testimonials/TestimonialsHeroIllustration.jsx'

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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1B2B4B" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#fff" />
    </svg>
  )
}

export default function TestimonialsHero() {
  return (
    <section className="thero">
      <div className="container thero-inner">
        <span className="thero-badge">What Our Learners Say</span>

        <h1 className="thero-title">
          Trusted by Learners
          <br />
          <span>Worldwide</span>
        </h1>

        <p className="thero-text">
          See how EduMaster has helped thousands of students achieve their goals and advance
          their careers.
        </p>

        <div className="thero-actions">
          <button className="thero-btn-explore">
            Explore Courses
            <ArrowIcon />
          </button>
          <button className="thero-btn-video">
            <PlayCircleIcon />
            Watch Video
          </button>
        </div>

        <div className="thero-illustration">
          <TestimonialsHeroIllustration />
        </div>
      </div>
    </section>
  )
}
