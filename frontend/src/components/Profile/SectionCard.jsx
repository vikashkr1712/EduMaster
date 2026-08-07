import { Link } from 'react-router-dom'

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}

// White card with a "Title ......... View All →" header, shared by the profile sections.
// Pass linkTo for navigation, or onLinkClick alone for actions without a route yet.
export default function SectionCard({ title, linkLabel, linkTo, onLinkClick, children }) {
  return (
    <section className="profile-section-card">
      <div className="profile-section-head">
        <h3 className="profile-section-title">{title}</h3>
        {linkLabel && (linkTo ? (
          <Link to={linkTo} className="profile-section-link">
            {linkLabel} <ArrowRightIcon />
          </Link>
        ) : (
          <button type="button" className="profile-section-link" onClick={onLinkClick}>
            {linkLabel} <ArrowRightIcon />
          </button>
        ))}
      </div>
      {children}
    </section>
  )
}
