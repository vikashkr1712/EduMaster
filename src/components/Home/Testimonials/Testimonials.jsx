import './Testimonials.css'
import Avatar from '../../../svg/Avatar.jsx'

function QuoteIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M4 12c0-4 2.5-7 6.5-8l.8 1.8C8.6 7 7.4 8.6 7.2 10.5c.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4C5.5 17 4 15 4 12zm10 0c0-4 2.5-7 6.5-8l.8 1.8c-2.7 1.2-3.9 2.8-4.1 4.7.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4-2.5 0-4-2-4-5z" />
    </svg>
  )
}

function StarRow() {
  return (
    <div className="t-stars">
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

const testimonials = [
  {
    quoteTint: '#E3ECFF',
    quoteColor: '#2563EB',
    text: 'The Full Stack course helped me go from beginner to getting hired by a top product company. The content and projects are amazing!',
    name: 'Rohit Sharma',
    role: 'Full Stack Developer',
    avatar: 'm1',
  },
  {
    quoteTint: '#DCF7E5',
    quoteColor: '#16A34A',
    text: 'The instructors explain complex topics in such a simple way. I got certified and landed my dream job in just 3 months!',
    name: 'Priya Mehta',
    role: 'Data Analyst',
    avatar: 'f1',
  },
  {
    quoteTint: '#EDE9FE',
    quoteColor: '#8B5CF6',
    text: 'Great platform for learning new skills at your own pace. Highly recommended for anyone serious about their career.',
    name: 'Aman Verma',
    role: 'UI/UX Designer',
    avatar: 'm3',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container testimonials-inner">
        <div className="testimonials-intro">
          <span className="section-badge">Testimonials</span>
          <h2 className="section-title">
            What Our <span className="t-blue hl-underline">Learners</span> Say
          </h2>
          <p className="section-sub">
            Join thousands of students who have transformed their careers with EduMaster.
          </p>
          <div className="testimonials-avatars">
            <div className="t-avatar-row">
              {['m1', 'f1', 'm2', 'f2', 'm4'].map((v, i) => (
                <span className="t-avatar" style={{ zIndex: 10 - i }} key={v}>
                  <Avatar variant={v} size={40} />
                </span>
              ))}
              <span className="t-avatar t-avatar-plus">+</span>
            </div>
            <span className="t-avatar-note">Join 50,000+ happy learners</span>
          </div>
        </div>

        <div className="testimonials-cards">
          {testimonials.map((t) => (
            <article className="t-card" key={t.name}>
              <span className="t-quote" style={{ background: t.quoteTint }}>
                <QuoteIcon color={t.quoteColor} />
              </span>
              <p className="t-text">{t.text}</p>
              <div className="t-footer">
                <div className="t-person">
                  <Avatar variant={t.avatar} size={44} />
                  <div>
                    <span className="t-name">{t.name}</span>
                    <span className="t-role">{t.role}</span>
                  </div>
                </div>
                <StarRow />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
