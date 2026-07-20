import './Partners.css'

/**
 * Brand-styled partner wordmarks built from text + tiny inline SVG marks.
 * They render grayscale by default and reveal their brand colors on hover.
 */
function GoogleLogo() {
  const letters = [
    ['G', '#4285F4'],
    ['o', '#EA4335'],
    ['o', '#FBBC05'],
    ['g', '#4285F4'],
    ['l', '#34A853'],
    ['e', '#EA4335'],
  ]
  return (
    <span className="partner-logo logo-google" aria-label="Google">
      {letters.map(([ch, color], i) => (
        <span key={i} style={{ color }}>
          {ch}
        </span>
      ))}
    </span>
  )
}

function MicrosoftLogo() {
  return (
    <span className="partner-logo logo-microsoft" aria-label="Microsoft">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <rect x="0" y="0" width="9" height="9" fill="#F25022" />
        <rect x="11" y="0" width="9" height="9" fill="#7FBA00" />
        <rect x="0" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
      Microsoft
    </span>
  )
}

function AmazonLogo() {
  return (
    <span className="partner-logo logo-amazon" aria-label="Amazon">
      <span className="amazon-word">
        amazon
        <svg className="amazon-smile" viewBox="0 0 110 22" aria-hidden="true">
          <path
            d="M4 5 C 32 22, 74 22, 98 9"
            stroke="#FF9900"
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M97 3 l10 -1 -4 10 z" fill="#FF9900" />
        </svg>
      </span>
    </span>
  )
}

function IBMLogo() {
  return (
    <span className="partner-logo logo-ibm" aria-label="IBM">
      IBM
    </span>
  )
}

function DeloitteLogo() {
  return (
    <span className="partner-logo logo-deloitte" aria-label="Deloitte">
      Deloitte
      <span className="deloitte-dot">.</span>
    </span>
  )
}

function AccentureLogo() {
  return (
    <span className="partner-logo logo-accenture" aria-label="Accenture">
      accenture
    </span>
  )
}

const partnerLogos = [
  GoogleLogo,
  MicrosoftLogo,
  AmazonLogo,
  IBMLogo,
  DeloitteLogo,
  AccentureLogo,
]

export default function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <p className="partners-heading">Trusted by Learners &amp; Partners</p>
        <div className="partners-row">
          {partnerLogos.map((Logo, i) => (
            <Logo key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
