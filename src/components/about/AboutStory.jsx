import AboutStoryIllustration from '../../assets/svg/about/AboutStoryIllustration.jsx'
import WhyChooseUs from './WhyChooseUs.jsx'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'

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
  const reducedMotion = useReducedMotion()

  return (
    <section className="astory">
      <div className="container astory-inner">
        <motion.div className="astory-content" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.09)}>
          <motion.span className="astory-badge" variants={fadeUp} transition={{ duration: 0.5 }}>Our Story</motion.span>
          <motion.h2 className="astory-title" variants={fadeUp} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>The Story Behind EduMaster</motion.h2>
          <motion.p className="astory-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            EduMaster was founded in 2020 by a group of passionate educators and technologists
            who saw the need for a better way to learn online.
          </motion.p>
          <motion.p className="astory-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            We started with a simple idea: make quality education accessible, engaging, and
            effective for everyone. Today, we are proud to have a global community of learners
            and instructors who inspire each other every day.
          </motion.p>
          <motion.button className="astory-btn" variants={fadeUp} transition={{ duration: 0.5 }}>
            Learn More About Us
            <ArrowIcon />
          </motion.button>
        </motion.div>

        <motion.div className="astory-illustration" initial={reducedMotion ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <AboutStoryIllustration className="svg-about-story-inline" />
        </motion.div>

        <WhyChooseUs />
      </div>
    </section>
  )
}
