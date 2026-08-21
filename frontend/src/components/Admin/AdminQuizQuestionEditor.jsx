import AdminIcon from './AdminIcons.jsx'

export const blankQuestion = () => ({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'Medium' })

export default function AdminQuizQuestionEditor({ question, index, total, locked, saving, onChange, onSave, onMove, onDelete }) {
  const setField = (field, value) => onChange({ ...question, [field]: value })
  const setOption = (optionIndex, value) => setField('options', question.options.map((option, current) => current === optionIndex ? value : option))

  return (
    <article className="admin-question-card">
      <div className="admin-question-card__heading"><div><span>Question {index + 1}</span><strong>{question.question || 'Untitled question'}</strong></div><div className="admin-question-card__actions"><button type="button" onClick={() => onMove(-1)} disabled={locked || saving || index === 0} aria-label={`Move question ${index + 1} up`}><AdminIcon name="up" size={17} /></button><button type="button" onClick={() => onMove(1)} disabled={locked || saving || index === total - 1} aria-label={`Move question ${index + 1} down`}><AdminIcon name="down" size={17} /></button>{onDelete && <button type="button" onClick={onDelete} disabled={locked || saving} aria-label={`Delete question ${index + 1}`}><AdminIcon name="trash" size={17} /></button>}</div></div>
      <label className="admin-field admin-field--wide"><span>Question *</span><textarea rows="3" value={question.question} onChange={(event) => setField('question', event.target.value)} maxLength="1000" required /></label>
      <fieldset className="admin-question-options"><legend>Options and correct answer *</legend>{question.options.map((option, optionIndex) => <label key={optionIndex} className="admin-question-option"><input type="radio" name={`correct-${question._id || index}`} checked={Number(question.correctAnswer) === optionIndex} onChange={() => setField('correctAnswer', optionIndex)} disabled={locked} /><span>{String.fromCharCode(65 + optionIndex)}</span><input value={option} onChange={(event) => setOption(optionIndex, event.target.value)} maxLength="500" required disabled={locked} aria-label={`Option ${String.fromCharCode(65 + optionIndex)}`} /></label>)}</fieldset>
      {locked && <p className="admin-inline-note">Options and the correct answer are locked because learner attempts exist.</p>}
      <div className="admin-form-grid"><label className="admin-field admin-field--wide"><span>Explanation *</span><textarea rows="3" value={question.explanation} onChange={(event) => setField('explanation', event.target.value)} maxLength="1500" required /></label><label className="admin-field"><span>Difficulty</span><select value={question.difficulty} onChange={(event) => setField('difficulty', event.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label></div>
      {onSave && <div className="admin-question-card__footer"><button type="button" className="admin-button admin-button--secondary" onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save question'}</button></div>}
    </article>
  )
}
