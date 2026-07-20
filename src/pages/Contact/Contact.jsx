import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import ContactHero from '../../components/Contact/ContactHero.jsx'
import ContactInfo from '../../components/Contact/ContactInfo.jsx'
import ContactMap from '../../components/Contact/ContactMap.jsx'

export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <ContactInfo />
      <ContactMap />
      <Footer />
    </>
  )
}
