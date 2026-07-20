import './TestimonialCarousel.css'
import Avatar from '../../../assets/svg/common/Avatar.jsx'

function ChatBadgeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8z"
        fill="#2563EB"
      />
      <circle cx="9" cy="9.5" r="1.2" fill="#fff" />
      <circle cx="12.5" cy="9.5" r="1.2" fill="#fff" />
      <circle cx="16" cy="9.5" r="1.2" fill="#fff" />
    </svg>
  )
}

function QuoteMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563EB">
      <path d="M4 12c0-4 2.5-7 6.5-8l.8 1.8C8.6 7 7.4 8.6 7.2 10.5c.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4C5.5 17 4 15 4 12zm10 0c0-4 2.5-7 6.5-8l.8 1.8c-2.7 1.2-3.9 2.8-4.1 4.7.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4-2.5 0-4-2-4-5z" />
    </svg>
  )
}

function StarRow() {
  return (
    <div className="tc-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24">
          <path
            d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
            fill="#F9B233"
          />
        </svg>
      ))}
    </div>
  )
}

function ArrowNav({ dir }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="#1B2B4B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const reviews = [
  {
    text: 'The courses are well-structured and the instructors explain concepts so clearly. I got placed as a Software Developer!',
    name: 'Rahul Verma',
    role: 'Software Developer,',
    company: 'TCS',
    avatar: 'm2',
  },
  {
    text: 'The hands-on projects and doubt support helped me master Full Stack Development. Highly recommended!',
    name: 'Priya Mehta',
    role: 'Full Stack Developer,',
    company: 'Infosys',
    avatar: 'f1',
  },
  {
    text: 'Great platform for upskilling! The content is practical and very industry-relevant.',
    name: 'Aman Singh',
    role: 'Frontend Developer,',
    company: 'Wipro',
    avatar: 'm4',
  },
  {
    text: 'I transitioned from a non-tech background to a Data Analyst. Thank you for the amazing support!',
    name: 'Neha Sharma',
    role: 'Data Analyst,',
    company: 'Accenture',
    avatar: 'f2',
  },
]

export default function TestimonialCarousel() {
  return (
    <section className="tcarousel">
      <div className="container">
        <div className="tcarousel-head">
          <span className="section-badge">
            <ChatBadgeIcon /> Testimonials
          </span>
          <h2 className="section-title">
            Loved by <span className="hl-underline">Learners</span> Worldwide
          </h2>
          <p className="section-sub">Real stories from real learners who transformed their careers.</p>
        </div>

        <div className="tcarousel-slider">
          <button className="tcarousel-arrow tcarousel-arrow-left" aria-label="Previous testimonials">
            <ArrowNav dir="left" />
          </button>

          <div className="tcarousel-grid">
            {reviews.map((r) => (
              <article className="tc-card" key={r.name}>
                <div className="tc-topline">
                  <StarRow />
                  <QuoteMark />
                </div>
                <p className="tc-text">{r.text}</p>
                <div className="tc-person">
                  <Avatar variant={r.avatar} size={44} />
                  <div>
                    <span className="tc-name">{r.name}</span>
                    <span className="tc-role">
                      {r.role}
                      <br />
                      {r.company}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button className="tcarousel-arrow tcarousel-arrow-right" aria-label="Next testimonials">
            <ArrowNav dir="right" />
          </button>
        </div>

        <div className="tcarousel-dots">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </section>
  )
}
