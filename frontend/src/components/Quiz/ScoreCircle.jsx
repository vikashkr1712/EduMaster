export default function ScoreCircle({ score, passed }) {
  return <div className={`quiz-score-circle${passed ? ' is-passed' : ' is-failed'}`} style={{ '--quiz-score': `${score * 3.6}deg` }}><div><strong>{score}%</strong><span>Score</span></div></div>
}
