import './AchievementBar.css'
import { CountUp, fadeUp, motion, stagger, useReducedMotion } from '../motion.jsx'

function LearnersIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9.5" cy="8.5" r="3.4" fill="#2563EB" />
      <path d="M3.5 19c0-3.2 2.7-5.3 6-5.3s6 2.1 6 5.3v.8h-12v-.8z" fill="#2563EB" />
      <circle cx="16.8" cy="9" r="2.7" fill="#7CA4F5" />
      <path d="M15.6 14c2.8.4 5 2.3 5 5v.8h-3.4" fill="#7CA4F5" />
    </svg>
  )
}

function BookOpenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 6c-2-1.8-5-2.2-8-2v14c3-.2 6 .2 8 2 2-1.8 5-2.2 8-2V4c-3-.2-6 .2-8 2z" fill="#22C55E" />
      <path d="M12 6v14" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

function GradCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#F9B233" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#F9B233" opacity="0.75" />
      <path d="M21 9v5" stroke="#F9B233" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.6" fill="#8B5CF6" />
      <circle cx="12" cy="9" r="3" fill="#C4B5FD" />
      <path d="M9 13.5L7 21l5-3 5 3-2-7.5" fill="#8B5CF6" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#EC4899" strokeWidth="1.9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9.5" stroke="#EC4899" strokeWidth="1.9" />
      <path d="M2.8 12h18.4M4 7.5h16M4 16.5h16" stroke="#EC4899" strokeWidth="1.9" />
    </svg>
  )
}

const items = [
  { icon: <LearnersIcon />, tint: 'var(--tint-blue)', value: '50,000+', label: 'Active Learners' },
  { icon: <BookOpenIcon />, tint: 'var(--tint-green)', value: '1,200+', label: 'Courses' },
  { icon: <GradCapIcon />, tint: 'var(--tint-orange)', value: '300+', label: 'Expert Instructors' },
  { icon: <MedalIcon />, tint: 'var(--tint-purple)', value: '25,000+', label: 'Certificates Issued' },
  { icon: <GlobeIcon />, tint: 'var(--tint-pink)', value: '100+', label: 'Countries Reached' },
]

export default function AchievementBar() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="achievebar">
      <div className="container">
        <motion.div
          className="achievebar-card"
          initial={reducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger()}
        >
          {items.map((s, i) => (
            <motion.div
              className={`achievebar-item${i > 0 ? ' has-divider' : ''}`}
              key={s.label}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="achievebar-icon" style={{ background: s.tint }}>
                {s.icon}
              </span>
              <div className="achievebar-copy">
                <span className="achievebar-value"><CountUp value={s.value} /></span>
                <span className="achievebar-label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
