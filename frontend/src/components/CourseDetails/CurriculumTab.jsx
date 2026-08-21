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

function fallbackCurriculum(course) {
  const cat = course.category || 'Development'
  const templates = {
    Development: [
      { title: 'Getting Started', lessons: ['Introduction & Overview', 'Setup & Installation', 'Your First Project', 'Understanding the Basics'] },
      { title: 'Core Concepts', lessons: ['Fundamentals Deep Dive', 'Working with Data', 'Control Flow & Logic', 'Functions & Modules'] },
      { title: 'Intermediate Skills', lessons: ['Object-Oriented Principles', 'Error Handling', 'File Operations', 'APIs & Libraries'] },
      { title: 'Advanced Topics', lessons: ['Performance Optimization', 'Testing & Debugging', 'Security Best Practices', 'Deployment'] },
      { title: 'Final Projects', lessons: ['Project Planning', 'Building the Application', 'Code Review', 'Deploying Live'] },
    ],
    'Data Science': [
      { title: 'Data Foundations', lessons: ['What is Data Science?', 'Python for Data', 'NumPy Basics', 'Pandas Essentials'] },
      { title: 'Exploratory Analysis', lessons: ['Data Cleaning', 'Visualization with Matplotlib', 'Statistical Concepts', 'Correlation & Patterns'] },
      { title: 'Machine Learning', lessons: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Hyperparameter Tuning'] },
      { title: 'Real-World Projects', lessons: ['Dataset Selection', 'End-to-End Pipeline', 'Presentation of Results', 'Deployment with Flask'] },
    ],
    Business: [
      { title: 'Business Fundamentals', lessons: ['Understanding Markets', 'Business Models', 'Value Proposition', 'Customer Personas'] },
      { title: 'Strategy & Planning', lessons: ['Market Research', 'Competitive Analysis', 'Business Plan Writing', 'Financial Projections'] },
      { title: 'Operations', lessons: ['Team Building', 'Process Design', 'Funding & Investment', 'Legal Essentials'] },
      { title: 'Growth & Scale', lessons: ['Marketing Strategy', 'Sales Fundamentals', 'Product-Market Fit', 'Scaling Your Business'] },
    ],
  }
  return templates[cat] || templates.Development
}

export default function CurriculumTab({ course }) {
  const modules = course.modules?.length ? course.modules : fallbackCurriculum(course)
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)
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
