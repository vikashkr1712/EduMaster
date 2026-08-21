import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import { getCourseBySlug } from '../../api/course.js'
import CourseHero from '../../components/CourseDetails/CourseHero.jsx'
import PurchaseCard from '../../components/CourseDetails/PurchaseCard.jsx'
import CourseTabs from '../../components/CourseDetails/CourseTabs.jsx'
import OverviewTab from '../../components/CourseDetails/OverviewTab.jsx'
import CurriculumTab from '../../components/CourseDetails/CurriculumTab.jsx'
import InstructorTab from '../../components/CourseDetails/InstructorTab.jsx'
import ReviewsTab from '../../components/CourseDetails/ReviewsTab.jsx'
import FAQTab from '../../components/CourseDetails/FAQTab.jsx'
import './CourseDetailsPage.css'
import './CourseDetailsMotion.css'

function VideoIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M17 10l5-3v10l-5-3V10z" stroke="currentColor" strokeWidth="1.8"/></svg> }
function LessonsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> }
function CertIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21l3-3 3 3M12 15v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> }
function AccessIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke="currentColor" strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> }

const tabVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export default function CourseDetailsPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    setStatus('loading')
    setCourse(null)
    getCourseBySlug(slug)
      .then((res) => {
        const data = res?.data?.course ?? res?.data ?? null
        setCourse(data)
        setStatus(data ? 'success' : 'error')
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="cdp-loading"><div className="cdp-spinner" /><p>Loading course…</p></div>
        <Footer />
      </>
    )
  }

  if (status === 'error' || !course) {
    return (
      <>
        <Navbar />
        <div className="cdp-error">
          <h2>Course not found</h2>
          <p>This course may have been removed or the link is incorrect.</p>
          <Link to="/courses" className="cdp-btn-back">Browse all courses</Link>
        </div>
        <Footer />
      </>
    )
  }

  const studentCount = typeof course.students === 'string'
    ? parseInt(course.students.replace(/[,+]/g, ''), 10) || 0
    : Number(course.students) || 0
  const reviewCount = Array.isArray(course.reviews) && course.reviews.length ? course.reviews.length : null
  const lessonCount = (course.modules || []).reduce((total, module) => total + (module.lessons?.length || 0), 0)

  const quickStats = [
    { icon: <VideoIcon />, label: course.duration || '10+ Hours', sub: 'On-demand video' },
    { icon: <LessonsIcon />, label: lessonCount ? `${lessonCount} Lessons` : 'Lessons', sub: 'Full curriculum' },
    { icon: <CertIcon />, label: 'Certificate', sub: 'Of completion' },
    { icon: <AccessIcon />, label: 'Lifetime Access', sub: 'Learn at your pace' },
  ]

  return (
    <>
      <Navbar />

      <div className="cdp-breadcrumb-bar">
        <div className="container cdp-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/courses">Courses</Link>
          <span>›</span>
          <span>{course.category}</span>
          <span>›</span>
          <span className="cdp-bc-current">{course.title}</span>
        </div>
      </div>

      <div className="cdp-page">
        <div className="container cdp-layout">
          <main className="cdp-main">
            <CourseHero course={course} />

            <div className="cdp-quick-stats">
              {quickStats.map((s, i) => (
                <div key={i} className="cdp-quick-stat">
                  <span className="cdp-qs-icon">{s.icon}</span>
                  <div>
                    <span className="cdp-qs-label">{s.label}</span>
                    <span className="cdp-qs-sub">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cdp-mobile-purchase">
              <PurchaseCard course={course} />
            </div>

            <CourseTabs active={activeTab} onChange={setActiveTab} reviewCount={reviewCount} />

            <div className="cdp-tab-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {activeTab === 'Overview' && <OverviewTab course={course} />}
                  {activeTab === 'Curriculum' && <CurriculumTab course={course} />}
                  {activeTab === 'Instructor' && <InstructorTab course={course} />}
                  {activeTab === 'Reviews' && <ReviewsTab course={course} />}
                  {activeTab === 'FAQ' && <FAQTab course={course} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <aside className="cdp-sidebar">
            <div className="cdp-sidebar-sticky">
              <PurchaseCard course={course} autoResume />
            </div>
          </aside>
        </div>

      </div>

      <Footer />
    </>
  )
}
