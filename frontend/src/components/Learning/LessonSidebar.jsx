import LessonAccordion from './LessonAccordion.jsx'

export default function LessonSidebar({ modules, currentLessonId, completedLessons, isLessonLocked, onSelect }) {
  return (
    <section className="learn-sidebar-card">
      <div className="learn-sidebar-tabs learn-sidebar-tabs--single"><strong>Course Lessons</strong></div>
        <div className="learn-module-list">
          {modules.map((module, index) => (
            <LessonAccordion key={module.moduleId} module={module} moduleIndex={index} currentLessonId={currentLessonId} completedLessons={completedLessons} isLessonLocked={isLessonLocked} onSelect={onSelect} />
          ))}
        </div>
    </section>
  )
}
