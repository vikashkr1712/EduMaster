import { lazy, Suspense, useEffect, useState } from 'react'
import LessonInfo from './LessonInfo.jsx'
import LessonResources from './LessonResources.jsx'
import AssignmentCard from './Assignments/AssignmentCard.jsx'
import LessonNotesWorkspace from './Notes/LessonNotesWorkspace.jsx'
import { getAssignment } from '../../api/lms.js'

const DiscussionList = lazy(() => import('./Discussion/DiscussionList.jsx'))
const BASE_TABS = ['Overview', 'Resources', 'Assignments', 'Discussion', 'Notes']

function QuizPanel({ quiz, quizReady, onQuiz }) {
  const passed = Boolean(quiz?.passed)
  const available = Boolean(quiz && (quizReady || passed))

  return (
    <div className={`lms-quiz-panel${available ? ' is-ready' : ''}`}>
      <div className="lms-quiz-icon" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8l4 4v14H4V3h4Z"/><path d="M14 3v5h5M8 13l2 2 5-5M8 18h8"/>
        </svg>
      </div>
      <div className="lms-quiz-copy">
        <span>{passed ? 'Assessment completed' : available ? 'Assessment ready' : 'Assessment locked'}</span>
        <h3>{quiz?.title || 'Lesson Assessment'}</h3>
        <p>
          {passed
            ? 'You passed this assessment. You can revisit it whenever you want to review the questions.'
            : available
              ? 'Take the quiz now or return later. Your lesson progress is saved and you will stay enrolled in the course.'
              : 'Finish this lesson first. The quiz will unlock here and you can take it when you are ready.'}
        </p>
        {quiz && (
          <div className="lms-quiz-meta">
            <span>Passing score <strong>{quiz.passingMarks}%</strong></span>
            <span>Time limit <strong>{quiz.timeLimit} min</strong></span>
          </div>
        )}
      </div>
      <button type="button" className="lms-quiz-action" onClick={onQuiz} disabled={!available}>
        {passed ? 'Review Quiz' : available ? 'Take Quiz Now' : 'Complete Lesson to Unlock'}
      </button>
    </div>
  )
}

export default function LearningTabs({ lesson, course, courseId, user, updateUser, notify, quiz, quizReady, onQuiz }) {
  const [tab, setTab] = useState('Overview')
  const [assignmentData, setAssignmentData] = useState(null)
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const tabs = quiz ? [...BASE_TABS.slice(0, 2), 'Quiz', ...BASE_TABS.slice(2)] : BASE_TABS

  useEffect(() => { setTab('Overview'); setAssignmentData(null) }, [lesson.lessonId])
  useEffect(() => {
    if (tab !== 'Assignments' || assignmentData) return undefined
    let active = true
    setAssignmentLoading(true)
    getAssignment(lesson.lessonId, courseId)
      .then((response) => { if (active) setAssignmentData(response.data) })
      .catch((error) => notify(error.message, true))
      .finally(() => { if (active) setAssignmentLoading(false) })
    return () => { active = false }
  }, [assignmentData, courseId, lesson.lessonId, notify, tab])

  const resources = <LessonResources resources={lesson.resources} courseId={courseId} lessonId={lesson.lessonId} updateUser={updateUser} notify={notify} />

  return (
    <section className="lms-tabs-card">
      <div className="lms-tabs" role="tablist" aria-label="Lesson learning tools">
        {tabs.map((label) => (
          <button key={label} type="button" role="tab" aria-selected={tab === label} className={tab === label ? 'is-active' : ''} onClick={() => setTab(label)}>
            {label}{label === 'Quiz' && quizReady ? <span className="lms-tab-ready-dot" aria-label="ready" /> : null}
          </button>
        ))}
      </div>
      <div className="lms-tab-panel" role="tabpanel">
        {tab === 'Overview' && <><LessonInfo lesson={lesson} course={course} resourcesCount={lesson.resources?.length || 0} /><div className="lms-overview-copy"><h3>About This Lesson</h3><p>Watch the complete lesson, review the supporting resources, capture your notes, and use the assignment and discussion areas to reinforce what you learned.</p></div></>}
        {tab === 'Resources' && resources}
        {tab === 'Quiz' && <QuizPanel quiz={quiz} quizReady={quizReady} onQuiz={onQuiz} />}
        {tab === 'Assignments' && (assignmentLoading ? <p className="lms-loading">Loading assignment…</p> : <AssignmentCard assignment={assignmentData?.assignment} submission={assignmentData?.submission} onSubmitted={(data) => { setAssignmentData((value) => ({ ...value, submission: data.submission })); if (data.stats) updateUser({ stats: data.stats }) }} notify={notify} />)}
        {tab === 'Discussion' && <Suspense fallback={<p className="lms-loading">Loading discussion…</p>}><DiscussionList courseId={courseId} lessonId={lesson.lessonId} user={user} updateUser={updateUser} notify={notify} /></Suspense>}
        {tab === 'Notes' && <LessonNotesWorkspace courseId={courseId} lessonId={lesson.lessonId} updateUser={updateUser} notify={notify} />}
      </div>
    </section>
  )
}
