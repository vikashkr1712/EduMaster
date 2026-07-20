import { whyChooseItems } from '../../data/aboutData.js'

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
  return (
    <aside className="awhy-card">
      <h3 className="awhy-title">Why Choose EduMaster?</h3>
      <ul className="awhy-list">
        {whyChooseItems.map((item) => (
          <li key={item}>
            <CheckCircleIcon />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
