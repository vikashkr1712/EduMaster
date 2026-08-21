function Arrow({ right }) { return <span aria-hidden="true">{right ? '→' : '←'}</span> }

export default function PlayerNavigation({ hasPrevious, hasNext, completed, onPrevious, onNext, onComplete, quiz, onQuiz }) {
  return (
    <nav className="learn-player-nav" aria-label="Lesson navigation">
      <button type="button" className="learn-nav-secondary" disabled={!hasPrevious} onClick={onPrevious}><Arrow /> Previous Lesson</button>
      {quiz && !quiz.passed ? <button type="button" className="learn-complete-button" onClick={onQuiz}>Take Quiz</button> : <button type="button" className={`learn-complete-button${completed ? ' is-complete' : ''}`} onClick={onComplete} disabled={completed}>{completed ? '✓ Lesson Completed' : 'Mark Complete'}</button>}
      <button type="button" className="learn-nav-primary" disabled={!hasNext} onClick={onNext}>Next Lesson <Arrow right /></button>
    </nav>
  )
}
