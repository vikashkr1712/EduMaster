import './JoinCTA.css'
import TrophyIllustration from '../../../svg/TrophyIllustration.jsx'

export default function JoinCTA() {
  return (
    <section className="joincta">
      <div className="container">
        <div className="joincta-card">
          <div className="joincta-trophy">
            <TrophyIllustration />
          </div>
          <div className="joincta-copy">
            <h2>Join Thousands of Successful Learners</h2>
            <p>
              Start your learning journey today and gain the skills you need to achieve your
              dreams.
            </p>
          </div>
          <button className="btn-getstarted">
            Get Started Now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
