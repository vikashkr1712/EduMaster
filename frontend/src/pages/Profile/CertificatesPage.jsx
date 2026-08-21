import { useEffect, useMemo, useState } from 'react'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import CertificateCard from '../../components/Certificates/CertificateCard.jsx'
import { downloadCertificatePdf, getCertificates } from '../../api/certificate.js'
import '../../components/Certificates/Certificates.css'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
    </svg>
  )
}

function CertBadgeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
      <circle cx="12" cy="10" r="2.4" />
      <path d="M10.3 12.2 9 17.5l3-1.6 3 1.6-1.3-5.3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-4.9" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

const TABS = [
  { key: 'all', label: 'All Certificates', icon: CertBadgeIcon },
  { key: 'Completed', label: 'Completed', icon: CheckIcon },
  { key: 'In Progress', label: 'In Progress', icon: ClockIcon },
]

export default function CertificatesPage() {
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('recent')
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const { info, error } = useNotifications()

  useEffect(() => {
    let active = true
    getCertificates()
      .then((response) => {
        if (active) setCertificates(Array.isArray(response?.data?.certificates) ? response.data.certificates : [])
      })
      .catch((error) => { if (active) setLoadError(error.message || 'Could not load your certificates.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visible = useMemo(() => [...(tab === 'all'
    ? certificates
    : tab === 'Completed' ? certificates.filter((certificate) => certificate.status === 'valid') : []
  )].sort((a, b) => {
    if (sort === 'title') return (a.course?.title || '').localeCompare(b.course?.title || '')
    if (sort === 'oldest') return new Date(a.issueDate) - new Date(b.issueDate)
    return new Date(b.issueDate) - new Date(a.issueDate)
  }), [certificates, sort, tab])

  const downloadAll = async () => {
    if (!certificates.length) {
      info('You do not have certificates to download yet.')
      return
    }
    try {
      for (const certificate of certificates) {
        await downloadCertificatePdf(certificate.certificateNumber)
      }
    } catch (requestError) {
      error(requestError.message || 'Could not download all certificates.')
    }
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Certificates"
        subtitle="View and download your earned certificates."
        actions={
          <button type="button" className="cert-download-all" onClick={downloadAll} disabled={loading}>
            <DownloadIcon /> Download All
          </button>
        }
      />
      <DashboardContent>
        <div className="cert-toolbar">
          <div className="cert-tabs" role="tablist" aria-label="Filter certificates">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`cert-tab${tab === key ? ' is-active' : ''}`}
                onClick={() => setTab(key)}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>

          <label className="cert-sort">
            Sort by:
            <select className="cert-sort-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort certificates">
              <option value="recent">Recently Earned</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title: A to Z</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="cert-state"><span className="cert-loader" /><p>Loading your certificates…</p></div>
        ) : loadError ? (
          <div className="cert-state"><h3>Unable to load certificates</h3><p>{loadError}</p></div>
        ) : (
          <>
            <p className="cert-count">Showing {visible.length} of {certificates.length} certificates</p>
            {visible.length > 0 ? (
              <div className="cert-grid">
                {visible.map((certificate) => <CertificateCard key={certificate._id} certificate={certificate} />)}
              </div>
            ) : (
              <div className="cert-state"><h3>{certificates.length ? 'No certificates in this filter' : 'No certificates yet'}</h3><p>Complete a course to unlock your verified EduMaster certificate.</p></div>
            )}
          </>
        )}
      </DashboardContent>
    </DashboardLayout>
  )
}
