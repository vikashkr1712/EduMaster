import AboutStoryIllustration from '../../assets/svg/about/AboutStoryIllustration.jsx'
import WhyChooseUs from './WhyChooseUs.jsx'

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AboutStory() {
  return (
    <section className="astory">
      <div className="container astory-inner">
        <div className="astory-content">
          <span className="astory-badge">Our Story</span>
          <h2 className="astory-title">The Story Behind EduMaster</h2>
          <p className="astory-text">
            EduMaster was founded in 2020 by a group of passionate educators and technologists
            who saw the need for a better way to learn online.
          </p>
          <p className="astory-text">
            We started with a simple idea: make quality education accessible, engaging, and
            effective for everyone. Today, we are proud to have a global community of learners
            and instructors who inspire each other every day.
          </p>
          <button className="astory-btn">
            Learn More About Us
            <ArrowIcon />
          </button>
        </div>

        <div className="astory-illustration">
          <AboutStoryIllustration className="svg-about-story-inline" />
        </div>

        <WhyChooseUs />
      </div>
    </section>
  )
}
