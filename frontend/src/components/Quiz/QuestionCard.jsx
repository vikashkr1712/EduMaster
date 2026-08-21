import OptionButton from './OptionButton.jsx'

export default function QuestionCard({ question, selectedAnswer, onAnswer }) {
  return (
    <section className="quiz-question-card">
      <div className="quiz-question-meta"><span>{question.difficulty}</span><small>Select one answer</small></div>
      <h2>{question.question}</h2>
      <div className="quiz-options">{question.options.map((option, index) => <OptionButton key={option} index={index} text={option} selected={selectedAnswer === index} onSelect={() => onAnswer(index)} />)}</div>
    </section>
  )
}
