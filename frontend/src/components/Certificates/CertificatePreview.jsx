function SealIcon() {
  return (
    <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
      <path d="M11 24h5v14l-2.5-2.5L11 38Z" fill="#2563eb" />
      <path d="M18 24h5v14l-2.5-2.5L18 38Z" fill="#1b2b4b" />
      <circle cx="17" cy="15" r="12" fill="currentColor" />
      <circle cx="17" cy="15" r="8.5" fill="#fff" opacity="0.25" />
      <path d="m17 9.5 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z" fill="#fff" />
    </svg>
  )
}

function RibbonIcon() {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
      <path d="M0 0h30v34l-15-8-15 8Z" fill="currentColor" />
      <path d="m10 12 3.4 3.4L21 8.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Miniature rendered certificate shown at the top of each certificate card
export default function CertificatePreview({ variant, name, course, instructor }) {
  return (
    <div className={`cert-preview cert-preview--${variant}`}>
      <span className="cert-preview-ribbon"><RibbonIcon /></span>
      <div className="cert-preview-frame">
        <p className="cert-preview-brand">EDUMASTER</p>
        <p className="cert-preview-heading">Certificate of Completion</p>
        <p className="cert-preview-name">{name}</p>
        <p className="cert-preview-for">For successfully completing</p>
        <p className="cert-preview-course">{course}</p>
        <div className="cert-preview-footer">
          <div className="cert-preview-sign">
            <span className="cert-preview-signature">{instructor}</span>
            <span className="cert-preview-role">Instructor</span>
          </div>
          <span className="cert-preview-seal"><SealIcon /></span>
        </div>
      </div>
    </div>
  )
}
