import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import CoursePlayer from '../../components/Learning/CoursePlayer.jsx'
import { getLearningCourse } from '../../api/learning.js'
import './CourseLearningPage.css'

export default function CourseLearningPage() {
  const { courseId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    getLearningCourse(courseId)
      .then((response) => { if (active) setData(response?.data || null) })
      .catch((error) => { if (active) setLoadError(error.message || 'Could not load this course.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [courseId])

  return (
    <>
      <Navbar />
      <main className="learn-page">
        <div className="container">
          {loading ? (
            <div className="learn-page-state"><span className="learn-page-spinner" /><p>Preparing your learning experience…</p></div>
          ) : loadError || !data?.course ? (
            <div className="learn-page-state">
              <h1>Course unavailable</h1>
              <p>{loadError || 'We could not load this course.'}</p>
              <Link to="/profile/courses">Back to My Courses</Link>
            </div>
          ) : <CoursePlayer initialData={data} />}
        </div>
      </main>
    </>
  )
}
