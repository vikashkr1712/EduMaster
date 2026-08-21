import './CoursesSidebar.css'
import { useState } from 'react'
import { categories, levels, priceTypes, ratingOptions } from '../../data/coursesData.js'
import { motion, useReducedMotion } from '../Home/motion.jsx'

function Chevron() {
  return (
    <svg className="cs-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccordionSection({ title, open, onToggle, last, children }) {
  const reducedMotion = useReducedMotion()
  return (
    <div className={`cs-section${last ? ' cs-section-last' : ''}${open ? '' : ' collapsed'}`}>
      <h3 className="cs-title" role="button" tabIndex={0} aria-expanded={open} onClick={onToggle} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}>
        {title}
        <Chevron />
      </h3>
      <motion.div
        className="cs-body"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* --- category icons --- */
function CatIcon({ name }) {
  const stroke = 'currentColor'
  switch (name) {
    case 'All Categories':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" fill={stroke} />
          <rect x="13" y="3" width="8" height="8" rx="2" fill={stroke} opacity="0.55" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill={stroke} opacity="0.55" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill={stroke} />
        </svg>
      )
    case 'Development':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'Data Science':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'Design':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18a3.5 3.5 0 0 0 3-3.9C20.4 6 16.6 3 12 3z" stroke={stroke} strokeWidth="1.8" />
          <circle cx="8" cy="10" r="1.3" fill={stroke} />
          <circle cx="12" cy="7.5" r="1.3" fill={stroke} />
          <circle cx="16" cy="10" r="1.3" fill={stroke} />
        </svg>
      )
    case 'Business':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="13" rx="2.5" stroke={stroke} strokeWidth="1.9" />
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke={stroke} strokeWidth="1.9" />
          <path d="M3 12h18" stroke={stroke} strokeWidth="1.9" />
        </svg>
      )
    case 'Marketing':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M4 13v-2l12-5v12L4 13z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M8 14v4a2 2 0 0 0 4 0v-2M16 9.5a3 3 0 0 1 0 3" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      )
    case 'IT & Software':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="12" rx="2" stroke={stroke} strokeWidth="1.9" />
          <path d="M8 20h8M12 16v4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      )
    case 'Personal Development':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.5" stroke={stroke} strokeWidth="1.9" />
          <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

function Star({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill={filled ? '#F9B233' : '#D8DEE9'}
      />
    </svg>
  )
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="cs-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="cs-check-box" aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M4 12.5 10 18 20 6.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="cs-check-label">{children}</span>
    </label>
  )
}

export default function CoursesSidebar({ filters, setFilters, mobileOpen, onClose }) {
  const [open, setOpen] = useState({ categories: true, level: true, price: true, ratings: true })
  const toggleSection = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }))

  const toggleIn = (key, value) => {
    setFilters((f) => {
      const list = f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value]
      return { ...f, [key]: list }
    })
  }

  return (
    <>
      <div className={`cs-overlay${mobileOpen ? ' show' : ''}`} onClick={onClose} />
      <aside className={`courses-sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="cs-mobile-head">
          <h3>Filters</h3>
          <button className="cs-close" onClick={onClose} aria-label="Close filters">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="#1B2B4B" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <AccordionSection title="Categories" open={open.categories} onToggle={() => toggleSection('categories')}>
          <ul className="cs-cats">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`cs-cat${filters.category === cat ? ' active' : ''}`}
                  onClick={() => setFilters((f) => ({ ...f, category: cat }))}
                >
                  <CatIcon name={cat} />
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </AccordionSection>

        {/* Level */}
        <AccordionSection title="Level" open={open.level} onToggle={() => toggleSection('level')}>
          <Checkbox
            checked={filters.levels.length === 0}
            onChange={() => setFilters((f) => ({ ...f, levels: [] }))}
          >
            All Levels
          </Checkbox>
          {levels.map((lv) => (
            <Checkbox key={lv} checked={filters.levels.includes(lv)} onChange={() => toggleIn('levels', lv)}>
              {lv}
            </Checkbox>
          ))}
        </AccordionSection>

        {/* Price */}
        <AccordionSection title="Price" open={open.price} onToggle={() => toggleSection('price')}>
          <Checkbox
            checked={filters.prices.length === 0}
            onChange={() => setFilters((f) => ({ ...f, prices: [] }))}
          >
            All Prices
          </Checkbox>
          {priceTypes.map((pt) => (
            <Checkbox key={pt} checked={filters.prices.includes(pt)} onChange={() => toggleIn('prices', pt)}>
              {pt}
            </Checkbox>
          ))}
        </AccordionSection>

        {/* Ratings */}
        <AccordionSection title="Ratings" open={open.ratings} onToggle={() => toggleSection('ratings')} last>
          {ratingOptions.map((r) => (
            <Checkbox
              key={r.value}
              checked={filters.ratings.includes(r.value)}
              onChange={() => toggleIn('ratings', r.value)}
            >
              <span className="cs-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} filled={i <= r.stars} />
                ))}
              </span>
              <span className="cs-rating-label">{r.label}</span>
            </Checkbox>
          ))}
        </AccordionSection>
      </aside>
    </>
  )
}
