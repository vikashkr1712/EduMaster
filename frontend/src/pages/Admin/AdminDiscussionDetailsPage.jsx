import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAdminDiscussion, deleteAdminDiscussionReply, getAdminDiscussion } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminDiscussions.css'

const formatDate = (value) => new Date(value).toLocaleString()

export default function AdminDiscussionDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [discussion, setDiscussion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminDiscussion(id)
      setDiscussion(response?.data?.discussion ?? null)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }, [id])
  useEffect(() => { load() }, [load])

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'discussion') {
        await deleteAdminDiscussion(id)
        notifications.success('Discussion removed.')
        navigate('/admin/discussions', { replace: true })
        return
      }
      await deleteAdminDiscussionReply(id, deleteTarget.reply._id)
      notifications.success('Reply removed.')
      setDeleteTarget(null)
      await load()
    } catch (requestError) {
      notifications.error(requestError?.message || `Unable to remove ${deleteTarget.type}.`)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="admin-discussion-loading" aria-busy="true"><span className="admin-spinner" />Loading discussion…</div>
  if (error || !discussion) return <div className="admin-course-list-state" role="alert"><h2>Unable to load discussion</h2><p>{error?.status === 404 ? 'This discussion no longer exists.' : error?.message || 'Discussion not found.'}</p><Link className="admin-button admin-button--secondary" to="/admin/discussions">Back to discussions</Link></div>

  const deletingThread = deleteTarget?.type === 'discussion'
  return (
    <div className="admin-discussion-details">
      <div className="admin-page-heading">
        <div><Link className="admin-back-link" to="/admin/discussions"><AdminIcon name="arrowLeft" size={17} />Back to discussions</Link><h1>Discussion details</h1><p>Inspect the learner conversation and moderate inappropriate content.</p></div>
        <button type="button" className="admin-button admin-button--danger" onClick={() => setDeleteTarget({ type: 'discussion' })}><AdminIcon name="trash" size={17} />Delete discussion</button>
      </div>
      <section className="admin-discussion-context">
        <article><span>Author</span><div className="admin-discussion-author"><AdminAvatar user={discussion.author} size="large" /><span><strong>{discussion.author?.name}</strong><small>{discussion.author?.email}</small></span></div><Link to={`/admin/users/${discussion.author?._id}`}>Open user details</Link></article>
        <article><span>Course</span><h2>{discussion.course?.title}</h2><Link to={`/admin/courses/${discussion.course?._id}/edit`}>Open course management</Link></article>
        <article><span>Module / Lesson</span><h2>{discussion.lesson?.moduleTitle || 'Module unavailable'}</h2><p>{discussion.lesson?.title}</p><small>Lesson ID: {discussion.lessonId}</small></article>
      </section>
      <article className="admin-discussion-post">
        <header><div><span>Discussion</span><time dateTime={discussion.createdAt}>Created {formatDate(discussion.createdAt)}</time></div><div><strong>{discussion.likesCount}</strong> likes · <strong>{discussion.replyCount}</strong> replies</div></header>
        <p>{discussion.question}</p>
        {discussion.updatedAt !== discussion.createdAt && <small>Last updated {formatDate(discussion.updatedAt)}</small>}
      </article>
      <section className="admin-discussion-replies" aria-labelledby="admin-replies-heading">
        <div className="admin-section-heading"><span>Conversation</span><h2 id="admin-replies-heading">Replies ({discussion.replyCount})</h2><p>Replies are stored as a chronological, non-nested list in the current discussion schema.</p></div>
        {discussion.replies.length === 0
          ? <div className="admin-discussion-empty"><h3>No replies yet.</h3><p>This discussion has no learner responses.</p></div>
          : <ol className="admin-reply-list">{discussion.replies.map((reply) => <li key={reply._id} className="admin-reply-card"><div className="admin-reply-card__heading"><div className="admin-discussion-author"><AdminAvatar user={reply.author} /><span><strong>{reply.author?.name || 'User unavailable'}</strong><small>{reply.author?.email || 'Email unavailable'}</small></span></div><button type="button" className="admin-reply-delete" onClick={() => setDeleteTarget({ type: 'reply', reply })} aria-label={`Delete reply by ${reply.author?.name || 'learner'}`}><AdminIcon name="trash" size={16} />Delete reply</button></div><p>{reply.message}</p><footer><time dateTime={reply.createdAt}>{formatDate(reply.createdAt)}</time><span>{reply.likesCount} likes</span></footer></li>)}</ol>}
      </section>
      <AdminConfirmModal open={Boolean(deleteTarget)} title={deletingThread ? 'Delete Discussion?' : 'Delete Reply?'} confirmLabel={deletingThread ? 'Delete discussion' : 'Delete reply'} pending={deleting} pendingLabel="Deleting…" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete}>
        {deletingThread ? <><p>“{discussion.question.slice(0, 180)}{discussion.question.length > 180 ? '…' : ''}”</p><p>This discussion contains <strong>{discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}</strong>. Deleting it will also permanently remove those embedded replies from the learner conversation.</p></> : <><p>“{deleteTarget?.reply?.message.slice(0, 180)}{deleteTarget?.reply?.message.length > 180 ? '…' : ''}”</p><p>This removes only this embedded reply. The current schema has no child-reply relationship.</p></>}
      </AdminConfirmModal>
    </div>
  )
}
