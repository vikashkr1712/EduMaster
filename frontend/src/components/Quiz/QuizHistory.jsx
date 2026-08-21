const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export default function QuizHistory({ attempts = [] }) {
  if (!attempts.length) return null
  return <aside className="quiz-history"><h2>Recent Attempts</h2><div>{attempts.slice(0, 5).map((attempt) => <article key={attempt._id}><span className={attempt.passed ? 'is-passed' : 'is-failed'}>{attempt.score}%</span><div><strong>{attempt.quiz?.title || 'Assessment'}</strong><small>{formatDate(attempt.completedAt)} · Attempt {attempt.attemptNumber}</small></div><b>{attempt.passed ? 'Passed' : 'Failed'}</b></article>)}</div></aside>
}
