import { useEffect, useRef } from 'react'
import AdminIcon from './AdminIcons.jsx'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

export default function AdminCourseDetailsModal({ course, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const closeHandlerRef = useRef(onClose)

  useEffect(() => { closeHandlerRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!course) return undefined
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeHandlerRef.current()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('a[href], button:not(:disabled)') ?? []
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [course])

  if (!course) return null

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-course-details" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-course-details-title">
        <div className="admin-course-details__header">
          <div>
            <span className={`admin-course-status admin-course-status--${course.isPublished ? 'published' : 'draft'}`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            <h2 id="admin-course-details-title">{course.title}</h2>
            <p>/{course.slug}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close course details"><AdminIcon name="close" /></button>
        </div>
        <div className="admin-course-details__body">
          <p className="admin-course-details__description">{course.description}</p>
          <dl>
            <div><dt>Category</dt><dd>{course.category || '—'}</dd></div>
            <div><dt>Instructor</dt><dd>{course.instructor || '—'}</dd></div>
            <div><dt>Level</dt><dd>{course.level || '—'}</dd></div>
            <div><dt>Price</dt><dd>{Number(course.price) === 0 ? 'Free' : currency.format(course.price)}</dd></div>
            <div><dt>Duration</dt><dd>{course.duration || '—'}</dd></div>
            <div><dt>Language</dt><dd>{course.language || '—'}</dd></div>
            <div><dt>Enrollments</dt><dd>{Number(course.enrollmentCount) || 0}</dd></div>
            <div><dt>Certificate</dt><dd>{course.hasCertificate ? 'Included' : 'Not included'}</dd></div>
          </dl>
        </div>
        <div className="admin-course-details__footer">
          {course.isPublished && <a className="admin-button admin-button--secondary" href={`/courses/${course.slug}`} target="_blank" rel="noreferrer">Open public page</a>}
          <button type="button" className="admin-button admin-button--primary" onClick={onClose}>Done</button>
        </div>
      </section>
    </div>
  )
}
