import { AnimatePresence, motion } from 'framer-motion'

export default function CompletionDialog({ open, courseTitle, onClose, onMyCourses, onViewCertificate }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="learn-completion-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="learn-completion-dialog" role="dialog" aria-modal="true" aria-labelledby="course-complete-title" initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}>
            <span className="learn-completion-icon">✓</span>
            <p>Congratulations!</p>
            <h2 id="course-complete-title">Course Completed 🎉</h2>
            <span>You completed <strong>{courseTitle}</strong>. Your verified certificate is ready.</span>
            <div><button type="button" onClick={onViewCertificate}>View Certificate</button><button type="button" onClick={onMyCourses}>Go to My Courses</button><button type="button" onClick={onClose}>Review Lessons</button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
