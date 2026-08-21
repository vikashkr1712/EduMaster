import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import OrderSuccessHero from '../../components/Order/OrderSuccessHero.jsx'
import EmailConfirmation from '../../components/Order/EmailConfirmation.jsx'
import OrderSummaryCard from '../../components/Order/OrderSummaryCard.jsx'
import SupportCard from '../../components/Order/SupportCard.jsx'
import { getOrder } from '../../api/order.js'
import './OrderSuccessPage.css'

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (order) return
    const orderId = sessionStorage.getItem('edumaster:last-order-id')
    if (!orderId) {
      setLoadError('No completed order was found for this session.')
      setLoading(false)
      return
    }

    let active = true
    getOrder(orderId)
      .then((response) => {
        if (active) setOrder(response?.data?.order || null)
      })
      .catch((error) => {
        if (active) setLoadError(error.message || 'We could not load your order details.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [order])

  const firstCourseId = order?.courses?.[0]?._id || order?.items?.[0]?.course

  return (
    <>
      <Navbar />
      <div className="order-breadcrumb-bar">
        <div className="container order-breadcrumb">
          <Link to="/">Home</Link><span>›</span>
          <Link to="/courses">Courses</Link><span>›</span>
          <span className="order-breadcrumb-current">Order Success</span>
        </div>
      </div>

      <main className="order-success-page">
        <div className="container">
          {loading ? (
            <div className="order-state-card"><span className="order-state-spinner" /><p>Loading your enrollment…</p></div>
          ) : !order || loadError ? (
            <div className="order-state-card">
              <h1>Order details unavailable</h1>
              <p>{loadError || 'We could not load this order.'}</p>
              <Link to="/courses">Continue Shopping</Link>
            </div>
          ) : (
            <div className="order-success-layout">
              <div className="order-success-main">
                <OrderSuccessHero
                  order={order}
                  user={user}
                  onStartLearning={() => navigate(`/learn/${firstCourseId}`)}
                  onMyCourses={() => navigate('/profile/courses')}
                  onContinueShopping={() => navigate('/courses')}
                />
                <EmailConfirmation email={order.billing?.email || user?.email} />
                <p className="order-thank-you">♢ Thank you for choosing EduMaster. Happy Learning!</p>
              </div>
              <aside className="order-success-sidebar">
                <OrderSummaryCard order={order} />
                <SupportCard />
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
