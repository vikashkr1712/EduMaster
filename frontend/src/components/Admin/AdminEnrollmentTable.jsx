import { Link } from 'react-router-dom'
import AdminAvatar from './AdminAvatar.jsx'
import AdminIcon from './AdminIcons.jsx'

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export default function AdminEnrollmentTable({ enrollments }) {
  return (
    <div className="admin-commerce-table-wrap">
      <table className="admin-commerce-table admin-enrollment-table">
        <thead><tr><th scope="col">Student</th><th scope="col">Course</th><th scope="col">Order</th><th scope="col">Progress</th><th scope="col">Current Lesson</th><th scope="col">Completion</th><th scope="col">Enrolled</th><th scope="col">Actions</th></tr></thead>
        <tbody>{enrollments.map((enrollment) => <tr key={enrollment._id}>
          <td><div className="admin-commerce-person"><AdminAvatar user={enrollment.student} size="small" /><span><strong>{enrollment.student?.name || 'Deleted user'}</strong><small>{enrollment.student?.email || '—'}</small></span></div></td>
          <td><span className="admin-commerce-course-summary"><strong>{enrollment.course?.title || 'Unavailable course'}</strong><small>{enrollment.course?.instructor || '—'}</small></span></td>
          <td>{enrollment.order?.orderNumber || '—'}</td>
          <td><div className="admin-progress-cell"><span><i style={{ width: `${Math.min(100, Math.max(0, Number(enrollment.progress) || 0))}%` }} /></span><strong>{Math.round(Number(enrollment.progress) || 0)}%</strong></div></td>
          <td>{enrollment.currentLesson || '—'}</td>
          <td><span className={`admin-completion-status admin-completion-status--${enrollment.isCompleted ? 'completed' : 'progress'}`}>{enrollment.isCompleted ? 'Completed' : 'In progress'}</span></td>
          <td>{formatDate(enrollment.enrolledAt)}</td>
          <td><Link className="admin-commerce-view" to={`/admin/enrollments/${enrollment._id}`} aria-label={`View enrollment for ${enrollment.student?.name || 'user'}`}><AdminIcon name="eye" size={16} /><span>View</span></Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  )
}
