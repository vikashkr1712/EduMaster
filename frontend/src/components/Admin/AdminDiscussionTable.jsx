import { Link } from 'react-router-dom'
import AdminAvatar from './AdminAvatar.jsx'
import AdminIcon from './AdminIcons.jsx'

export default function AdminDiscussionTable({ discussions }) {
  return (
    <div className="admin-discussion-table-wrap">
      <table className="admin-discussion-table">
        <thead>
          <tr>
            <th>Discussion</th>
            <th>Author</th>
            <th>Course</th>
            <th>Lesson</th>
            <th>Replies</th>
            <th>Likes</th>
            <th>Created</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {discussions.map((discussion) => (
            <tr key={discussion._id}>
              <td><Link className="admin-discussion-table__question" to={`/admin/discussions/${discussion._id}`}>{discussion.question}</Link></td>
              <td>
                <div className="admin-discussion-author">
                  <AdminAvatar user={discussion.author} />
                  <span><strong>{discussion.author?.name}</strong><small>{discussion.author?.email}</small></span>
                </div>
              </td>
              <td>{discussion.course?.title}</td>
              <td><strong>{discussion.lesson?.title}</strong><span>{discussion.lesson?.moduleTitle}</span></td>
              <td>{discussion.replyCount}</td>
              <td>{discussion.likeCount}</td>
              <td><time dateTime={discussion.createdAt}>{new Date(discussion.createdAt).toLocaleDateString()}</time></td>
              <td><Link className="admin-row-action" to={`/admin/discussions/${discussion._id}`} aria-label={`View discussion by ${discussion.author?.name || 'learner'}`}><AdminIcon name="eye" size={17} /></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
