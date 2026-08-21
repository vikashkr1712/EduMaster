import { Link } from 'react-router-dom'
import './StatusPage.css'

export default function StatusPage({ code, title, message, primaryLabel, primaryTo, onPrimary }) {
  const action = primaryTo
    ? <Link className="status-page__button" to={primaryTo}>{primaryLabel}</Link>
    : <button className="status-page__button" type="button" onClick={onPrimary}>{primaryLabel}</button>
  return (
    <main className="status-page">
      <div className="status-page__card">
        <span className="status-page__code">{code}</span>
        <h1>{title}</h1>
        <p>{message}</p>
        {action}
      </div>
    </main>
  )
}
