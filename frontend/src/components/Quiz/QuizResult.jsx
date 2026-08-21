import ScoreCircle from './ScoreCircle.jsx'
import AnswerReview from './AnswerReview.jsx'

export default function QuizResult({ result, onContinue, onRetry }) {
  const { attempt, quiz } = result
  return (
    <div className="quiz-result-wrap">
      <section className={`quiz-result-card${attempt.passed ? ' is-passed' : ' is-failed'}`}>
        <ScoreCircle score={attempt.score} passed={attempt.passed} />
        <div className="quiz-result-copy"><span>{attempt.passed ? 'Assessment Passed' : 'Keep Learning'}</span><h1>{attempt.passed ? 'Great work! You passed.' : 'You can try again.'}</h1><p>{attempt.passed ? 'Your lesson progress has been updated and you can continue learning.' : `A score of ${quiz.passingMarks}% is required to pass this assessment.`}</p></div>
        <div className="quiz-result-stats"><div><strong>{attempt.correctAnswers}</strong><span>Correct</span></div><div><strong>{attempt.wrongAnswers}</strong><span>Wrong</span></div><div><strong>{quiz.passingMarks}%</strong><span>Passing score</span></div></div>
        <button type="button" onClick={attempt.passed ? onContinue : onRetry}>{attempt.passed ? 'Continue Learning →' : 'Retry Quiz ↻'}</button>
      </section>
      <AnswerReview answers={attempt.answers || []} />
    </div>
  )
}
