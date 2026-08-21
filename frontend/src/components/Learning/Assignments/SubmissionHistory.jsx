export default function SubmissionHistory({ submissions = [] }) {
  if (!submissions.length) return null
  return <section className="lms-submission-history"><h3>Submission History</h3>{submissions.map((item) => <article key={item._id}><div><strong>{item.assignment?.title}</strong><small>{item.course?.title}</small></div><span>{item.status}</span></article>)}</section>
}
