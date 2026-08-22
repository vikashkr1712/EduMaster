import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function ChevronIcon({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

export default function CurriculumTab({ course }) {
  const modules = Array.isArray(course.modules) ? course.modules : []
  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
  const [openModules, setOpenModules] = useState(() => new Set([0]))

  function toggleModule(i) {
    setOpenModules((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="cdp-curriculum">
      <div className="cdp-curr-header">
        <h3 className="cdp-section-title">Course Curriculum</h3>
        <span className="cdp-curr-summary">{modules.length} modules · {totalLessons} lessons</span>
      </div>
      <div className="cdp-curr-modules">
        {modules.length === 0 && <p className="cdp-curr-empty">No lessons have been added to this course yet.</p>}
        {modules.map((mod, i) => {
          const isOpen = openModules.has(i)
          return (
            <div key={i} className={`cdp-curr-module${isOpen ? ' open' : ''}`}>
              <button className="cdp-curr-mod-header" onClick={() => toggleModule(i)} aria-expanded={isOpen}>
                <div className="cdp-curr-mod-left">
                  <ChevronIcon open={isOpen} />
                  <span className="cdp-curr-mod-title">Module {i + 1}: {mod.title}</span>
                </div>
                  <span className="cdp-curr-mod-count">{mod.lessons?.length || 0} lessons</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="cdp-curr-lessons"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {(mod.lessons || []).map((lesson, j) => (
                      <div key={lesson.lessonId || lesson.title || j} className="cdp-curr-lesson">
                        <PlayIcon />
                        <span>{typeof lesson === 'string' ? lesson : lesson.title}</span>
                        <span className="cdp-curr-lesson-dur">{typeof lesson === 'string' ? `${8 + ((i * 4 + j) % 15)}:${String((j * 7) % 60).padStart(2, '0')} min` : (lesson.duration || 'Self-paced')}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
