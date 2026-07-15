import './Partners.css'

/**
 * Grayscale text-based partner wordmarks. Each is styled to echo the brand's
 * general typographic feel while staying a simple gray text treatment.
 */
function MicrosoftMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <rect x="0" y="0" width="9" height="9" fill="#9CA3AF" />
      <rect x="11" y="0" width="9" height="9" fill="#9CA3AF" />
      <rect x="0" y="11" width="9" height="9" fill="#9CA3AF" />
      <rect x="11" y="11" width="9" height="9" fill="#9CA3AF" />
    </svg>
  )
}

const partners = [
  { name: 'Google', className: 'logo-google' },
  { name: 'Microsoft', className: 'logo-microsoft', mark: <MicrosoftMark /> },
  { name: 'amazon', className: 'logo-amazon' },
  { name: 'IBM', className: 'logo-ibm' },
  { name: 'Deloitte.', className: 'logo-deloitte' },
  { name: 'accenture', className: 'logo-accenture' },
]

export default function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <p className="partners-heading">Trusted by Learners &amp; Partners</p>
        <div className="partners-row">
          {partners.map((p) => (
            <span className={`partner-logo ${p.className}`} key={p.name}>
              {p.mark}
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
