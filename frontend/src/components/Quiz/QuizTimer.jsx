const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export default function QuizTimer({ seconds }) {
  const urgent = seconds <= 60
  return <div className={`quiz-timer${urgent ? ' is-urgent' : ''}`} role="timer" aria-live="polite"><span>◷</span><div><small>Time Remaining</small><strong>{formatTime(seconds)}</strong></div></div>
}
