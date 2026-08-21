import './JoinCTA.css'
import { useNavigate } from 'react-router-dom'
import TrophyIllustration from '../../../assets/svg/common/TrophyIllustration.jsx'

export default function JoinCTA() {
  const navigate = useNavigate()
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
          <button className="btn-getstarted" onClick={() => navigate('/signup')}>
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
