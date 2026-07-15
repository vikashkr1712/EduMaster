import './Footer.css'

function FooterLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 46 46" fill="none">
      <path d="M23 6 L41 14 L23 22 L5 14 Z" fill="#F9B233" />
      <path d="M23 17 L37 23 L23 29 L9 23 Z" fill="#FFFFFF" />
      <path d="M23 26 L34 30.5 L23 35 L12 30.5 Z" fill="#2563EB" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.6v3H11v7h2.5z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M21 6.3c-.7.3-1.4.5-2.1.6.8-.5 1.4-1.2 1.6-2-.7.4-1.5.7-2.4.9-.7-.7-1.7-1.2-2.8-1.2-2.1 0-3.8 1.7-3.8 3.8 0 .3 0 .6.1.9-3.2-.2-6-1.7-7.9-4-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.7-1.3 1-3 1.6-4.8 1.6-.3 0-.6 0-.9-.1 1.7 1.1 3.7 1.7 5.9 1.7 7.1 0 10.9-5.9 10.9-10.9v-.5c.8-.5 1.4-1.2 1.9-2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M6.5 8.5H3.9V21h2.6V8.5zM5.2 7.4c.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6-.9 0-1.6.7-1.6 1.6 0 .9.7 1.6 1.6 1.6zM21 13.9c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5 1-2.9 1.6V8.5h-2.6V21h2.6v-6.6c0-1.2.2-2.3 1.7-2.3 1.4 0 1.4 1.4 1.4 2.4V21H20l1-7.1z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" stroke="none" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z" />
    </svg>
  )
}

const quickLinks = ['Home', 'Courses', 'Programs', 'About Us', 'Contact Us']
const categories = ['Development', 'Data Science', 'Design', 'Business', 'Marketing']
const resources = ['Blog', 'Help Center', 'FAQs', 'Privacy Policy', 'Terms & Conditions']

const socials = [
  { label: 'Facebook', icon: <FacebookIcon /> },
  { label: 'Twitter', icon: <TwitterIcon /> },
  { label: 'LinkedIn', icon: <LinkedInIcon /> },
  { label: 'Instagram', icon: <InstagramIcon /> },
  { label: 'YouTube', icon: <YoutubeIcon /> },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <FooterLogo />
              <span className="footer-logo-text">
                Edu<span>Master</span>
              </span>
            </a>
            <p className="footer-desc">
              Empowering learners worldwide with quality education and industry-relevant skills to
              build better careers.
            </p>
            <div className="footer-socials">
              {socials.map((s) => (
                <a href="#" key={s.label} aria-label={s.label} className="footer-social">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              {categories.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              {resources.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Subscribe to Our Newsletter</h4>
            <p>Get the latest updates on new courses and offers.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">© 2024 EduMaster. All rights reserved.</div>
      </div>
    </footer>
  )
}
