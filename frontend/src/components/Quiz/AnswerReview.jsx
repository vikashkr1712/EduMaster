export default function AnswerReview({ answers }) {
  return (
    <section className="quiz-review"><h2>Answer Review</h2><div className="quiz-review-list">{answers.map((answer, index) => (
      <article key={String(answer.question)} className={answer.correct ? 'is-correct' : 'is-wrong'}>
        <header><span>{answer.correct ? '✓' : '×'}</span><h3>{index + 1}. {answer.questionText}</h3></header>
        <p><strong>Your answer:</strong> {answer.selectedAnswer === null ? 'Not answered' : answer.options[answer.selectedAnswer]}</p>
        {!answer.correct && <p className="quiz-correct-answer"><strong>Correct answer:</strong> {answer.options[answer.correctAnswer]}</p>}
        <div><strong>Explanation</strong><p>{answer.explanation}</p></div>
      </article>
    ))}</div></section>
  )
}
