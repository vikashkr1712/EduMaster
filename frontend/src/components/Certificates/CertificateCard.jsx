import { lazy, Suspense } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { downloadCertificatePdf } from '../../api/certificate.js'

const CertificatePreview = lazy(() => import('./CertificatePreview.jsx'))

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

function VerifyIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}><path d="m7.5 12 3 3 6-6"/><circle cx="12" cy="12" r="9"/></svg>
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
  const title = certificate.course?.title || 'EduMaster Course'
  const category = certificate.course?.category || 'Course'
  const instructor = certificate.course?.instructor || 'EduMaster Instructor'
  const completedOn = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(certificate.completionDate))
  const issuedOn = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(certificate.issueDate))
  const verificationUrl = `${window.location.origin}/certificate/verify/${certificate.verificationCode}`

  return (
    <article className="cert-card">
      <Suspense fallback={<div className="cert-preview cert-preview-loading">Preparing preview…</div>}>
        <CertificatePreview variant="blue" name={user?.name || 'Learner'} course={title} instructor={instructor} />
      </Suspense>

      <div className="cert-card-body">
        <div className="cert-card-pills">
          <span className="profile-pill profile-pill--blue">{category}</span>
          <span className={`profile-pill ${certificate.status === 'valid' ? 'profile-pill--green' : 'cert-pill--orange'}`}>{certificate.status === 'valid' ? 'Valid' : 'Revoked'}</span>
        </div>

        <h4 className="cert-card-title">{title}</h4>

        <div className="cert-card-details">
          <p className="cert-card-meta"><CalendarIcon /> Completed on {completedOn}</p>
          <p className="cert-card-meta">Issued on {issuedOn}</p>
          <p className="cert-card-meta">Instructor: {instructor}</p>
          <p className="cert-card-meta">Certificate ID: {certificate.certificateNumber}</p>
        </div>

        <div className="cert-card-actions">
          <button
            type="button"
            className="cert-btn cert-btn--blue"
            onClick={() => downloadCertificatePdf(certificate.certificateNumber).catch((requestError) => info(requestError.message || 'Could not download this certificate.'))}
          ><DownloadIcon /> Download</button>
          <button type="button" className="cert-btn cert-btn--blue" onClick={() => navigate(`/certificate/verify/${certificate.verificationCode}`)}><VerifyIcon /> Verify</button>
          <button
            type="button"
            className="cert-btn cert-btn--blue"
            onClick={async () => {
              const shareData = { title: 'EduMaster Certificate', text: `${title} certificate from EduMaster`, url: verificationUrl }
              if (navigator.share) {
                try { await navigator.share(shareData) } catch (error) { if (error.name !== 'AbortError') info('Sharing is not available on this device.') }
                return
              }
              try { await navigator.clipboard.writeText(verificationUrl); success('Verification link copied to your clipboard.') } catch { info('Sharing is not available on this device.') }
            }}
          ><ShareIcon /> Share</button>
        </div>
      </div>
    </article>
  )
}
