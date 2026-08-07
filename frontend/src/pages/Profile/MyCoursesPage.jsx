import { useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import MyCourseCard from '../../components/MyCourses/MyCourseCard.jsx'
import { MY_COURSES } from '../../components/MyCourses/myCoursesData.jsx'
import '../../components/MyCourses/MyCourses.css'

const TABS = ['All Courses', 'In Progress', 'Completed', 'Not Started']

export default function MyCoursesPage() {
  const [tab, setTab] = useState('All Courses')

  const visible = tab === 'All Courses'
    ? MY_COURSES
    : MY_COURSES.filter((course) => course.status === tab)

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Courses"
        subtitle="Track and continue your enrolled courses."
      />
      <DashboardContent>
        <div className="cert-tabs" role="tablist" aria-label="Filter courses">
          {TABS.map((label) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === label}
              className={`cert-tab${tab === label ? ' is-active' : ''}`}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="cert-count">
          Showing {visible.length} of {MY_COURSES.length} courses
        </p>

        <div className="mycourse-grid">
          {visible.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))}
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
