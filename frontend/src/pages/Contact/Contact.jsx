import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import ContactHero from '../../components/Contact/ContactHero.jsx'
import ContactInfo from '../../components/Contact/ContactInfo.jsx'
import ContactMap from '../../components/Contact/ContactMap.jsx'
import './ContactMotion.css'

export default function Contact() {
  const location = useLocation()
  const prefill = location.state ?? {}

  useEffect(() => {
    if (prefill.scrollTo !== 'form') return
    // wait a tick so the app-level ScrollToTop runs first
    const timer = setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(timer)
  }, [prefill.scrollTo])

  return (
    <>
      <Navbar />
      <ContactHero />
      <ContactInfo prefillSubject={prefill.subject} prefillMessage={prefill.message} />
      <ContactMap />
      <Footer />
    </>
  )
}
