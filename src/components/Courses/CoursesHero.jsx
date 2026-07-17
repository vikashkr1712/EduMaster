import './CoursesHero.css'
import SVGCourse from '../../assets/svg/svg_course.jsx'
import CoursesStats from './CoursesStats.jsx'

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.2" />
      <path d="M16.5 16.5 L21 21" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function CoursesHero({ search, onSearch }) {
  return (
    <section className="courses-hero">
      <div className="container courses-hero-inner">
        <div className="courses-hero-content">
          <h1 className="courses-hero-title">Explore Our Courses</h1>
          <p className="courses-hero-text">
            Choose from our wide range of industry-relevant courses designed to help you gain
            skills and advance your career.
          </p>

          <form className="courses-hero-search" onSubmit={(e) => e.preventDefault()}>
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
          </form>

          <CoursesStats />
        </div>

        <div className="courses-hero-illustration">
          <SVGCourse />
        </div>
      </div>
    </section>
  )
}
