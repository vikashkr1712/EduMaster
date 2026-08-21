import { closeDB, connectDB } from '../src/config/db.js'
import Course from '../src/models/Course.js'
import Event from '../src/models/Event.js'
import Service from '../src/models/Service.js'
import Testimonial from '../src/models/Testimonial.js'
import Quiz from '../src/models/Quiz.js'
import QuizAttempt from '../src/models/QuizAttempt.js'
import Assignment from '../src/models/Assignment.js'
import AssignmentSubmission from '../src/models/AssignmentSubmission.js'
import Discussion from '../src/models/Discussion.js'
import StudentNote from '../src/models/StudentNote.js'
import { buildAssignmentsForCourse } from '../src/utils/assignmentFactory.js'
import { buildQuizzesForCourse } from '../src/utils/quizFactory.js'
import { courseSeeds } from './courses.seed.js'
import { eventSeeds } from './events.seed.js'
import { serviceSeeds } from './services.seed.js'
import { testimonialSeeds } from './testimonials.seed.js'

async function seed() {
  await connectDB()

  try {
    await Course.deleteMany({})
    await Event.deleteMany({})
    await Service.deleteMany({})
    await Testimonial.deleteMany({})
    await Quiz.deleteMany({})
    await QuizAttempt.deleteMany({})
    await Assignment.deleteMany({})
    await AssignmentSubmission.deleteMany({})
    await Discussion.deleteMany({})
    await StudentNote.deleteMany({})

    const [courses, events, services, testimonials] = await Promise.all([
      Course.insertMany(courseSeeds),
      Event.insertMany(eventSeeds),
      Service.insertMany(serviceSeeds),
      Testimonial.insertMany(testimonialSeeds),
    ])

    console.log(`✓ Imported ${courses.length} courses`)
    console.log(`✓ Imported ${events.length} events`)
    console.log(`✓ Imported ${services.length} services`)
    console.log(`✓ Imported ${testimonials.length} testimonials`)
    const quizDefinitions = courses.flatMap((course) => buildQuizzesForCourse(course))
    const quizzes = await Quiz.insertMany(quizDefinitions)
    console.log(`✓ Imported ${quizzes.length} quizzes`)
    const assignmentDefinitions = courses.flatMap((course) => buildAssignmentsForCourse(course))
    const assignments = await Assignment.insertMany(assignmentDefinitions)
    console.log(`✓ Imported ${assignments.length} assignments`)
  } finally {
    await closeDB()
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exitCode = 1
})
