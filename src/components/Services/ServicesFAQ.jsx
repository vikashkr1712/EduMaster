import { useState } from 'react'
import './ServicesFAQ.css'
import { servicesFaqs } from '../../data/servicesData.js'

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.5l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ServicesFAQ() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <section className="sfaq">
      <div className="container">
        <div className="sfaq-head">
          <span className="sfaq-badge">FAQs</span>
          <h2 className="sfaq-title">Frequently Asked Questions</h2>
        </div>

        <div className="sfaq-grid">
          {servicesFaqs.map((item) => {
            const open = openId === item.id
            return (
              <div className={`sfaq-item${open ? ' is-open' : ''}`} key={item.id}>
                <button
                  className="sfaq-question"
                  aria-expanded={open}
                  onClick={() => toggle(item.id)}
                >
                  {item.q}
                  <span className="sfaq-chevron">
                    <ChevronIcon />
                  </span>
                </button>
                <div className="sfaq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
