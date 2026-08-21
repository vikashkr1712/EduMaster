import { motion } from 'framer-motion'

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L19 7" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariant = { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }

export default function OverviewTab({ course }) {
  const price = Number(course.price) || 0
  const rawDiscount = Number(course.discountPrice)
  const effectivePrice = (Number.isFinite(rawDiscount) && rawDiscount > 0 ? rawDiscount : price)
  const isFree = course.priceType === 'Free' || effectivePrice === 0

  const outcomes = [
    'Understand the core concepts from scratch',
    'Apply knowledge to real-world scenarios',
    'Build hands-on projects to solidify your skills',
    'Gain confidence to work on independent projects',
    'Learn industry-standard tools and best practices',
    `Master ${course.category || 'this subject'} at the ${(course.level || 'beginner').toLowerCase()} level`,
  ]

  const requirements = [
    'A computer with internet access',
    'No prior experience needed — just a willingness to learn',
    'Basic computer literacy is helpful but not required',
  ]

  const infoRows = [
    { label: 'Level', value: course.level || 'Beginner' },
    { label: 'Total Students', value: course.students || 'N/A' },
    { label: 'Language', value: course.language || 'English' },
    { label: 'Last Updated', value: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recent' },
    { label: 'Certificate', value: course.hasCertificate !== false ? 'Yes' : 'No' },
  ]

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <div className="cdp-overview">
      <div className="cdp-overview-main">
        <section className="cdp-ov-section">
          <h3 className="cdp-section-title">About This Course</h3>
          <p className="cdp-ov-about">{course.description || course.shortDescription || 'This course covers everything you need to know to get started.'}</p>
        </section>

        <section className="cdp-ov-section">
          <h3 className="cdp-section-title">What You'll Learn</h3>
          <motion.ul className="cdp-ov-list" variants={listVariants} initial="hidden" animate="visible">
            {outcomes.map((item, i) => (
              <motion.li key={i} variants={itemVariant} className="cdp-ov-list-item">
                <CheckIcon />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section className="cdp-ov-section">
          <h3 className="cdp-section-title">Requirements</h3>
          <ul className="cdp-ov-req-list">
            {requirements.map((req, i) => (
              <li key={i} className="cdp-ov-req-item">· {req}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="cdp-ov-info-card">
        {infoRows.map(({ label, value }) => (
          <div key={label} className="cdp-ov-info-row">
            <span className="cdp-ov-info-label">{label}</span>
            <span className="cdp-ov-info-value">{value}</span>
          </div>
        ))}
        <div className="cdp-ov-info-row cdp-ov-share-row">
          <span className="cdp-ov-info-label"><ShareIcon /> Share</span>
          <div className="cdp-ov-share-icons">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="cdp-share-btn" aria-label="Share on Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="cdp-share-btn" aria-label="Share on Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1da1f2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="cdp-share-btn" aria-label="Share on LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <button className="cdp-share-btn" onClick={copyLink} aria-label="Copy link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a6b87" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
