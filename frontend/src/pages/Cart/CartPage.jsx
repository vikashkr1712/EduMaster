import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import { useCart } from '../../components/Cart/CartProvider.jsx'
import CartItem from '../../components/Cart/CartItem.jsx'
import CartSummary from '../../components/Cart/CartSummary.jsx'
import CartEmpty from '../../components/Cart/CartEmpty.jsx'
import CartSkeleton from '../../components/Cart/CartSkeleton.jsx'
import CartRecommendations from '../../components/Cart/CartRecommendations.jsx'
import './CartPage.css'

export default function CartPage() {
  const { items, count, isLoading } = useCart()

  return (
    <>
      <Navbar />

      <div className="cart-breadcrumb-bar">
        <div className="container cart-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span className="cart-bc-current">Shopping Cart</span>
        </div>
      </div>

      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-page-title">Shopping Cart</h1>
            {count > 0 && (
              <span className="cart-count-badge">
                {count} {count === 1 ? 'Course' : 'Courses'}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="cart-layout">
              <div className="cart-main"><CartSkeleton /></div>
            </div>
          ) : count === 0 ? (
            <CartEmpty />
          ) : (
            <div className="cart-layout">
              <main className="cart-main">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={item._id ?? item.course?._id}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              </main>
              <aside className="cart-sidebar">
                <div className="cart-sidebar-sticky">
                  <CartSummary />
                </div>
              </aside>
            </div>
          )}

          <CartRecommendations />
        </div>
      </div>

      <Footer />
    </>
  )
}
