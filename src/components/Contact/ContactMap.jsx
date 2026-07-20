import './ContactMap.css'
import MapIllustrationSvg from '../../assets/svg/contact/MapIllustrationSvg.jsx'

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ContactMap() {
  return (
    <section className="cmap">
      <div className="container cmap-inner">
        <div className="cmap-card">
          <MapIllustrationSvg />
        </div>

        <div className="cmap-content">
          <span className="cmap-badge">Our Location</span>
          <h2 className="cmap-title">
            Visit Our <span>Learning Center</span>
          </h2>
          <p className="cmap-text">
            We&rsquo;d love to meet you in person and show you around our learning environment.
          </p>
          <button className="cmap-btn">
            View on Map
            <ExternalLinkIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
