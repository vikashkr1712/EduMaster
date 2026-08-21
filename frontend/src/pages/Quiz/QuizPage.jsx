import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import QuizHeader from '../../components/Quiz/QuizHeader.jsx'
import QuestionCard from '../../components/Quiz/QuestionCard.jsx'
import QuizNavigation from '../../components/Quiz/QuizNavigation.jsx'
import QuizResult from '../../components/Quiz/QuizResult.jsx'
import QuizHistory from '../../components/Quiz/QuizHistory.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import { getQuizByLesson, getQuizHistory, startQuiz, submitQuiz } from '../../api/quiz.js'
import { updateCachedEnrollment } from '../../api/learning.js'
import './QuizPage.css'

export default function QuizPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()
  const { success } = useNotifications()
  const [quiz, setQuiz] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')
  const submittedRef = useRef(false)
  const requestedCourseId = location.state?.courseId || searchParams.get('courseId')
  const courseId = requestedCourseId || quiz?.course

  const begin = useCallback(async (providedQuiz) => {
    const response = await startQuiz(providedQuiz._id)
    setQuiz(response.data.quiz)
    setAttempt(response.data.attempt)
    setAnswers({})
    setCurrent(0)
    setResult(null)
    submittedRef.current = false
    setSeconds(Math.max(0, Math.ceil((new Date(response.data.attempt.expiresAt).getTime() - Date.now()) / 1000)))
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getQuizByLesson(lessonId, requestedCourseId), getQuizHistory()])
      .then(async ([quizResponse, historyResponse]) => {
        if (!active) return
        const loadedQuiz = quizResponse?.data?.quiz
        if (!loadedQuiz) throw new Error('Quiz unavailable')
        setHistory(historyResponse?.data?.attempts || [])
        if (historyResponse?.data?.stats) updateUser({ stats: historyResponse.data.stats })
        await begin(loadedQuiz)
      })
      .catch((error) => { if (active) setLoadError(error.message || 'Could not load this assessment.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [begin, lessonId, requestedCourseId, updateUser])

  const performSubmit = useCallback(async () => {
    if (!quiz || !attempt || submitting || submittedRef.current) return
    submittedRef.current = true
    setSubmitting(true)
    try {
      const response = await submitQuiz(quiz._id, {
        attemptId: attempt._id,
        answers: quiz.questions.map((question) => ({ questionId: String(question._id), selectedAnswer: answers[String(question._id)] ?? null })),
      })
      setResult(response.data)
      if (response?.data?.stats) updateUser({ stats: response.data.stats })
      if (response?.data?.enrollment && courseId) updateCachedEnrollment(courseId, response.data.enrollment)
      if (response?.data?.certificateGenerated) success('🎉 Congratulations! Your certificate is ready.')
      setHistory((value) => [response.data.attempt, ...value])
    } catch (error) {
      setLoadError(error.message || 'Could not submit your quiz.')
      submittedRef.current = false
    } finally {
      setSubmitting(false)
    }
  }, [answers, attempt, courseId, quiz, submitting, success, updateUser])

  useEffect(() => {
    if (!attempt || result || loading) return undefined
    if (seconds <= 0) { performSubmit(); return undefined }
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [attempt, loading, performSubmit, result, seconds])

  const answered = useMemo(() => new Set(quiz?.questions.map((question, index) => answers[String(question._id)] !== undefined ? index : null).filter((index) => index !== null) || []), [answers, quiz])

  const retry = async () => {
    setLoadError('')
    setLoading(true)
    try { await begin(quiz) } catch (error) { setLoadError(error.message || 'Could not start another attempt.') } finally { setLoading(false) }
  }

  if (loading) return <><Navbar /><main className="quiz-page"><div className="container quiz-page-state"><span className="quiz-loader" /><p>Preparing your assessment…</p></div></main></>
  if (loadError && !quiz) return <><Navbar /><main className="quiz-page"><div className="container quiz-page-state"><h1>Assessment unavailable</h1><p>{loadError}</p><Link to={courseId ? `/learn/${courseId}` : '/profile/courses'}>Back to Learning</Link></div></main></>

  return (
    <><Navbar /><main className="quiz-page"><div className="container quiz-shell">
      <nav className="quiz-breadcrumb"><Link to="/profile/courses">My Courses</Link><span>›</span>{courseId && <><Link to={`/learn/${courseId}`}>Course Player</Link><span>›</span></>}<strong>{quiz.title}</strong></nav>
      {loadError && <p className="quiz-inline-error">{loadError}</p>}
      {result ? <QuizResult result={result} onContinue={() => navigate(courseId ? `/learn/${courseId}` : '/profile/courses')} onRetry={retry} /> : (
        <div className="quiz-layout"><div className="quiz-main">
          <QuizHeader title={quiz.title} current={current} total={quiz.questions.length} answered={answered.size} seconds={seconds} />
          <QuestionCard question={quiz.questions[current]} selectedAnswer={answers[String(quiz.questions[current]._id)]} onAnswer={(index) => setAnswers((value) => ({ ...value, [String(quiz.questions[current]._id)]: index }))} />
          <QuizNavigation current={current} total={quiz.questions.length} answered={answered} onJump={setCurrent} onPrevious={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(quiz.questions.length - 1, value + 1))} onSubmit={performSubmit} submitting={submitting} />
        </div><QuizHistory attempts={history} /></div>
      )}
    </div></main></>
  )
}
