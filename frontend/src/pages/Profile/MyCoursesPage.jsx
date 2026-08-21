import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import MyCourseCard from '../../components/MyCourses/MyCourseCard.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { getUserOrders } from '../../api/order.js'
import '../../components/Certificates/Certificates.css'
import '../../components/Profile/Profile.css'
import '../../components/MyCourses/MyCourses.css'

const TABS = ['All Courses', 'In Progress', 'Completed', 'Not Started']

export default function MyCoursesPage() {
  const [tab, setTab] = useState('All Courses')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const { updateUser } = useAuth()

  useEffect(() => {
    let active = true
    getUserOrders()
      .then((response) => {
        if (!active) return
        const enrollments = Array.isArray(response?.data?.enrollments) ? response.data.enrollments : []
        const activities = response?.data?.activities || {}
        setCourses(enrollments.map((enrollment, index) => {
          const course = enrollment.course || {}
          const progress = Number(enrollment.progress) || 0
          const status = progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
          const lessonCount = (course.modules || []).reduce((total, module) => total + (module.lessons?.length || 0), 0)
          const tints = ['blue', 'green', 'purple', 'orange']
          return {
            id: course._id || enrollment._id,
            title: course.title || 'Course',
            instructor: course.instructor || 'EduMaster Instructor',
            imageType: course.imageType || 'development',
            tint: tints[index % tints.length],
            status,
            progress,
            lessons: lessonCount ? `${lessonCount} lessons` : 'Curriculum available',
            duration: course.duration || 'Lifetime access',
            activity: activities[String(course._id)] || { pendingAssignments: 0, submittedAssignments: 0, discussionActivity: 0 },
          }
        }))
        if (response?.data?.stats) updateUser({ stats: response.data.stats })
      })
      .catch((error) => {
        if (active) setLoadError(error.message || 'Could not load your enrolled courses.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [updateUser])

  const visible = useMemo(() => tab === 'All Courses'
    ? courses
    : courses.filter((course) => course.status === tab), [courses, tab])

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

        {loading ? (
          <div className="mycourse-state"><span className="mycourse-loader" /><p>Loading your courses…</p></div>
        ) : loadError ? (
          <div className="mycourse-state"><h3>Unable to load courses</h3><p>{loadError}</p></div>
        ) : (
          <>
            <p className="cert-count">Showing {visible.length} of {courses.length} courses</p>
            {visible.length > 0 ? (
              <div className="mycourse-grid">
                {visible.map((course) => <MyCourseCard key={course.id} course={course} />)}
              </div>
            ) : (
              <div className="mycourse-state">
                <h3>{courses.length === 0 ? 'No enrolled courses yet' : `No ${tab.toLowerCase()} courses`}</h3>
                <p>{courses.length === 0 ? 'Enroll in a course and it will appear here automatically.' : 'Choose another filter to see your courses.'}</p>
              </div>
            )}
          </>
        )}
      </DashboardContent>
    </DashboardLayout>
  )
}
