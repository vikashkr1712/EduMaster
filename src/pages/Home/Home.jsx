import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Hero from '../../components/Home/Hero/Hero.jsx'
import Features from '../../components/Home/Features/Features.jsx'
import Courses from '../../components/Home/Courses/Courses.jsx'
import StatsBar from '../../components/Home/StatsBar/StatsBar.jsx'
import Testimonials from '../../components/Home/Testimonials/Testimonials.jsx'
import WhyChoose from '../../components/Home/WhyChoose/WhyChoose.jsx'
import JoinCTA from '../../components/Home/JoinCTA/JoinCTA.jsx'
import Partners from '../../components/Home/Partners/Partners.jsx'
import Subscribe from '../../components/Home/Subscribe/Subscribe.jsx'
import TestimonialCarousel from '../../components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import AchievementBar from '../../components/Home/AchievementBar/AchievementBar.jsx'
import Blog from '../../components/Home/Blog/Blog.jsx'
import CTA from '../../components/Home/CTA/CTA.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import './HomeMotion.css'

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <Features />
      <Courses />
      <StatsBar />
      <Testimonials />
      <WhyChoose />
      <JoinCTA />
      <Partners />
      <TestimonialCarousel />
      <AchievementBar />
      <Blog />
      <CTA />
      <Subscribe />
      <Footer />
    </div>
  )
}
