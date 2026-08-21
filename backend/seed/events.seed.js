import { popularEvents } from '../../frontend/src/data/eventsData.js'

const CATEGORY_BY_IMAGE_TYPE = {
  development: 'Development',
  datascience: 'Data Science',
  design: 'Design',
  marketing: 'Marketing',
  business: 'Business',
  python: 'IT & Software',
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const eventSeeds = popularEvents.map((event, index) => ({
  sourceId: event.id,
  title: event.title,
  slug: slugify(event.title),
  description: event.description,
  shortDescription: event.description,
  category: CATEGORY_BY_IMAGE_TYPE[event.imageType] ?? 'General',
  mode: 'Online',
  speaker: 'EduMaster Team',
  thumbnail: event.imageType,
  imageType: event.imageType,
  duration: event.duration,
  courses: event.courses,
  rating: Number(event.rating),
  reviews: event.reviews,
  startDate: new Date(Date.UTC(2030, 0, index + 1)),
  isPublished: true,
}))
