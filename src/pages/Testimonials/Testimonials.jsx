import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import TestimonialsHero from '../../components/Testimonials/TestimonialsHero.jsx'
import TestimonialsStats from '../../components/Testimonials/TestimonialsStats.jsx'
import TestimonialsSection from '../../components/Testimonials/TestimonialsSection.jsx'
import TestimonialsCTA from '../../components/Testimonials/TestimonialsCTA.jsx'

export default function Testimonials() {
  return (
    <>
      <Navbar />
      <TestimonialsHero />
      <TestimonialsStats />
      <TestimonialsSection />
      <TestimonialsCTA />
      <Footer />
    </>
  )
}
