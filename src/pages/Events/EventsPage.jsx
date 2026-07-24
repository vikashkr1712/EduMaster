import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import HeroSection from '../../components/Events/HeroSection.jsx'
import FeaturesSection from '../../components/Events/FeaturesSection.jsx'
import PopularEvents from '../../components/Events/PopularEvents.jsx'
import HowItWorks from '../../components/Events/HowItWorks.jsx'
import StatsSection from '../../components/Events/StatsSection.jsx'

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PopularEvents />
      <HowItWorks />
      <StatsSection />
      <Footer />
    </>
  )
}
