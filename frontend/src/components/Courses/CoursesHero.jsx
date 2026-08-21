import './CoursesHero.css'
import SVGCourse from '../../assets/svg/courses/svg_course.jsx'
import CoursesStats from './CoursesStats.jsx'
import { fadeUp, motion, stagger, useReducedMotion } from '../Home/motion.jsx'

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.2" />
      <path d="M16.5 16.5 L21 21" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function CoursesHero({ search, onSearch }) {
  const reducedMotion = useReducedMotion()

  return (
    <section className="courses-hero">
      <div className="container courses-hero-inner">
        <motion.div
          className="courses-hero-content"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger(0.08)}
        >
          <motion.h1 className="courses-hero-title" variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            Explore Our Courses
          </motion.h1>
          <motion.p className="courses-hero-text" variants={fadeUp} transition={{ duration: 0.5 }}>
            Choose from our wide range of industry-relevant courses designed to help you gain
            skills and advance your career.
          </motion.p>

          <motion.form
            className="courses-hero-search"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search for courses, topics or skills..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Search courses"
            />
            <button type="submit" className="courses-hero-search-btn" aria-label="Search">
              <SearchIcon />
            </button>
          </motion.form>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <CoursesStats />
          </motion.div>
        </motion.div>

        <motion.div
          className="courses-hero-illustration"
          initial={reducedMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <SVGCourse />
        </motion.div>
      </div>
    </section>
  )
}
