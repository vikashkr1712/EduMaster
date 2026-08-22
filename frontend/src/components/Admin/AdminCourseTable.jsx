import { Link } from 'react-router-dom'
import AdminIcon from './AdminIcons.jsx'
import CourseThumbnail from '../Courses/CourseThumbnail.jsx'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export default function AdminCourseTable({ courses, pendingAction, onView, onPublish, onDelete }) {
  return (
    <div className="admin-course-table-wrap">
      <table className="admin-course-table">
        <thead>
          <tr>
            <th scope="col">Course</th>
            <th scope="col">Category</th>
            <th scope="col">Instructor</th>
            <th scope="col">Level</th>
            <th scope="col">Price</th>
            <th scope="col">Enrollments</th>
            <th scope="col">Status</th>
            <th scope="col">Updated</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const publishing = pendingAction?.id === course._id && pendingAction.type === 'publish'
            const deleting = pendingAction?.id === course._id && pendingAction.type === 'delete'
            return (
              <tr key={course._id}>
                <td>
                  <div className="admin-course-cell">
                    <div className="admin-course-cell__thumb"><CourseThumbnail course={course} alt="" /></div>
                    <span>
                      <strong>{course.title}</strong>
                      <small>/{course.slug}</small>
                    </span>
                  </div>
                </td>
                <td>{course.category || '—'}</td>
                <td>{course.instructor || '—'}</td>
                <td>{course.level || '—'}</td>
                <td>{Number(course.price) === 0 ? <strong className="admin-course-free">Free</strong> : currency.format(course.price)}</td>
                <td>{Number(course.enrollmentCount) || 0}</td>
                <td><span className={`admin-course-status admin-course-status--${course.isPublished ? 'published' : 'draft'}`}>{course.isPublished ? 'Published' : 'Draft'}</span></td>
                <td>{formatDate(course.updatedAt)}</td>
                <td>
                  <div className="admin-course-actions">
                    <button type="button" onClick={() => onView(course)} aria-label={`View ${course.title}`}><AdminIcon name="eye" size={16} /><span>View</span></button>
                    <Link to={`/admin/courses/${course._id}/curriculum`} aria-label={`Manage curriculum for ${course.title}`}><AdminIcon name="curriculum" size={16} /><span>Curriculum</span></Link>
                    <Link to={`/admin/courses/${course._id}/edit`} aria-label={`Edit ${course.title}`}><AdminIcon name="edit" size={16} /><span>Edit</span></Link>
                    <button type="button" onClick={() => onPublish(course)} disabled={publishing || deleting} aria-label={`${course.isPublished ? 'Unpublish' : 'Publish'} ${course.title}`}>
                      <AdminIcon name="publish" size={16} /><span>{publishing ? 'Saving…' : course.isPublished ? 'Unpublish' : 'Publish'}</span>
                    </button>
                    <button type="button" className="is-danger" onClick={() => onDelete(course)} disabled={publishing || deleting} aria-label={`Delete ${course.title}`}><AdminIcon name="trash" size={16} /><span>Delete</span></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
