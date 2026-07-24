import CourseCard from './CourseCard.jsx'
import { fadeUp, motion, useReducedMotion } from '../Home/motion.jsx'

export default function CourseGrid({ courses }) {
  const reducedMotion = useReducedMotion()
  if (courses.length === 0) {
    return (
      <div className="cgrid-empty">
        <h3>No courses found</h3>
        <p>Try adjusting your filters or search to find what you&apos;re looking for.</p>
      </div>
    )
  }

  return (
    <div className="cgrid">
      {courses.map((course, i) => (
        <motion.div
          className="cgrid-reveal"
          key={course.id}
          initial={reducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          transition={{ duration: 0.45, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <CourseCard course={course} />
        </motion.div>
      ))}
    </div>
  )
}
