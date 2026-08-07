import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import '../../components/Help/Help.css'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
)

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-5 4Z" />
    <path d="M8 9.5h8M8 12.8h5" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
    <path d="M5 4.5h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} strokeWidth="2">
    <path d="M6 9.5l6 6 6-6" />
  </svg>
)

const contactOptions = (onChat) => [
  {
    id: 'email',
    icon: <MailIcon />,
    tint: 'blue',
    title: 'Email Support',
    desc: 'Get a response within 24 hours.',
    cta: <a className="help-contact-btn" href="mailto:support@edumaster.com">Send Email</a>,
  },
  {
    id: 'chat',
    icon: <ChatIcon />,
    tint: 'green',
    title: 'Live Chat',
    desc: 'Mon–Sat, 9 AM – 7 PM IST.',
    cta: <button type="button" className="help-contact-btn" onClick={onChat}>Start Chat</button>,
  },
  {
    id: 'phone',
    icon: <PhoneIcon />,
    tint: 'purple',
    title: 'Call Us',
    desc: '+91 98765 43210',
    cta: <a className="help-contact-btn" href="tel:+919876543210">Call Now</a>,
  },
]

const FAQS = [
  {
    q: 'How do I download my certificate?',
    a: 'Go to My Certificates in your dashboard to view earned certificates. Downloadable certificate files will be available in a future update.',
  },
  {
    q: 'How do I continue a course I already started?',
    a: 'Open My Courses from the sidebar and click Continue Learning on any in-progress course. Your progress is saved automatically as you complete lessons.',
  },
  {
    q: 'Can I get a refund for a course?',
    a: 'Yes — courses are eligible for a full refund within 7 days of purchase if you have completed less than 20% of the content. Contact support with your order ID to request one.',
  },
  {
    q: 'How do I update my payment method?',
    a: 'Open Payment Methods in your dashboard to add a new card or manage existing ones. Your saved cards are stored securely and can be removed at any time.',
  },
  {
    q: 'How do I change my password?',
    a: 'Password changes are not available yet. Please contact support if you need help accessing your account.',
  },
]

function FaqItem({ faq, index, open, onToggle }) {
  return (
    <div className={`help-faq-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="help-faq-question"
        aria-expanded={open}
        aria-controls={`faq-answer-${index}`}
        onClick={onToggle}
      >
        {faq.q}
        <span className="help-faq-chevron"><ChevronIcon /></span>
      </button>
      <div id={`faq-answer-${index}`} className="help-faq-answer" hidden={!open}>
        <p>{faq.a}</p>
      </div>
    </div>
  )
}

export default function HelpSupportPage() {
  const { info } = useNotifications()
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const visibleFaqs = FAQS.filter((faq) =>
    faq.q.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Help & Support"
        subtitle="Find answers or get in touch with our support team."
      />
      <DashboardContent>
        {/* contact options — max 3 per row */}
        <div className="help-contact-grid">
          {contactOptions(() => info('Live chat is coming soon. Please use email or phone support.')).map(({ id, icon, tint, title, desc, cta }) => (
            <div key={id} className="help-contact-card">
              <span className={`profile-tile profile-tile--${tint}`}>{icon}</span>
              <h4 className="help-contact-title">{title}</h4>
              <p className="help-contact-desc">{desc}</p>
              {cta}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section className="profile-section-card">
          <div className="profile-section-head profile-section-head--stacked">
            <h3 className="profile-section-title">Frequently Asked Questions</h3>
            <p className="profile-section-subtitle">
              Quick answers to the most common questions.
            </p>
          </div>

          <div className="help-search">
            <span className="help-search-icon"><SearchIcon /></span>
            <input
              type="search"
              className="help-search-input"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search frequently asked questions"
            />
          </div>

          {visibleFaqs.length > 0 ? (
            <div className="help-faq-list">
              {visibleFaqs.map((faq, index) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  index={index}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>
          ) : (
            <p className="help-faq-none">No questions match your search.</p>
          )}
        </section>

        {/* still need help banner */}
        <div className="help-banner">
          <div className="help-banner-text">
            <h4 className="help-banner-title">Still need help?</h4>
            <p className="help-banner-desc">
              Our support team is here to help you with anything else.
            </p>
          </div>
          <Link to="/contact" className="help-banner-btn">Contact Support</Link>
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
