import { connectDB, closeDB } from '../src/config/db.js'
import Course from '../src/models/Course.js'
import Event from '../src/models/Event.js'
import { courseSeeds } from '../seed/courses.seed.js'
import { eventSeeds } from '../seed/events.seed.js'

const operationsFor = (seeds) => seeds.map((seed) => ({
  updateOne: {
    filter: { $or: [{ sourceId: seed.sourceId }, { slug: seed.slug }] },
    update: { $set: { thumbnail: seed.thumbnail } },
  },
}))

async function updatePageImages() {
  await connectDB()

  try {
    const [courses, events] = await Promise.all([
      Course.bulkWrite(operationsFor(courseSeeds), { ordered: false }),
      Event.bulkWrite(operationsFor(eventSeeds), { ordered: false }),
    ])

    console.log(`Course thumbnails matched: ${courses.matchedCount}; updated: ${courses.modifiedCount}`)
    console.log(`Event thumbnails matched: ${events.matchedCount}; updated: ${events.modifiedCount}`)
  } finally {
    await closeDB()
  }
}

updatePageImages().catch((error) => {
  console.error('Page image update failed:', error.message)
  process.exitCode = 1
})
