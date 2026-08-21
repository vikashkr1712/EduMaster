import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import { verifyCertificate } from '../../api/certificate.js'
import './CertificateVerifyPage.css'

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit', month: 'long', year: 'numeric',
}).format(new Date(value))

export default function CertificateVerifyPage() {
  const { code } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    verifyCertificate(code)
      .then((response) => { if (active) setCertificate(response?.data?.certificate || null) })
      .catch(() => { if (active) setLoadError('We could not verify this certificate. Check the verification link and try again.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [code])

  const valid = certificate?.status === 'valid'

  return (
    <>
      <Navbar />
      <main className="verify-page">
        <div className="container verify-shell">
          {loading ? (
            <section className="verify-card verify-state"><span className="verify-loader" /><p>Verifying certificate…</p></section>
          ) : !certificate || loadError ? (
            <section className="verify-card verify-state is-invalid">
              <span className="verify-icon">×</span><p className="verify-eyebrow">Verification failed</p>
              <h1>Certificate not found</h1><p>{loadError}</p><Link to="/courses">Explore EduMaster courses</Link>
            </section>
          ) : (
            <section className={`verify-card${valid ? '' : ' is-invalid'}`}>
              <div className="verify-heading">
                <span className="verify-icon">{valid ? '✓' : '!'}</span>
                <p className="verify-eyebrow">EduMaster certificate verification</p>
                <h1>{valid ? 'Certificate is Valid' : 'Certificate Revoked'}</h1>
                <p>{valid ? 'This credential was issued by EduMaster and its details have been verified.' : 'This credential is no longer valid.'}</p>
              </div>
              <div className="verify-details">
                <div><span>Learner</span><strong>{certificate.user?.name}</strong></div>
                <div><span>Course</span><strong>{certificate.course?.title}</strong></div>
                <div><span>Instructor</span><strong>{certificate.course?.instructor}</strong></div>
                <div><span>Completion date</span><strong>{formatDate(certificate.completionDate)}</strong></div>
                <div><span>Issue date</span><strong>{formatDate(certificate.issueDate)}</strong></div>
                <div><span>Certificate ID</span><strong>{certificate.certificateNumber}</strong></div>
              </div>
              <p className="verify-code">Verification code: <strong>{certificate.verificationCode}</strong></p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
