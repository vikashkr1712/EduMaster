import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createAdminCourse, getAdminCourse, updateAdminCourse } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminCourses.css'

const emptyCourse = {
  title: '', shortDescription: '', description: '', category: '', instructor: '',
  level: 'Beginner', price: '0', discountPrice: '0', thumbnail: '', duration: '',
  language: '', hasCertificate: true, isFeatured: false, isPublished: false,
}

const validateCourse = (values) => {
  const errors = {}
  if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
  if (values.description.trim().length < 20) errors.description = 'Description must be at least 20 characters.'
  if (values.category.trim().length < 2) errors.category = 'Category must be at least 2 characters.'
  if (values.instructor.trim().length < 2) errors.instructor = 'Instructor must be at least 2 characters.'
  if (Number(values.price) < 0 || Number.isNaN(Number(values.price))) errors.price = 'Price must be zero or greater.'
  if (Number(values.discountPrice) < 0 || Number.isNaN(Number(values.discountPrice))) errors.discountPrice = 'Discount price must be zero or greater.'
  if (Number(values.discountPrice) > Number(values.price)) errors.discountPrice = 'Discount price must not exceed price.'
  if (values.thumbnail.trim()) {
    try { new URL(values.thumbnail.trim()) } catch { errors.thumbnail = 'Enter a valid thumbnail URL.' }
  }
  return errors
}

const toPayload = (values) => ({
  title: values.title.trim(),
  shortDescription: values.shortDescription.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  instructor: values.instructor.trim(),
  level: values.level,
  price: Number(values.price),
  discountPrice: Number(values.discountPrice),
  thumbnail: values.thumbnail.trim(),
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
    const nextErrors = validateCourse(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSaving(true)
    try {
      if (editing) {
        await updateAdminCourse(id, toPayload(values))
        notifications.success('Course updated successfully.')
      } else {
        await createAdminCourse(toPayload(values))
        notifications.success('Course created successfully.')
      }
      navigate('/admin/courses', { replace: true })
    } catch (error) {
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
            <label className="admin-field"><span>Duration</span><input value={values.duration} onChange={(event) => update('duration', event.target.value)} maxLength={60} placeholder="e.g. 12 hours" /></label>
            <label className="admin-field"><span>Language</span><input value={values.language} onChange={(event) => update('language', event.target.value)} maxLength={40} placeholder="e.g. English" /></label>
            <label className="admin-field admin-field--full"><span>Thumbnail URL</span><input type="url" value={values.thumbnail} onChange={(event) => update('thumbnail', event.target.value)} aria-invalid={Boolean(errors.thumbnail)} placeholder="https://example.com/course-image.jpg" />{errors.thumbnail && <small role="alert">{errors.thumbnail}</small>}</label>
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
