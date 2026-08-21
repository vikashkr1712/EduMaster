import { useState } from 'react'
import './ServicesFAQ.css'
import { servicesFaqs } from '../../data/servicesData.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.5l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ServicesFAQ() {
  const [openId, setOpenId] = useState(null)
  const reducedMotion = useReducedMotion()

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <section className="sfaq">
      <div className="container">
        <motion.div className="sfaq-head" initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5 }}>
          <span className="sfaq-badge">FAQs</span>
          <h2 className="sfaq-title">Frequently Asked Questions</h2>
        </motion.div>

        <motion.div className="sfaq-grid" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.2 }} variants={stagger(0.06)}>
          {[0, 1].map((col) => (
            <div className="sfaq-col" key={col}>
              {servicesFaqs.map((item, index) => {
                if (index % 2 !== col) return null
                const open = openId === item.id
                return (
                  <motion.div className={`sfaq-item${open ? ' is-open' : ''}`} key={item.id} style={{ order: index }} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.45 }}>
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
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
