import { closeDB, connectDB } from '../src/config/db.js'
import Course from '../src/models/Course.js'
import Event from '../src/models/Event.js'
import Service from '../src/models/Service.js'
import Testimonial from '../src/models/Testimonial.js'
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
  } finally {
    await closeDB()
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exitCode = 1
})
