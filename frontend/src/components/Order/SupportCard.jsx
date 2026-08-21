import { useNavigate } from 'react-router-dom'

export default function SupportCard() {
  const navigate = useNavigate()
  return (
    <section className="order-side-card order-support-card">
      <h3>Need Help?</h3>
      <p>Our support team is here to help you.</p>
      <a href="mailto:support@edumaster.com">support@edumaster.com</a>
      <div className="order-support-actions">
        <button type="button" onClick={() => navigate('/contact?subject=Order%20support')}>Contact Support</button>
      </div>
    </section>
  )
}
