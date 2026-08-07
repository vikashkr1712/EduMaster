import { useAuth } from '../Auth/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import CertificatePreview from './CertificatePreview.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="6" r="2.6" />
      <circle cx="17.5" cy="18" r="2.6" />
      <path d="m8.4 10.8 6.8-3.6M8.4 13.2l6.8 3.6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

export default function CertificateCard({ certificate }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { info, success } = useNotifications()
  const { title, category, categoryTint, status, completedOn, progress, variant, instructor } = certificate
  const completed = status === 'Completed'

  return (
    <article className="cert-card">
      <CertificatePreview
        variant={variant}
        name={user?.name || 'Learner'}
        course={title}
        instructor={instructor}
      />

      <div className="cert-card-body">
        <div className="cert-card-pills">
          <span className={`profile-pill profile-pill--${categoryTint}`}>{category}</span>
          <span className={`profile-pill ${completed ? 'profile-pill--green' : 'cert-pill--orange'}`}>
            {status}
          </span>
        </div>

        <h4 className="cert-card-title">{title}</h4>

        {completed ? (
          <p className="cert-card-meta">
            <CalendarIcon /> Completed on {completedOn}
          </p>
        ) : (
          <div className="cert-card-progress">
            <p className="cert-card-meta">
              <CalendarIcon /> {progress}% Complete
            </p>
            <div
              className="cert-progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${title} progress`}
            >
              <div className="cert-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="cert-card-actions">
          {completed ? (
            <>
              <button type="button" className="cert-btn cert-btn--blue" onClick={() => info('Certificate downloads are coming soon.')}>
                <DownloadIcon /> Download
              </button>
              <button
                type="button"
                className="cert-btn cert-btn--blue"
                onClick={async () => {
                  const shareText = `${title} certificate from EduMaster`
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: 'EduMaster Certificate', text: shareText })
                    } catch (error) {
                      if (error.name !== 'AbortError') info('Sharing is not available on this device.')
                    }
                    return
                  }
                  try {
                    await navigator.clipboard.writeText(shareText)
                    success('Certificate details copied to your clipboard.')
                  } catch {
                    info('Sharing is not available on this device.')
                  }
                }}
              >
                <ShareIcon /> Share
              </button>
            </>
          ) : (
            <>
              <button type="button" className="cert-btn cert-btn--orange" onClick={() => navigate('/courses')}>Continue Learning</button>
              <button type="button" className="cert-btn cert-btn--orange" onClick={() => info('Certificate details are coming soon.')}>Details</button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
