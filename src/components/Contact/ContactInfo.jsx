import './ContactInfo.css'
import MailIconSvg from '../../assets/svg/contact/MailIconSvg.jsx'
import PhoneIconSvg from '../../assets/svg/contact/PhoneIconSvg.jsx'
import VisitPinIconSvg from '../../assets/svg/contact/VisitPinIconSvg.jsx'
import ClockIconSvg from '../../assets/svg/contact/ClockIconSvg.jsx'
import { contactCards } from '../../data/contactData.js'

const cardIcons = {
  mail: <MailIconSvg />,
  phone: <PhoneIconSvg />,
  pin: <VisitPinIconSvg />,
  clock: <ClockIconSvg />,
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.5 2.5L10.8 13.2M21.5 2.5l-6.8 19-3.9-8.3-8.3-3.9 19-6.8z"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ContactInfo() {
  return (
    <section className="cinfo">
      <div className="container cinfo-inner">
        <div className="cinfo-left">
          <h2 className="cinfo-title">
            Get in <span>Touch</span>
          </h2>
          <p className="cinfo-subtitle">Choose the best way to reach us. We&rsquo;re here to assist you!</p>

          <div className="cinfo-cards">
            {contactCards.map((card) => (
              <div className={`cinfo-card cinfo-card-${card.tint}`} key={card.id}>
                <span className="cinfo-card-icon">{cardIcons[card.icon]}</span>
                <div className="cinfo-card-body">
                  <h3>{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cinfo-form-card">
          <h2 className="cinfo-form-title">Send Us a Message</h2>
          <p className="cinfo-form-subtitle">
            Fill out the form below and we&rsquo;ll get back to you as soon as possible.
          </p>

          <form className="cinfo-form" onSubmit={(e) => e.preventDefault()}>
            <div className="cinfo-form-row">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <input type="text" name="subject" placeholder="Subject" required />
            <textarea name="message" placeholder="Your Message" rows="5" required />
            <button type="submit" className="cinfo-form-btn">
              Send Message
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
