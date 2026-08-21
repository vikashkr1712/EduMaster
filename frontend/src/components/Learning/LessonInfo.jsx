function InfoIcon({ children }) { return <span className="learn-info-icon" aria-hidden="true">{children}</span> }

export default function LessonInfo({ lesson, course, resourcesCount }) {
  const date = lesson.publishedAt
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(lesson.publishedAt))
    : 'Recently updated'
  const items = [
    ['◷', lesson.duration, 'Lesson Duration'],
    ['▣', date, 'Published On'],
    ['●', course.instructor, 'Instructor'],
    ['◇', course.category, 'Category'],
    ['◎', course.language || 'English', 'Language'],
    ['↓', String(resourcesCount), 'Resources'],
  ]
  return (
    <section className="learn-info-card">
      {items.map(([icon, value, label]) => (
        <div key={label}><InfoIcon>{icon}</InfoIcon><span><strong>{value}</strong><small>{label}</small></span></div>
      ))}
    </section>
  )
}
