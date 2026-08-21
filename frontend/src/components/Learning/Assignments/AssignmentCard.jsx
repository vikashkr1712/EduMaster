import { useState } from 'react'
import AssignmentUpload from './AssignmentUpload.jsx'
import { submitAssignment } from '../../../api/lms.js'

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
export default function AssignmentCard({ assignment, submission, onSubmitted, notify }) {
  const [busy, setBusy] = useState(false)
  if (!assignment) return <div className="lms-empty"><span>▤</span><h3>No assignment for this lesson</h3><p>Continue learning—assignments appear on selected module lessons.</p></div>
  const upload = async (file, remarks) => { setBusy(true); try { const response = await submitAssignment(assignment._id, file, remarks); onSubmitted(response.data); notify('Assignment Submitted'); } catch (error) { notify(error.message || 'Could not submit assignment.', true) } finally { setBusy(false) } }
  return <article className="lms-assignment"><header><div><span>Practical Assignment</span><h3>{assignment.title}</h3></div><b className={submission ? 'is-submitted' : 'is-pending'}>{submission ? 'Submitted ✓' : 'Pending'}</b></header><p>{assignment.description}</p><div className="lms-assignment-meta"><span><small>Due Date</small><strong>{formatDate(assignment.dueDate)}</strong></span><span><small>Maximum Marks</small><strong>{assignment.maxMarks}</strong></span><span><small>Status</small><strong>{submission ? submission.status : 'Not submitted'}</strong></span></div><section><h4>Instructions</h4><p>{assignment.instructions}</p></section>{assignment.attachments?.length > 0 && <section><h4>Attachments</h4><div className="lms-attachment-list">{assignment.attachments.map((item, index) => <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer"><span>↓</span>{item.title}<small>{item.type}</small></a>)}</div></section>}{submission && <div className="lms-submitted-file"><span>✓</span><div><strong>{submission.submittedFile.originalName}</strong><small>Submitted {formatDate(submission.submittedAt)}</small></div></div>}<AssignmentUpload busy={busy} onSubmit={upload} /></article>
}
