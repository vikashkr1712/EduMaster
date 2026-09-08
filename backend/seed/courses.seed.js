import { courses } from '../../frontend/src/data/coursesData.js'
import { buildCourseCurriculum } from '../src/utils/courseCurriculum.js'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Deterministic enrichment — no randomness, so reseeding always
// reproduces the same realistic catalog.
const PAID_PRICES = [499, 799, 999, 1499, 1999, 2499, 2999, 3999, 4999, 6999]
const DURATIONS = {
  Beginner: ['4h 30m', '6h', '7h 45m', '9h 30m'],
  Intermediate: ['11h', '14h 30m', '16h', '19h 30m'],
  Advanced: ['21h', '24h 30m', '28h', '32h'],
}

// Keep at most this many free courses; the rest become paid with
// realistic prices from PAID_PRICES.
const TARGET_FREE = 18

let freeKept = 0

export const courseThumbnailKey = (course) => {
  const topic = `${course.title || ''} ${course.category || ''}`.toLowerCase()

  if (/natural language processing|\bnlp\b|transformers?/.test(topic)) return 'course-nlp'
  if (/mobile app|react native|flutter|android|ios/.test(topic)) return 'course-mobile'
  if (/deep learning|neural|computer vision|pytorch|mlops|machine learning a[–-]z/.test(topic)) return 'course-deep-learning'
  if (/data science|data analysis|data visualization|statistics|pandas|numpy|tableau|power bi|\bsql\b|\bpython\b/.test(topic)) return 'course-data-science'
  if (/design|\bui\b|\bux\b|figma|typography|creative|prototyp/.test(topic)) return 'course-design'
  if (/marketing|seo|social media|copywriting|advertising|branding|campaign/.test(topic)) return 'course-marketing'
  if (/productivity|time management|personal development|habits?|mindfulness|public speaking|deep work|career/.test(topic)) return 'course-productivity'
  if (/business|finance|financial|startup|entrepreneur|management|strategy|leadership|valuation|agile|scrum/.test(topic)) return 'course-business'
  return 'course-development'
}

export const courseSeeds = courses.map((course, index) => {
  let { price, oldPrice, priceType } = course

  if (priceType === 'Free' || !price) {
    if (freeKept < TARGET_FREE) {
      freeKept += 1
      priceType = 'Free'
      price = 0
      oldPrice = 0
    } else {
      priceType = 'Paid'
      price = PAID_PRICES[index % PAID_PRICES.length]
      oldPrice = price * 2
    }
  }

  const seededCourse = {
    sourceId: course.id,
    title: course.title,
    slug: slugify(course.title),
    description: course.title,
    category: course.category,
    level: course.level,
    price,
    oldPrice,
    priceType,
    rating: course.rating,
    students: course.students,
    instructor: course.instructor,
    duration: DURATIONS[course.level][index % DURATIONS[course.level].length],
    language: index % 6 === 5 ? 'Hindi' : 'English',
    hasCertificate: priceType === 'Paid' || index % 3 === 0,
    isFeatured: course.rating >= 4.8 && index % 5 === 0,
    thumbnail: courseThumbnailKey(course),
    imageType: course.imageType,
    isPublished: true,
  }
  return { ...seededCourse, modules: buildCourseCurriculum(seededCourse) }
})
