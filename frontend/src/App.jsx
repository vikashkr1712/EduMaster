import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionProvider } from './components/Home/motion.jsx'
import Home from './pages/Home/Home.jsx'
import CoursesPage from './pages/Courses/CoursesPage.jsx'
import EventsPage from './pages/Events/EventsPage.jsx'
import ServicesPage from './pages/Services/ServicesPage.jsx'
import Testimonials from './pages/Testimonials/Testimonials.jsx'
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx'
import SignupPage from './pages/Auth/SignupPage.jsx'
import ProfilePage from './pages/Profile/ProfilePage.jsx'
import MyProfilePage from './pages/Profile/MyProfilePage.jsx'
import CertificatesPage from './pages/Profile/CertificatesPage.jsx'
import OrderHistoryPage from './pages/Profile/OrderHistoryPage.jsx'
import MyCoursesPage from './pages/Profile/MyCoursesPage.jsx'
import SettingsPage from './pages/Profile/SettingsPage.jsx'
import PaymentMethodsPage from './pages/Profile/PaymentMethodsPage.jsx'
import WishlistPage from './pages/Profile/WishlistPage.jsx'
import HelpSupportPage from './pages/Profile/HelpSupportPage.jsx'
import { LogoutConfirmProvider } from './components/Dashboard/LogoutModal.jsx'
import { AvatarProvider } from './components/Profile/AvatarProvider.jsx'
import AdminLoginPage from './pages/Admin/AdminLoginPage.jsx'
import { NotificationProvider } from './components/Notifications/NotificationProvider.jsx'
import { AuthProvider } from './components/Auth/AuthProvider.jsx'
import { WishlistProvider } from './components/Wishlist/WishlistProvider.jsx'

// scroll to the top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NotificationProvider>
        <AuthProvider>
          <WishlistProvider>
          <AvatarProvider>
          <LogoutConfirmProvider>
          <MotionProvider>
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/programs" element={<Navigate to="/events" replace />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/profile/courses" element={<MyCoursesPage />} />
          <Route path="/profile/certificates" element={<CertificatesPage />} />
          <Route path="/profile/orders" element={<OrderHistoryPage />} />
          <Route path="/profile/wishlist" element={<WishlistPage />} />
          <Route path="/profile/help" element={<HelpSupportPage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />
          <Route path="/profile/payments" element={<PaymentMethodsPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
            </Routes>
          </MotionProvider>
          </LogoutConfirmProvider>
          </AvatarProvider>
          </WishlistProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  )
}
