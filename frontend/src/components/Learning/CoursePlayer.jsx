import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { useAuth } from '../Auth/AuthProvider.jsx'
import ProgressHeader from './ProgressHeader.jsx'
import VideoSection from './VideoSection.jsx'
import LessonSidebar from './LessonSidebar.jsx'
import LessonResources from './LessonResources.jsx'
import LearningTabs from './LearningTabs.jsx'
import PlayerNavigation from './PlayerNavigation.jsx'
import CompletionDialog from './CompletionDialog.jsx'
import {
  saveCurrentLesson,
  saveLessonProgress,
  setLessonBookmark,
} from '../../api/learning.js'

function BookmarkIcon({ filled }) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5h12v17L12 16l-6 4.5v-17Z"/></svg>
}

export default function CoursePlayer({ initialData }) {
  const navigate = useNavigate()
  const { success, error } = useNotifications()
  const { user, updateUser } = useAuth()
  const notify = useCallback((message, isError = false) => (isError ? error(message) : success(message)), [error, success])
  const [enrollment, setEnrollment] = useState(initialData.enrollment)
  const [currentLessonId, setCurrentLessonId] = useState(initialData.enrollment.currentLesson)
  const [completionOpen, setCompletionOpen] = useState(false)
  const saveChainRef = useRef(Promise.resolve())
  const course = initialData.course
  const quizzes = initialData.quizzes || {}
  const courseId = String(course._id)

  const flatLessons = useMemo(() => course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({ module, moduleIndex, lesson, lessonIndex }))
  ), [course.modules])
  const currentIndex = Math.max(0, flatLessons.findIndex(({ lesson }) => lesson.lessonId === currentLessonId))
  const current = flatLessons[currentIndex] || flatLessons[0]
  const completedLessons = useMemo(() => new Set(enrollment.completedLessons || []), [enrollment.completedLessons])
  const progress = Number(enrollment.percentageCompleted ?? enrollment.progress) || 0
  const bookmarked = (enrollment.bookmarks || []).includes(current.lesson.lessonId)
  const quizReady = (enrollment.quizReadyLessons || []).includes(current.lesson.lessonId)

  const isLessonLocked = useCallback((moduleIndex, lesson) => {
    if (lesson.lessonId === currentLessonId || completedLessons.has(lesson.lessonId) || moduleIndex === 0) return false
    return course.modules.slice(0, moduleIndex).some((previousModule) =>
      previousModule.lessons.some((previousLesson) => !completedLessons.has(previousLesson.lessonId))
    )
  }, [completedLessons, course.modules, currentLessonId])

  const selectLesson = useCallback((lessonId) => {
    const entry = flatLessons.find(({ lesson }) => lesson.lessonId === lessonId)
    if (!entry || isLessonLocked(entry.moduleIndex, entry.lesson) || lessonId === currentLessonId) return
    setCurrentLessonId(lessonId)
    setEnrollment((value) => ({ ...value, currentLesson: lessonId, currentModule: entry.module.moduleId }))
    saveCurrentLesson({ courseId, lessonId })
      .then((response) => { if (response?.data?.enrollment) setEnrollment(response.data.enrollment) })
      .catch((requestError) => error(requestError.message || 'Could not save the current lesson.'))
  }, [courseId, currentLessonId, error, flatLessons, isLessonLocked])

  const saveProgress = useCallback((seconds, completed = false) => {
    const lessonId = current.lesson.lessonId
    if (completed) {
      const nextCompleted = new Set(completedLessons)
      nextCompleted.add(lessonId)
      const nextProgress = Math.round((nextCompleted.size / flatLessons.length) * 100)
      setEnrollment((value) => {
        return { ...value, completedLessons: [...nextCompleted], progress: nextProgress, percentageCompleted: nextProgress }
      })
    }

    saveChainRef.current = saveChainRef.current
      .catch(() => undefined)
      .then(() => saveLessonProgress({ courseId, lessonId, watchTimeSeconds: seconds, completed }))
      .then((response) => {
        const updated = response?.data?.enrollment
        if (updated) {
          setEnrollment(updated)
          if ((updated.percentageCompleted ?? updated.progress) === 100) setCompletionOpen(true)
        }
        if (response?.data?.stats) updateUser({ stats: response.data.stats })
        if (response?.data?.certificateGenerated) success('🎉 Congratulations! Your certificate is ready.')
        if (response?.data?.quizRequired) {
          success('Lesson finished. Your assessment is ready in the Quiz tab whenever you are ready.')
        }
      })
      .catch((requestError) => {
        if (completed) error(requestError.message || 'Could not save lesson completion.')
      })
  }, [completedLessons, courseId, current.lesson.lessonId, error, flatLessons.length, success, updateUser])

  const toggleBookmark = async () => {
    const lessonId = current.lesson.lessonId
    const nextValue = !bookmarked
    setEnrollment((value) => ({
      ...value,
      bookmarks: nextValue
        ? [...new Set([...(value.bookmarks || []), lessonId])]
        : (value.bookmarks || []).filter((id) => id !== lessonId),
    }))
    try {
      const response = await setLessonBookmark({ courseId, lessonId, bookmarked: nextValue })
      setEnrollment((value) => ({ ...value, bookmarks: response?.data?.bookmarks || value.bookmarks }))
      success(nextValue ? 'Lesson bookmarked.' : 'Bookmark removed.')
    } catch (requestError) {
      setEnrollment((value) => ({ ...value, bookmarks: bookmarked ? [...new Set([...(value.bookmarks || []), lessonId])] : (value.bookmarks || []).filter((id) => id !== lessonId) }))
      error(requestError.message || 'Could not update the bookmark.')
    }
  }

  return (
    <>
      <nav className="learn-breadcrumb" aria-label="Breadcrumb">
        <Link to="/profile/courses">My Courses</Link><span>›</span>
        <span>{course.title}</span><span>›</span>
        <span>{current.module.title}</span><span>›</span>
        <strong>{current.lesson.title}</strong>
      </nav>

      <ProgressHeader course={course} completedCount={completedLessons.size} totalLessons={flatLessons.length} progress={progress} />

      <div className="learn-workspace">
        <section className="learn-video-area">
          <div className="learn-lesson-heading">
            <div><span>Module {current.moduleIndex + 1} · Lesson {current.lessonIndex + 1}</span><h2>{current.lesson.title}</h2></div>
            <button type="button" className={`learn-bookmark-button${bookmarked ? ' is-bookmarked' : ''}`} onClick={toggleBookmark} aria-label={bookmarked ? 'Remove lesson bookmark' : 'Bookmark lesson'} title={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}><BookmarkIcon filled={bookmarked} /></button>
          </div>
          <VideoSection key={current.lesson.lessonId} lesson={current.lesson} onWatchProgress={saveProgress} />
        </section>

        <div className="learn-lessons-area">
          <LessonSidebar modules={course.modules} currentLessonId={current.lesson.lessonId} completedLessons={completedLessons} isLessonLocked={isLessonLocked} onSelect={selectLesson} />
        </div>

        <div className="learn-resources-area"><LessonResources resources={current.lesson.resources} courseId={courseId} lessonId={current.lesson.lessonId} updateUser={updateUser} notify={notify} /></div>
        <div className="learn-nav-area">
          <PlayerNavigation
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < flatLessons.length - 1 && !isLessonLocked(flatLessons[currentIndex + 1]?.moduleIndex, flatLessons[currentIndex + 1]?.lesson)}
            completed={completedLessons.has(current.lesson.lessonId)}
            onPrevious={() => selectLesson(flatLessons[currentIndex - 1]?.lesson.lessonId)}
            onNext={() => selectLesson(flatLessons[currentIndex + 1]?.lesson.lessonId)}
            onComplete={() => saveProgress(0, true)}
            quiz={quizReady ? quizzes[current.lesson.lessonId] : null}
            onQuiz={() => navigate(`/quiz/${current.lesson.lessonId}?courseId=${encodeURIComponent(courseId)}`, { state: { courseId } })}
          />
        </div>
        <div className="learn-info-area">
          <LearningTabs
            lesson={current.lesson}
            course={course}
            courseId={courseId}
            user={user}
            updateUser={updateUser}
            notify={notify}
            quiz={quizzes[current.lesson.lessonId]}
            quizReady={quizReady}
            onQuiz={() => navigate(`/quiz/${current.lesson.lessonId}?courseId=${encodeURIComponent(courseId)}`, { state: { courseId } })}
          />
        </div>
      </div>

      <CompletionDialog open={completionOpen} courseTitle={course.title} onClose={() => setCompletionOpen(false)} onMyCourses={() => navigate('/profile/courses')} onViewCertificate={() => navigate('/profile/certificates')} />
    </>
  )
}
