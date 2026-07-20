import './About.css'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import AboutHero from '../../components/about/AboutHero.jsx'
import AboutMission from '../../components/about/AboutMission.jsx'
import AboutStory from '../../components/about/AboutStory.jsx'
import AboutStats from '../../components/about/AboutStats.jsx'

export default function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <AboutMission />
      <AboutStory />
      <AboutStats />
      <Footer />
    </>
  )
}
