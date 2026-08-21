import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAdminSettings, updateAdminSettings } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminSettings.css'

const emptyForm = { platformName: '', platformDescription: '', supportEmail: '', supportPhone: '', registrationEnabled: true }
const errorCopy = (error) => {
  if (error?.status === 400) return error?.details?.[0]?.message || 'Review the highlighted settings and try again.'
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Your account does not have permission to manage platform settings.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE' || error?.code === 'TIMEOUT') return 'Unable to reach the settings service. Check your connection and retry.'
  return error?.message || 'Unable to load or save platform settings.'
}

export default function AdminSettingsPage() {
  const notifications = useNotifications()
  const [form, setForm] = useState(emptyForm)
  const [initial, setInitial] = useState(emptyForm)
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial])

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true); setError('')
    try {
      const response = await getAdminSettings()
      if (currentRequest !== requestId.current) return
      const settings = response?.data?.settings ?? emptyForm
      setForm(settings); setInitial(settings); setMetadata(response?.data?.metadata ?? null)
    } catch (requestError) {
      if (currentRequest === requestId.current) setError(errorCopy(requestError))
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => { load(); return () => { requestId.current += 1 } }, [load])
  useEffect(() => {
    const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const setField = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setError('') }
  const save = async (event) => {
    event.preventDefault()
    if (!dirty || saving) return
    setSaving(true); setError('')
    try {
      const response = await updateAdminSettings(form)
      const settings = response?.data?.settings ?? form
      setForm(settings); setInitial(settings); setMetadata(response?.data?.metadata ?? null)
      notifications.success('Settings updated successfully.')
    } catch (requestError) { setError(errorCopy(requestError)) } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-settings-loading" aria-busy="true" aria-label="Loading platform settings"><span /><span /><span /></div>
  if (error && !metadata) return <section className="admin-settings-state" role="alert"><AdminIcon name="settings" size={30} /><h1>Unable to load settings</h1><p>{error}</p><button type="button" onClick={load}>Retry</button></section>

  return <div className="admin-settings"><div className="admin-page-heading"><div><h1>Settings</h1><p>Manage safe platform configuration. Deployment secrets remain environment-only.</p></div>{dirty && <span className="admin-settings-dirty" role="status">Unsaved changes</span>}</div><form onSubmit={save}>
    <section className="admin-settings-section" aria-labelledby="general-settings-title"><div className="admin-settings-section__heading"><span className="admin-settings-section__icon"><AdminIcon name="courses" /></span><div><h2 id="general-settings-title">General</h2><p>Core display information stored for the EduMaster platform.</p></div></div><div className="admin-settings-fields"><label><span>Platform Name *</span><input required minLength="2" maxLength="60" value={form.platformName} onChange={(event) => setField('platformName', event.target.value)} /><small>Used as the canonical configured platform name. Existing page branding is intentionally unchanged.</small></label><label className="is-wide"><span>Platform Description</span><textarea rows="4" maxLength="300" value={form.platformDescription} onChange={(event) => setField('platformDescription', event.target.value)} /><small>{form.platformDescription.length}/300 characters</small></label></div></section>
    <section className="admin-settings-section" aria-labelledby="support-settings-title"><div className="admin-settings-section__heading"><span className="admin-settings-section__icon"><AdminIcon name="discussions" /></span><div><h2 id="support-settings-title">Support</h2><p>Validated contact information for platform support operations.</p></div></div><div className="admin-settings-fields"><label><span>Support Email *</span><input required type="email" maxLength="254" value={form.supportEmail} onChange={(event) => setField('supportEmail', event.target.value)} /><small>Stored for central support configuration; frozen student pages are not rewritten.</small></label><label><span>Support Phone</span><input type="tel" maxLength="30" value={form.supportPhone} onChange={(event) => setField('supportPhone', event.target.value)} placeholder="Optional" /><small>Optional. Use digits and normal telephone punctuation.</small></label></div></section>
    <section className="admin-settings-section" aria-labelledby="access-settings-title"><div className="admin-settings-section__heading"><span className="admin-settings-section__icon"><AdminIcon name="userCheck" /></span><div><h2 id="access-settings-title">Student Access</h2><p>Controls new account creation only. Existing sessions and login remain available.</p></div></div><label className="admin-settings-switch"><input type="checkbox" checked={form.registrationEnabled} onChange={(event) => setField('registrationEnabled', event.target.checked)} /><span aria-hidden="true" /><div><strong>Allow New Registrations</strong><small>{form.registrationEnabled ? 'New students can create accounts.' : 'New registration requests are blocked by the backend.'}</small></div></label></section>
    <aside className="admin-settings-security"><AdminIcon name="shield" /><div><strong>Deployment security is protected</strong><p>Database credentials, JWT secrets, API keys, payment credentials, SMTP credentials, ports, and security controls are never returned or editable here.</p></div></aside>
    {error && <div className="admin-inline-error" role="alert">{error}</div>}
    <div className="admin-settings-footer"><div>{metadata?.updatedAt ? <><strong>Last updated</strong><span>{new Date(metadata.updatedAt).toLocaleString()}{metadata.updatedBy?.name ? ` by ${metadata.updatedBy.name}` : ''}</span></> : <><strong>Using safe defaults</strong><span>Save once to create the platform configuration.</span></>}</div><button type="submit" className="admin-button admin-button--primary" disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save Changes'}</button></div>
  </form></div>
}
