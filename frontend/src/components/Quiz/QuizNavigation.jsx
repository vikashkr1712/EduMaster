export default function QuizNavigation({ current, total, answered, onJump, onPrevious, onNext, onSubmit, submitting }) {
  return (
    <>
      <nav className="quiz-dot-nav" aria-label="Question navigation">{Array.from({ length: total }, (_, index) => <button key={index} type="button" className={`${index === current ? 'is-current ' : ''}${answered.has(index) ? 'is-answered' : ''}`} onClick={() => onJump(index)} aria-label={`Go to question ${index + 1}`}>{index + 1}</button>)}</nav>
      <div className="quiz-actions"><button type="button" className="quiz-secondary" disabled={current === 0 || submitting} onClick={onPrevious}>← Previous</button>{current < total - 1 ? <button type="button" className="quiz-primary" onClick={onNext}>Next Question →</button> : <button type="button" className="quiz-submit" disabled={submitting} onClick={onSubmit}>{submitting ? 'Submitting…' : 'Submit Quiz'}</button>}</div>
    </>
  )
}
