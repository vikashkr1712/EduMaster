import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminQuiz } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminQuizzes.css'

export default function AdminQuizDetailsPage() {
  const { id } = useParams(); const [quiz, setQuiz] = useState(null); const [error, setError] = useState(null)
  useEffect(() => { let active = true; getAdminQuiz(id).then((response) => active && setQuiz(response?.data?.quiz)).catch((requestError) => active && setError(requestError)); return () => { active = false } }, [id])
  if (error) return <div className="admin-course-list-state" role="alert"><h2>Unable to load quiz</h2><p>{error?.message || 'The quiz could not be loaded.'}</p><Link className="admin-button admin-button--secondary" to="/admin/quizzes">Back to quizzes</Link></div>
  if (!quiz) return <div className="admin-quiz-form-state" aria-busy="true"><span className="admin-spinner" />Loading quiz…</div>
  return <div className="admin-quiz-details"><div className="admin-page-heading"><div><Link className="admin-back-link" to="/admin/quizzes"><AdminIcon name="arrowLeft" size={17} />Back to quizzes</Link><h1>{quiz.title}</h1><p>{quiz.courseTitle} · {quiz.moduleTitle} · {quiz.lessonTitle}</p></div><Link className="admin-button admin-button--primary" to={`/admin/quizzes/${id}/edit`}><AdminIcon name="edit" size={17} />Edit Quiz</Link></div>
    <section className="admin-quiz-detail-stats" aria-label="Quiz overview">{[['Availability', quiz.isPublished ? 'Published' : 'Draft'], ['Questions', quiz.questions.length], ['Passing score', `${quiz.passingMarks}%`], ['Time limit', `${quiz.timeLimit} min`], ['Attempts', quiz.attemptCount], ['Passed', quiz.passedCount], ['Average score', `${quiz.averageScore}%`], ['Best score', `${quiz.bestScore}%`]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
    {quiz.attemptCount > 0 && <section className="admin-integrity-banner"><AdminIcon name="shield" /><div><strong>Attempt history protected</strong><p>Scoring and structural changes are restricted because learner attempts exist.</p></div></section>}
    <section className="admin-quiz-detail-questions"><div className="admin-question-section__heading"><div><span>Admin answer key</span><h2>Questions</h2><p>Correct answers and explanations are visible only through this protected Admin API.</p></div></div>{quiz.questions.map((question, index) => <article className="admin-answer-card" key={question._id}><div><span>Question {index + 1} · {question.difficulty}</span><h3>{question.question}</h3></div><ol type="A">{question.options.map((option, optionIndex) => <li className={optionIndex === question.correctAnswer ? 'is-correct' : ''} key={optionIndex}>{option}<small>{optionIndex === question.correctAnswer ? 'Correct answer' : ''}</small></li>)}</ol><div className="admin-answer-card__explanation"><strong>Explanation</strong><p>{question.explanation}</p></div></article>)}</section>
    <p className="admin-detail-dates">Created {new Date(quiz.createdAt).toLocaleString()} · Updated {new Date(quiz.updatedAt).toLocaleString()}</p></div>
}
