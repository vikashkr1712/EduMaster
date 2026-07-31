import { courses } from '../../frontend/src/data/coursesData.js'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const courseSeeds = courses.map((course) => ({
  sourceId: course.id,
  title: course.title,
  slug: slugify(course.title),
  description: course.title,
  category: course.category,
  level: course.level,
  price: course.price,
  oldPrice: course.oldPrice,
  priceType: course.priceType,
  rating: course.rating,
  students: course.students,
  instructor: course.instructor,
  thumbnail: course.imageType,
  imageType: course.imageType,
  isPublished: true,
}))
