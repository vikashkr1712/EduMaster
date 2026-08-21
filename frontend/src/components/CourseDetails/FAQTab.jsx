import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FAQS = [
  {
    q: 'Is this course suitable for beginners?',
    a: 'Yes! This course starts from the absolute basics and gradually builds up. No prior experience is required to get started.',
  },
  {
    q: 'How long do I have access to the course?',
    a: 'You get lifetime access to all course materials including future updates, so you can learn at your own pace anytime.',
  },
  {
    q: 'Will I receive a certificate upon completion?',
    a: 'Yes, you will receive a verified certificate of completion that you can share on LinkedIn, your resume, or your portfolio.',
  },
  {
    q: 'Can I download the course videos for offline viewing?',
    a: 'Yes, all video lessons are available for download through the EduMaster mobile app so you can learn without internet.',
  },
  {
    q: 'What if I am not satisfied with the course?',
    a: 'We offer a 30-day money-back guarantee. If you are not satisfied for any reason, contact our support team for a full refund.',
  },
  {
    q: 'Does this course include hands-on projects?',
    a: 'Absolutely. The curriculum includes real-world projects and exercises that help you apply what you learn immediately.',
  },
]

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQTab({ course }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="cdp-faq">
      <h3 className="cdp-section-title">Frequently Asked Questions</h3>
      <div className="cdp-faq-list">
        {FAQS.filter((faq) => course.hasCertificate !== false || !faq.q.includes('certificate')).map((faq, i) => (
          <div key={i} className={`cdp-faq-item${openIndex === i ? ' open' : ''}`}>
            <button
              className="cdp-faq-q"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span>{faq.q}</span>
              <ChevronIcon open={openIndex === i} />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  className="cdp-faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <p>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
