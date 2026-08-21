import { motion } from 'framer-motion'

const TABS = ['Overview', 'Curriculum', 'Instructor', 'Reviews', 'FAQ']

export default function CourseTabs({ active, onChange, reviewCount }) {
  return (
    <div className="cdp-tabs" role="tablist">
      {TABS.map((tab) => {
        const label = tab === 'Reviews' && reviewCount
          ? `Reviews (${reviewCount})`
          : tab
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            className={`cdp-tab${active === tab ? ' active' : ''}`}
            onClick={() => onChange(tab)}
          >
            {label}
            {active === tab && (
              <motion.span
                className="cdp-tab-line"
                layoutId="cdp-tab-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
