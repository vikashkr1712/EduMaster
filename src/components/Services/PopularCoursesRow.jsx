import { Link } from 'react-router-dom'
import './PopularCoursesRow.css'
import '../../pages/Courses/CoursesPage.css'
import CourseCard from '../Courses/CourseCard.jsx'
import { popularServiceCourses } from '../../data/servicesData.js'

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PopularCoursesRow() {
  return (
    <section className="spop">
      <div className="container">
        <div className="spop-head">
          <span className="spop-badge">Hot Courses</span>
          <h2 className="spop-title">Popular &amp; In-Demand Courses</h2>
        </div>

        <div className="spop-grid">
          {popularServiceCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="spop-cta">
          <Link to="/courses" className="spop-viewall">
            View All Courses
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
