import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import ServicesHero from '../../components/Services/ServicesHero.jsx'
import ServiceCards from '../../components/Services/ServiceCards.jsx'
import WhyChooseServices from '../../components/Services/WhyChooseServices.jsx'
import PopularCoursesRow from '../../components/Services/PopularCoursesRow.jsx'
import ProcessSteps from '../../components/Services/ProcessSteps.jsx'
import PricingSection from '../../components/Services/PricingSection.jsx'
import ServicesStats from '../../components/Services/ServicesStats.jsx'
import ServicesFAQ from '../../components/Services/ServicesFAQ.jsx'
import ServicesCTA from '../../components/Services/ServicesCTA.jsx'

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <ServiceCards />
      <WhyChooseServices />
      <PopularCoursesRow />
      <ProcessSteps />
      <PricingSection />
      <ServicesStats />
      <ServicesFAQ />
      <ServicesCTA />
      <Footer />
    </>
  )
}
