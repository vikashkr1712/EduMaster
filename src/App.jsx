import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import CoursesPage from './pages/Courses/CoursesPage.jsx'
import EventsPage from './pages/Events/EventsPage.jsx'
import ServicesPage from './pages/Services/ServicesPage.jsx'
import Testimonials from './pages/Testimonials/Testimonials.jsx'
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx'
import SignupPage from './pages/Auth/SignupPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}
