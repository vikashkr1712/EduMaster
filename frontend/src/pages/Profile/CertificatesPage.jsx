import { useState } from 'react'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import CertificateCard from '../../components/Certificates/CertificateCard.jsx'
import { CERTIFICATES } from '../../components/Certificates/certificatesData.js'
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
  const { info } = useNotifications()

  const visible = [...(tab === 'all'
    ? CERTIFICATES
    : CERTIFICATES.filter((c) => c.status === tab)
  )].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title)
    if (sort === 'oldest') return a.id.localeCompare(b.id)
    return b.id.localeCompare(a.id)
  })

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Certificates"
        subtitle="View and download your earned certificates."
        actions={
          <button type="button" className="cert-download-all" onClick={() => info('Certificate downloads are coming soon.')}>
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

        <p className="cert-count">
          Showing 1 – {visible.length} of {visible.length} certificates
        </p>

        <div className="cert-grid">
          {visible.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
