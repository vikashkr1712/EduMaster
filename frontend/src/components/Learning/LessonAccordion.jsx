import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function StatusIcon({ completed, locked, active }) {
  if (completed) return <span className="learn-lesson-check">✓</span>
  if (locked) return <span className="learn-lesson-lock">⌑</span>
  return <span className={`learn-lesson-play${active ? ' is-active' : ''}`}>▶</span>
}

export default function LessonAccordion({ module, moduleIndex, currentLessonId, completedLessons, isLessonLocked, onSelect }) {
  const hasCurrent = module.lessons.some((lesson) => lesson.lessonId === currentLessonId)
  const [open, setOpen] = useState(moduleIndex === 0 || hasCurrent)
  useEffect(() => { if (hasCurrent) setOpen(true) }, [hasCurrent])
  const completedCount = module.lessons.filter((lesson) => completedLessons.has(lesson.lessonId)).length

  return (
    <div className="learn-module">
      <button type="button" className="learn-module-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span><strong>Module {moduleIndex + 1}: {module.title}</strong><small>{completedCount}/{module.lessons.length} complete</small></span>
        <span className={`learn-module-chevron${open ? ' is-open' : ''}`}>⌄</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="learn-module-lessons" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            {module.lessons.map((lesson, lessonIndex) => {
              const completed = completedLessons.has(lesson.lessonId)
              const locked = isLessonLocked(moduleIndex, lesson)
              const active = lesson.lessonId === currentLessonId
              return (
                <button
                  key={lesson.lessonId}
                  type="button"
                  className={`learn-lesson-row${active ? ' is-current' : ''}${locked ? ' is-locked' : ''}`}
                  disabled={locked}
                  onClick={() => onSelect(lesson.lessonId)}
                  aria-current={active ? 'true' : undefined}
                >
                  <StatusIcon completed={completed} locked={locked} active={active} />
                  <span className="learn-lesson-name"><strong>{lessonIndex + 1}. {lesson.title}</strong><small>{lesson.duration}</small></span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
