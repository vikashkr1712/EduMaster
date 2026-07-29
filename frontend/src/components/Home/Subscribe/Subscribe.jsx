import './Subscribe.css'

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="#fff" />
      <path d="M4 7l8 6 8-6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Subscribe() {
  return (
    <section className="subscribe">
      <div className="container">
        <div className="subscribe-card">
          <div className="subscribe-left">
            <span className="subscribe-icon">
              <MailIcon />
            </span>
            <div>
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for the latest courses and offers.</p>
            </div>
          </div>
          <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn-subscribe">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
