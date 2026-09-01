import { useEffect, useId, useRef, useState } from 'react'
import { uploadAdminCourseThumbnail } from '../../api/admin.js'
import { normalizeYouTubeVideoId } from '../../utils/youtube.js'
import LessonThumbnail from '../Learning/LessonThumbnail.jsx'
import VideoSection from '../Learning/VideoSection.jsx'
import AdminIcon from './AdminIcons.jsx'

const RESOURCE_TYPES = ['PDF', 'ZIP', 'Source Code', 'Slides', 'Assignment']
const ALLOWED_THUMBNAIL_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024
const emptyResource = () => ({ resourceId: '', title: '', type: 'PDF', url: '', size: '' })
const lessonDefaults = { title: '', duration: '', videoId: '', videoProvider: 'YouTube', thumbnail: '', resources: [] }

function AdminLessonPreviewDialog({ lesson, resources, open, onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href]') || []
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus?.() }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="admin-modal-backdrop admin-lesson-preview-backdrop">
      <section className="admin-lesson-preview-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid="admin-lesson-preview-dialog">
        <header>
          <div><span>Student lesson appearance</span><h2 id={titleId}>Preview: {lesson.title || 'Untitled lesson'}</h2><p>This preview uses the same video component and lesson data as the learner course player.</p></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close lesson preview" title="Close lesson preview"><AdminIcon name="close" /></button>
        </header>
        <div className="admin-lesson-preview-dialog__body">
          <div className="admin-lesson-preview-dialog__meta"><strong>{lesson.title || 'Untitled lesson'}</strong><span>{lesson.videoProvider || 'YouTube'} · {lesson.duration || 'No duration'}</span></div>
          <VideoSection key={`${lesson.videoId}-${lesson.thumbnail}`} lesson={lesson} />
          <section className="admin-lesson-preview-resources" aria-label="Lesson resources preview">
            <h3>Lesson resources</h3>
            {resources.length === 0 ? <p>No resources attached.</p> : <ul>{resources.map((resource, index) => <li key={resource.resourceId || index}><span><strong>{resource.title || 'Untitled resource'}</strong><small>{resource.type}{resource.size ? ` · ${resource.size}` : ''}</small></span><a href={resource.url} target="_blank" rel="noreferrer">Open resource</a></li>)}</ul>}
          </section>
        </div>
      </section>
    </div>
  )
}

export default function AdminCurriculumFormModal({ open, kind, item, pending, onClose, onSubmit }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const thumbnailInputRef = useRef(null)
  const busyRef = useRef(false)
  const onCloseRef = useRef(onClose)
  const [form, setForm] = useState(lessonDefaults)
  const [errors, setErrors] = useState({})
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const editing = Boolean(item)

  useEffect(() => {
    if (!open) return undefined
    setErrors({})
    setThumbnailFile(null)
    setPreviewOpen(false)
    setForm(kind === 'module'
      ? { title: item?.title || '' }
      : {
          title: item?.title || '', duration: item?.duration || '', videoId: item?.videoId || '',
          videoProvider: item?.videoProvider || 'YouTube', thumbnail: item?.thumbnail || '',
          resources: (item?.resources || []).map((resource) => ({ ...resource, size: resource.size || '' })),
        })
    const previousFocus = document.activeElement
    window.setTimeout(() => firstFieldRef.current?.focus(), 0)
    const handleKey = (event) => {
      if (dialogRef.current?.getAttribute('aria-hidden') === 'true') return
      if (event.key === 'Escape' && !busyRef.current) onCloseRef.current()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('input, select, button:not(:disabled), a[href]') || []
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus?.() }
  }, [item, kind, open])

  useEffect(() => { busyRef.current = Boolean(pending || uploading) }, [pending, uploading])
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!thumbnailFile) { setThumbnailPreview(''); return undefined }
    const objectUrl = URL.createObjectURL(thumbnailFile)
    setThumbnailPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [thumbnailFile])

  if (!open) return null

  const resources = Array.isArray(form.resources) ? form.resources : []
  const normalizedVideoId = normalizeYouTubeVideoId(form.videoId)
  const previewLesson = { ...form, videoId: normalizedVideoId || form.videoId, thumbnail: thumbnailPreview || form.thumbnail }
  const busy = pending || uploading
  const setField = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: '' })) }
  const updateResource = (index, name, value) => setForm((current) => ({ ...current, resources: (current.resources || []).map((resource, resourceIndex) => resourceIndex === index ? { ...resource, [name]: value } : resource) }))
  const removeResource = (index) => setForm((current) => ({ ...current, resources: (current.resources || []).filter((_, resourceIndex) => resourceIndex !== index) }))
  const chooseThumbnail = (file) => {
    if (!file) return
    if (!ALLOWED_THUMBNAIL_TYPES.has(file.type)) {
      setErrors((current) => ({ ...current, thumbnail: 'Choose a JPG, PNG, or WebP image.' }))
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
      return
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setErrors((current) => ({ ...current, thumbnail: 'Lesson thumbnail must be 5 MB or smaller.' }))
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
      return
    }
    setThumbnailFile(file)
    setErrors((current) => ({ ...current, thumbnail: '' }))
  }
  const useYouTubeThumbnail = () => {
    setThumbnailFile(null)
    setField('thumbnail', '')
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }
  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = `${kind === 'module' ? 'Module' : 'Lesson'} title is required.`
    if (kind === 'lesson') {
      if (!/^\d{1,3}:[0-5]\d$/.test((form.duration || '').trim())) next.duration = 'Use minutes:seconds, for example 12:30.'
      if (!normalizedVideoId) next.videoId = 'Enter a valid YouTube URL or 11-character video ID.'
      if (resources.some((resource) => !resource.title.trim() || !resource.url.trim())) next.resources = 'Every resource needs a title and URL.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    if (kind === 'module') { await onSubmit({ title: form.title.trim() }); return }

    setUploading(Boolean(thumbnailFile))
    try {
      let thumbnail = form.thumbnail.trim()
      if (thumbnailFile) {
        const response = await uploadAdminCourseThumbnail(thumbnailFile)
        thumbnail = response?.data?.thumbnail || ''
        if (!thumbnail) throw new Error('The uploaded thumbnail URL was not returned.')
      }
      await onSubmit({
        title: form.title.trim(), duration: form.duration.trim(), videoId: normalizedVideoId,
        videoProvider: form.videoProvider.trim() || 'YouTube', thumbnail,
        resources: resources.map((resource) => ({
          ...(resource.resourceId ? { resourceId: resource.resourceId } : {}),
          title: resource.title.trim(), type: resource.type, url: resource.url.trim(),
          ...(resource.size.trim() ? { size: resource.size.trim() } : {}),
        })),
      })
    } catch (error) {
      setErrors((current) => ({ ...current, thumbnail: error?.message || 'Unable to upload this thumbnail.' }))
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
        <section className={`admin-curriculum-form-modal${kind === 'lesson' ? ' is-lesson-editor' : ''}`} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-hidden={previewOpen ? 'true' : undefined} data-testid="admin-curriculum-form-modal">
          <div className="admin-curriculum-form-modal__header">
            <div><span>{kind === 'module' ? 'Curriculum structure' : 'Learning content'}</span><h2 id={titleId}>{editing ? 'Edit' : 'Add'} {kind === 'module' ? 'Module' : 'Lesson'}</h2></div>
            <button type="button" onClick={onClose} disabled={busy} aria-label={`Close ${kind} form`} title={`Close ${kind} form`}><AdminIcon name="close" /></button>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="admin-curriculum-fields">
              <label><span>{kind === 'module' ? 'Module' : 'Lesson'} title *</span><input ref={firstFieldRef} value={form.title} onChange={(event) => setField('title', event.target.value)} maxLength={120} aria-invalid={Boolean(errors.title)} />{errors.title && <small role="alert">{errors.title}</small>}</label>
              {kind === 'lesson' && <>
                <div className="admin-curriculum-field-row">
                  <label><span>Duration *</span><input value={form.duration || ''} onChange={(event) => setField('duration', event.target.value)} placeholder="12:30" aria-invalid={Boolean(errors.duration)} />{errors.duration && <small role="alert">{errors.duration}</small>}</label>
                  <label><span>Video provider</span><input value={form.videoProvider || ''} onChange={(event) => setField('videoProvider', event.target.value)} placeholder="YouTube" maxLength={100} /></label>
                </div>
                <label><span>YouTube URL or video ID *</span><input value={form.videoId || ''} onChange={(event) => setField('videoId', event.target.value)} placeholder="https://youtube.com/watch?v=…" aria-invalid={Boolean(errors.videoId)} /><em>Enter a full YouTube URL, youtu.be URL, or an 11-character video ID. EduMaster stores the normalized video ID.</em>{errors.videoId && <small role="alert">{errors.videoId}</small>}</label>

                <section className="admin-lesson-media-editor" aria-labelledby="lesson-media-heading">
                  <div className="admin-lesson-media-editor__heading"><div><h3 id="lesson-media-heading">Preview for students</h3><p>This uses the same lesson title, thumbnail, video, and player component as the learner experience.</p></div></div>
                  <div className="admin-lesson-media-grid">
                    <div className="admin-lesson-thumbnail-panel">
                      <span>Thumbnail</span>
                      <div className="admin-lesson-thumbnail-frame"><LessonThumbnail lesson={previewLesson} source={previewLesson.thumbnail} eager /></div>
                      <input ref={thumbnailInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => chooseThumbnail(event.target.files?.[0])} hidden />
                      <button type="button" onClick={() => thumbnailInputRef.current?.click()} disabled={busy}><AdminIcon name="camera" size={17} />{thumbnailFile || form.thumbnail ? 'Replace thumbnail' : 'Upload thumbnail'}<small>JPG, PNG, or WebP · up to 5 MB</small></button>
                      <button type="button" onClick={useYouTubeThumbnail} disabled={busy || !normalizedVideoId}><span className="admin-youtube-mark" aria-hidden="true">▶</span>Use YouTube thumbnail<small>Derived from the current video</small></button>
                    </div>
                    <div className="admin-lesson-player-panel">
                      <span>Student player preview</span>
                      <VideoSection key={`${previewLesson.videoId}-${previewLesson.thumbnail}`} lesson={previewLesson} />
                      <div className="admin-lesson-player-meta"><strong>{form.title || 'Untitled lesson'}</strong><span>{form.videoProvider || 'YouTube'} · {form.duration || 'No duration'}</span></div>
                      <button type="button" className="admin-lesson-open-preview" onClick={() => setPreviewOpen(true)} disabled={!normalizedVideoId}><AdminIcon name="external" size={17} />Preview in Admin</button>
                    </div>
                  </div>
                  {errors.thumbnail && <small className="admin-lesson-thumbnail-error" role="alert">{errors.thumbnail}</small>}
                </section>

                <fieldset className="admin-resource-editor">
                  <div className="admin-resource-editor__heading"><div><legend>Lesson resources</legend><p>Link existing HTTP/HTTPS learning materials.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, resources: [...(current.resources || []), emptyResource()] }))}><AdminIcon name="plus" size={16} />Add resource</button></div>
                  {resources.length === 0 ? <p className="admin-resource-editor__empty">No resources attached.</p> : resources.map((resource, index) => <div className="admin-resource-row" key={resource.resourceId || `new-${index}`}>
                    <label><span>Title *</span><input value={resource.title} onChange={(event) => updateResource(index, 'title', event.target.value)} /></label>
                    <label><span>Type *</span><select value={resource.type} onChange={(event) => updateResource(index, 'type', event.target.value)}>{RESOURCE_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
                    <label className="admin-resource-row__url"><span>URL *</span><input type="url" value={resource.url} onChange={(event) => updateResource(index, 'url', event.target.value)} /></label>
                    <label><span>Size label</span><input value={resource.size} onChange={(event) => updateResource(index, 'size', event.target.value)} placeholder="Open resource" /></label>
                    <button type="button" className="admin-resource-row__remove" onClick={() => removeResource(index)} aria-label={`Remove resource ${index + 1}`} title="Remove resource"><AdminIcon name="trash" size={16} /></button>
                  </div>)}
                  {errors.resources && <small role="alert">{errors.resources}</small>}
                </fieldset>
              </>}
            </div>
            <div className="admin-curriculum-form-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={busy}>Cancel</button><button type="submit" className="admin-button admin-button--primary" disabled={busy}>{uploading ? 'Uploading thumbnail…' : pending ? 'Saving…' : `${editing ? 'Save' : 'Add'} ${kind === 'module' ? 'module' : 'lesson'}`}</button></div>
          </form>
        </section>
      </div>
      {kind === 'lesson' && <AdminLessonPreviewDialog lesson={previewLesson} resources={resources} open={previewOpen} onClose={() => setPreviewOpen(false)} />}
    </>
  )
}
