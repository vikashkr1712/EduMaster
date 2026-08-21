import QuizTimer from './QuizTimer.jsx'

export default function QuizHeader({ title, current, total, answered, seconds }) {
  const progress = total ? Math.round(((current + 1) / total) * 100) : 0
  return (
    <header className="quiz-header-card">
      <div className="quiz-title-copy"><span>Module Assessment</span><h1>{title}</h1><p>{answered} of {total} questions answered</p></div>
      <QuizTimer seconds={seconds} />
      <div className="quiz-question-progress"><div><span>Question {current + 1} of {total}</span><strong>{progress}%</strong></div><div className="quiz-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
    </header>
  )
}
