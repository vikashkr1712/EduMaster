import { Reveal } from '../Home/motion.jsx'

export default function RequestCourseBanner() {
  return (
    <section className="request-banner-wrap">
      <div className="container">
        <Reveal>
          <div className="request-banner">
          <div className="request-banner-left">
            <span className="request-banner-art" aria-hidden="true">
              <svg width="120" height="86" viewBox="0 0 120 86" fill="none">
                {/* stacked books */}
                <rect x="18" y="58" width="70" height="11" rx="3" fill="#2563EB" />
                <rect x="24" y="47" width="62" height="11" rx="3" fill="#F9B233" />
                <rect x="21" y="36" width="66" height="11" rx="3" fill="#44C76D" />
                {/* graduation cap */}
                <path d="M54 12 88 24 54 36 20 24 Z" fill="#1B2B4B" />
                <path d="M40 29v9c0 4 6.5 7 14 7s14-3 14-7v-9l-14 5-14-5z" fill="#33415C" />
                <path d="M84 26v12" stroke="#F9B233" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="84" cy="41" r="2.6" fill="#F9B233" />
                {/* leaves */}
                <path d="M100 62 q10 -8 6 -18 q-10 6 -6 18" fill="#44C76D" />
                <path d="M104 66 q13 -3 13 -14 q-11 2 -13 14" fill="#2FA95C" />
                <path d="M8 66 q-8 -8 -3 -17 q8 6 3 17" fill="#44C76D" />
                {/* ground line */}
                <rect x="4" y="69" width="112" height="5" rx="2.5" fill="#F0D9A8" />
              </svg>
            </span>
            <div className="request-banner-copy">
              <h2>Can&apos;t find the right course?</h2>
              <p>Request a course and we will notify you when it&apos;s available.</p>
            </div>
          </div>
          <button className="btn-request">
            Request a Course
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
