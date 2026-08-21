import { useEffect, useId, useRef, useState } from 'react'
import AdminIcon from './AdminIcons.jsx'

const RESOURCE_TYPES = ['PDF', 'ZIP', 'Source Code', 'Slides', 'Assignment']
const emptyResource = () => ({ resourceId: '', title: '', type: 'PDF', url: '', size: '' })
const lessonDefaults = { title: '', duration: '', videoId: '', videoProvider: '', resources: [] }

export default function AdminCurriculumFormModal({ open, kind, item, pending, onClose, onSubmit }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [form, setForm] = useState(lessonDefaults)
  const [errors, setErrors] = useState({})
  const editing = Boolean(item)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(kind === 'module'
      ? { title: item?.title || '' }
      : {
          title: item?.title || '', duration: item?.duration || '', videoId: item?.videoId || '',
          videoProvider: item?.videoProvider || '',
          resources: (item?.resources || []).map((resource) => ({ ...resource, size: resource.size || '' })),
        })
    const previousFocus = document.activeElement
    window.setTimeout(() => firstFieldRef.current?.focus(), 0)
    const handleKey = (event) => {
      if (event.key === 'Escape' && !pending) onClose()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('input, select, button:not(:disabled)') || []
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus?.() }
  }, [item, kind, onClose, open, pending])

  if (!open) return null

  const resources = Array.isArray(form.resources) ? form.resources : []
  const setField = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: '' })) }
  const updateResource = (index, name, value) => setForm((current) => ({
    ...current,
    resources: (current.resources || []).map((resource, resourceIndex) => resourceIndex === index ? { ...resource, [name]: value } : resource),
  }))
  const removeResource = (index) => setForm((current) => ({ ...current, resources: (current.resources || []).filter((_, resourceIndex) => resourceIndex !== index) }))
  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = `${kind === 'module' ? 'Module' : 'Lesson'} title is required.`
    if (kind === 'lesson') {
      if (!/^\d{1,3}:[0-5]\d$/.test((form.duration || '').trim())) next.duration = 'Use minutes:seconds, for example 12:30.'
      if (!(form.videoId || '').trim()) next.videoId = 'A YouTube URL or video ID is required.'
      if (resources.some((resource) => !resource.title.trim() || !resource.url.trim())) next.resources = 'Every resource needs a title and URL.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    const payload = kind === 'module' ? { title: form.title.trim() } : {
      title: form.title.trim(), duration: (form.duration || '').trim(), videoId: (form.videoId || '').trim(),
      videoProvider: (form.videoProvider || '').trim(),
      resources: resources.map((resource) => ({
        ...(resource.resourceId ? { resourceId: resource.resourceId } : {}),
        title: resource.title.trim(), type: resource.type, url: resource.url.trim(),
        ...(resource.size.trim() ? { size: resource.size.trim() } : {}),
      })),
    }
    onSubmit(payload)
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !pending && onClose()}>
      <section className="admin-curriculum-form-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="admin-curriculum-form-modal__header">
          <div><span>{kind === 'module' ? 'Curriculum structure' : 'Learning content'}</span><h2 id={titleId}>{editing ? 'Edit' : 'Add'} {kind === 'module' ? 'Module' : 'Lesson'}</h2></div>
          <button type="button" onClick={onClose} disabled={pending} aria-label={`Close ${kind} form`}><AdminIcon name="close" /></button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="admin-curriculum-fields">
            <label><span>{kind === 'module' ? 'Module' : 'Lesson'} title *</span><input ref={firstFieldRef} value={form.title} onChange={(event) => setField('title', event.target.value)} maxLength={120} aria-invalid={Boolean(errors.title)} />{errors.title && <small role="alert">{errors.title}</small>}</label>
            {kind === 'lesson' && <>
              <div className="admin-curriculum-field-row">
                <label><span>Duration *</span><input value={form.duration || ''} onChange={(event) => setField('duration', event.target.value)} placeholder="12:30" aria-invalid={Boolean(errors.duration)} />{errors.duration && <small role="alert">{errors.duration}</small>}</label>
                <label><span>Video provider</span><input value={form.videoProvider || ''} onChange={(event) => setField('videoProvider', event.target.value)} placeholder="YouTube" maxLength={100} /></label>
              </div>
              <label><span>YouTube URL or video ID *</span><input value={form.videoId || ''} onChange={(event) => setField('videoId', event.target.value)} placeholder="https://youtube.com/watch?v=…" aria-invalid={Boolean(errors.videoId)} /><em>Stored as the video ID expected by the student player.</em>{errors.videoId && <small role="alert">{errors.videoId}</small>}</label>
              <fieldset className="admin-resource-editor">
                <div className="admin-resource-editor__heading"><div><legend>Lesson resources</legend><p>Link existing HTTP/HTTPS learning materials.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, resources: [...(current.resources || []), emptyResource()] }))}><AdminIcon name="plus" size={16} />Add resource</button></div>
                {resources.length === 0 ? <p className="admin-resource-editor__empty">No resources attached.</p> : resources.map((resource, index) => <div className="admin-resource-row" key={resource.resourceId || `new-${index}`}>
                  <label><span>Title *</span><input value={resource.title} onChange={(event) => updateResource(index, 'title', event.target.value)} /></label>
                  <label><span>Type *</span><select value={resource.type} onChange={(event) => updateResource(index, 'type', event.target.value)}>{RESOURCE_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
                  <label className="admin-resource-row__url"><span>URL *</span><input type="url" value={resource.url} onChange={(event) => updateResource(index, 'url', event.target.value)} /></label>
                  <label><span>Size label</span><input value={resource.size} onChange={(event) => updateResource(index, 'size', event.target.value)} placeholder="Open resource" /></label>
                  <button type="button" className="admin-resource-row__remove" onClick={() => removeResource(index)} aria-label={`Remove resource ${index + 1}`}><AdminIcon name="trash" size={16} /></button>
                </div>)}
                {errors.resources && <small role="alert">{errors.resources}</small>}
              </fieldset>
            </>}
          </div>
          <div className="admin-curriculum-form-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={pending}>Cancel</button><button type="submit" className="admin-button admin-button--primary" disabled={pending}>{pending ? 'Saving…' : `${editing ? 'Save' : 'Add'} ${kind === 'module' ? 'module' : 'lesson'}`}</button></div>
        </form>
      </section>
    </div>
  )
}
