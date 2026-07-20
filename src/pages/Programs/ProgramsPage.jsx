import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import HeroSection from '../../components/Programs/HeroSection.jsx'
import FeaturesSection from '../../components/Programs/FeaturesSection.jsx'
import PopularPrograms from '../../components/Programs/PopularPrograms.jsx'
import HowItWorks from '../../components/Programs/HowItWorks.jsx'
import StatsSection from '../../components/Programs/StatsSection.jsx'

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PopularPrograms />
      <HowItWorks />
      <StatsSection />
      <Footer />
    </>
  )
}
