export default function OptionButton({ index, text, selected, onSelect }) {
  return <button type="button" className={`quiz-option${selected ? ' is-selected' : ''}`} onClick={onSelect}><span>{String.fromCharCode(65 + index)}</span><strong>{text}</strong><i aria-hidden="true">{selected ? '●' : '○'}</i></button>
}
