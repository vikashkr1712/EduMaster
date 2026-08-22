import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createAdminCourse, getAdminCourse, updateAdminCourse, uploadAdminCourseThumbnail } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import CourseThumbnail from '../../components/Courses/CourseThumbnail.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminCourses.css'

const emptyCourse = {
  title: '', shortDescription: '', description: '', category: '', instructor: '',
  level: 'Beginner', price: '0', discountPrice: '0', thumbnail: '', duration: '',
  language: '', hasCertificate: true, isFeatured: false, isPublished: false,
}

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024
const THUMBNAIL_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const THUMBNAIL_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Spanish']

const isMeaningfulLanguage = (value) => value === '' || /^(?=(?:.*\p{L}){2})[\p{L}\p{M} .()/-]+$/u.test(value)
const isMeaningfulDuration = (value) => value === ''
  || /^self[- ]paced$/i.test(value)
  || (/^[A-Za-z0-9 .-]+$/.test(value) && /[1-9]\d*(?:\.\d+)?\s*(?:minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mos?|mo)\b/i.test(value))

const isValidThumbnailUrl = (value) => {
  if (/^\/uploads\/course-thumbnails\/[A-Za-z0-9._-]+$/.test(value)) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

const validateCourse = (values, thumbnailFile) => {
  const errors = {}
  if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
  if (values.description.trim().length < 20) errors.description = 'Description must be at least 20 characters.'
  if (values.category.trim().length < 2) errors.category = 'Category must be at least 2 characters.'
  if (values.instructor.trim().length < 2) errors.instructor = 'Instructor must be at least 2 characters.'
  if (Number(values.price) < 0 || Number.isNaN(Number(values.price))) errors.price = 'Price must be zero or greater.'
  if (Number(values.discountPrice) < 0 || Number.isNaN(Number(values.discountPrice))) errors.discountPrice = 'Discount price must be zero or greater.'
  if (Number(values.discountPrice) > Number(values.price)) errors.discountPrice = 'Discount price must not exceed price.'
  if (!thumbnailFile && values.thumbnail.trim() && !isValidThumbnailUrl(values.thumbnail.trim())) errors.thumbnail = 'Enter a valid HTTP or HTTPS thumbnail URL.'
  if (!isMeaningfulDuration(values.duration.trim())) errors.duration = 'Use a duration such as 12 hours, 24h 30m, 6 weeks, or 45 minutes.'
  if (!isMeaningfulLanguage(values.language.trim())) errors.language = 'Choose a meaningful course language.'
  return errors
}

const toPayload = (values, thumbnail = values.thumbnail.trim()) => ({
  title: values.title.trim(),
  shortDescription: values.shortDescription.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  instructor: values.instructor.trim(),
  level: values.level,
  price: Number(values.price),
  discountPrice: Number(values.discountPrice),
  thumbnail,
  duration: values.duration.trim(),
  language: values.language.trim(),
  hasCertificate: values.hasCertificate,
  isFeatured: values.isFeatured,
  isPublished: values.isPublished,
})

export default function AdminCourseFormPage({ mode }) {
  const editing = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [values, setValues] = useState(emptyCourse)
  const [currentSlug, setCurrentSlug] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(editing)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const thumbnailInputRef = useRef(null)
  const hasLegacyLanguage = values.language && !LANGUAGE_OPTIONS.includes(values.language)

  useEffect(() => {
    if (!thumbnailFile) { setThumbnailPreview(''); return undefined }
    const objectUrl = URL.createObjectURL(thumbnailFile)
    setThumbnailPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [thumbnailFile])

  useEffect(() => {
    if (!editing) return undefined
    let active = true
    const loadCourse = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await getAdminCourse(id)
        const course = response?.data?.course
        if (!active || !course) return
        setValues({
          title: course.title ?? '', shortDescription: course.shortDescription ?? '', description: course.description ?? '',
          category: course.category ?? '', instructor: course.instructor ?? '', level: course.level ?? 'Beginner',
          price: String(course.price ?? 0), discountPrice: String(course.discountPrice ?? 0), thumbnail: course.thumbnail ?? '',
          duration: course.duration ?? '', language: course.language ?? '', hasCertificate: course.hasCertificate !== false,
          isFeatured: Boolean(course.isFeatured), isPublished: Boolean(course.isPublished),
        })
        setCurrentSlug(course.slug ?? '')
      } catch (error) {
        if (active) setLoadError(error)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCourse()
    return () => { active = false }
  }, [editing, id])

  const update = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const chooseThumbnail = (file) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!THUMBNAIL_TYPES.has(file.type) || !THUMBNAIL_EXTENSIONS.has(extension)) {
      setThumbnailFile(null)
      setErrors((current) => ({ ...current, thumbnailFile: 'Choose a JPG, JPEG, PNG, or WebP image.' }))
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
      return
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setThumbnailFile(null)
      setErrors((current) => ({ ...current, thumbnailFile: 'Course thumbnail must be 5 MB or smaller.' }))
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
      return
    }
    setThumbnailFile(file)
    setErrors((current) => ({ ...current, thumbnail: undefined, thumbnailFile: undefined }))
  }

  const clearThumbnailFile = () => {
    setThumbnailFile(null)
    setErrors((current) => ({ ...current, thumbnailFile: undefined }))
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
    const nextErrors = validateCourse(values, thumbnailFile)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSaving(true)
    try {
      let finalThumbnail = values.thumbnail.trim()
      if (thumbnailFile) {
        const uploadResponse = await uploadAdminCourseThumbnail(thumbnailFile)
        finalThumbnail = uploadResponse?.data?.thumbnail || ''
        if (!finalThumbnail) throw new Error('Thumbnail upload did not return an image reference.')
      }
      if (editing) {
        await updateAdminCourse(id, toPayload(values, finalThumbnail))
        notifications.success('Course updated successfully.')
      } else {
        await createAdminCourse(toPayload(values, finalThumbnail))
        notifications.success('Course created successfully.')
      }
      navigate('/admin/courses', { replace: true })
    } catch (error) {
      if (thumbnailFile) setErrors((current) => ({ ...current, thumbnailFile: error?.message || 'Unable to upload this thumbnail.' }))
      notifications.error(error?.message || `Unable to ${editing ? 'update' : 'create'} course.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-course-form-loading" aria-busy="true" aria-label="Loading course"><span /><span /><span /></div>
  if (loadError) return <div className="admin-course-list-state" role="alert"><h2>Unable to load course</h2><p>{loadError.message}</p><button type="button" className="admin-button admin-button--primary" onClick={() => window.location.reload()}>Retry</button></div>

  return (
    <div className="admin-course-form-page">
      <div className="admin-page-heading">
        <div>
          <Link className="admin-back-link" to="/admin/courses"><AdminIcon name="arrowLeft" size={17} />Back to courses</Link>
          <h1>{editing ? 'Edit Course' : 'Add Course'}</h1>
          <p>{editing ? 'Update course information and publishing status.' : 'Create a new course for the EduMaster catalog.'}</p>
        </div>
      </div>

      <form className="admin-course-form" onSubmit={handleSubmit} noValidate>
        <section>
          <div className="admin-form-section-heading"><h2>Basic Information</h2><p>Core course information shown across EduMaster.</p></div>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--full"><span>Course title *</span><input value={values.title} onChange={(event) => update('title', event.target.value)} maxLength={120} aria-invalid={Boolean(errors.title)} />{errors.title && <small role="alert">{errors.title}</small>}{editing && currentSlug && <em>Current URL: /courses/{currentSlug}. Changing the title updates the slug.</em>}</label>
            <label className="admin-field admin-field--full"><span>Short description</span><textarea rows="3" value={values.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} maxLength={300} /><em>{values.shortDescription.length}/300</em></label>
            <label className="admin-field admin-field--full"><span>Description *</span><textarea rows="7" value={values.description} onChange={(event) => update('description', event.target.value)} maxLength={5000} aria-invalid={Boolean(errors.description)} />{errors.description && <small role="alert">{errors.description}</small>}</label>
            <label className="admin-field"><span>Category *</span><input value={values.category} onChange={(event) => update('category', event.target.value)} maxLength={60} aria-invalid={Boolean(errors.category)} />{errors.category && <small role="alert">{errors.category}</small>}</label>
            <label className="admin-field"><span>Instructor *</span><input value={values.instructor} onChange={(event) => update('instructor', event.target.value)} maxLength={60} aria-invalid={Boolean(errors.instructor)} />{errors.instructor && <small role="alert">{errors.instructor}</small>}</label>
          </div>
        </section>

        <section>
          <div className="admin-form-section-heading"><h2>Course Details</h2><p>Classification and presentation details.</p></div>
          <div className="admin-form-grid">
            <label className="admin-field"><span>Level *</span><select value={values.level} onChange={(event) => update('level', event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
            <label className="admin-field"><span>Duration</span><input value={values.duration} onChange={(event) => update('duration', event.target.value)} maxLength={60} placeholder="e.g. 12 hours or 24h 30m" aria-invalid={Boolean(errors.duration)} />{errors.duration && <small role="alert">{errors.duration}</small>}</label>
            <label className="admin-field"><span>Language</span><select value={values.language} onChange={(event) => update('language', event.target.value)} aria-invalid={Boolean(errors.language)}><option value="">Select language</option>{hasLegacyLanguage && <option value={values.language}>{values.language} (existing)</option>}{LANGUAGE_OPTIONS.map((language) => <option key={language} value={language}>{language}</option>)}</select>{errors.language && <small role="alert">{errors.language}</small>}</label>
            <div className="admin-thumbnail-editor admin-field--full">
              <div className="admin-thumbnail-editor__preview">
                <span>Preview</span>
                <div><CourseThumbnail course={values} source={thumbnailPreview || values.thumbnail} alt="Course thumbnail preview" /></div>
              </div>
              <div className="admin-thumbnail-editor__controls">
                <span>Course Thumbnail</span>
                <input ref={thumbnailInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => chooseThumbnail(event.target.files?.[0])} hidden />
                <button type="button" className="admin-thumbnail-upload" onClick={() => thumbnailInputRef.current?.click()}><AdminIcon name="camera" size={18} />{thumbnailFile ? 'Change Image' : 'Upload Image'}</button>
                <small>JPG, JPEG, PNG, or WebP · Maximum 5 MB</small>
                {thumbnailFile && <div className="admin-thumbnail-selected"><span title={thumbnailFile.name}>{thumbnailFile.name}</span><button type="button" onClick={clearThumbnailFile}>Use URL instead</button></div>}
                {errors.thumbnailFile && <p className="admin-thumbnail-error" role="alert">{errors.thumbnailFile}</p>}
                <div className="admin-thumbnail-or"><span>OR</span></div>
                <label className="admin-field"><span>Thumbnail URL</span><input type="url" value={values.thumbnail} onChange={(event) => update('thumbnail', event.target.value)} aria-invalid={Boolean(errors.thumbnail)} placeholder="https://example.com/course-image.jpg" disabled={Boolean(thumbnailFile)} />{errors.thumbnail && <small role="alert">{errors.thumbnail}</small>}</label>
                <em>{thumbnailFile ? 'The selected upload will be saved instead of the URL.' : 'Enter an HTTP/HTTPS image URL, or upload an image above.'}</em>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="admin-form-section-heading"><h2>Pricing</h2><p>Use zero for a free course.</p></div>
          <div className="admin-form-grid">
            <label className="admin-field"><span>Price (₹) *</span><input type="number" min="0" step="0.01" value={values.price} onChange={(event) => update('price', event.target.value)} aria-invalid={Boolean(errors.price)} />{errors.price && <small role="alert">{errors.price}</small>}</label>
            <label className="admin-field"><span>Discount price (₹)</span><input type="number" min="0" step="0.01" value={values.discountPrice} onChange={(event) => update('discountPrice', event.target.value)} aria-invalid={Boolean(errors.discountPrice)} />{errors.discountPrice && <small role="alert">{errors.discountPrice}</small>}</label>
          </div>
        </section>

        <section>
          <div className="admin-form-section-heading"><h2>Publishing</h2><p>Control catalog visibility and course options.</p></div>
          <div className="admin-form-checks">
            <label><input type="checkbox" checked={values.isPublished} onChange={(event) => update('isPublished', event.target.checked)} /><span><strong>Published</strong><small>Visible in the public course catalog.</small></span></label>
            <label><input type="checkbox" checked={values.isFeatured} onChange={(event) => update('isFeatured', event.target.checked)} /><span><strong>Featured</strong><small>Eligible for featured course sections.</small></span></label>
            <label><input type="checkbox" checked={values.hasCertificate} onChange={(event) => update('hasCertificate', event.target.checked)} /><span><strong>Certificate included</strong><small>Learners can earn a completion certificate.</small></span></label>
          </div>
        </section>

        <div className="admin-course-form__actions">
          <Link className="admin-button admin-button--secondary" to="/admin/courses">Cancel</Link>
          <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Course'}</button>
        </div>
      </form>
    </div>
  )
}
