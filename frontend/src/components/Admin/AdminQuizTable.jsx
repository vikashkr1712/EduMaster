import { Link } from 'react-router-dom'
import AdminIcon from './AdminIcons.jsx'

export default function AdminQuizTable({ quizzes, deletingId, onDelete }) {
  return (
    <div className="admin-quiz-table-wrap">
      <table className="admin-quiz-table">
        <thead><tr><th>Quiz</th><th>Course</th><th>Module / Lesson</th><th>Questions</th><th>Passing</th><th>Time</th><th>Attempts</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id}>
              <td><Link className="admin-quiz-table__title" to={`/admin/quizzes/${quiz._id}`}>{quiz.title}</Link><span className={`admin-status-pill ${quiz.isPublished ? 'is-published' : 'is-draft'}`}>{quiz.isPublished ? 'Published' : 'Draft'}</span></td>
              <td>{quiz.courseTitle}</td>
              <td><strong>{quiz.moduleTitle}</strong><span>{quiz.lessonTitle}</span></td>
              <td>{quiz.questionCount}</td><td>{quiz.passingMarks}%</td><td>{quiz.timeLimit} min</td><td>{quiz.attemptCount}</td>
              <td><div className="admin-table-actions"><Link to={`/admin/quizzes/${quiz._id}`} aria-label={`View ${quiz.title}`}><AdminIcon name="eye" size={17} /></Link><Link to={`/admin/quizzes/${quiz._id}/edit`} aria-label={`Edit ${quiz.title}`}><AdminIcon name="edit" size={17} /></Link><button type="button" disabled={deletingId === quiz._id} onClick={() => onDelete(quiz)} aria-label={`Delete ${quiz.title}`}><AdminIcon name="trash" size={17} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
