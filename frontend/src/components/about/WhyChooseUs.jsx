import { whyChooseItems } from '../../data/aboutData.js'
import { motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function CheckCircleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#2563EB" />
      <path
        d="M8 12.2l2.7 2.7 5.3-5.6"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function WhyChooseUs() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.aside className="awhy-card" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ amount: 0.25 }} variants={stagger(0.07)}>
      <motion.h3 className="awhy-title" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>Why Choose EduMaster?</motion.h3>
      <ul className="awhy-list">
        {whyChooseItems.map((item) => (
          <motion.li key={item} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.45 }}>
            <CheckCircleIcon />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  )
}
