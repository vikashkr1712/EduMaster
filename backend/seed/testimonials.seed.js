import { testimonials } from '../../frontend/src/data/testimonialsData.js'

export const testimonialSeeds = testimonials.map((testimonial) => ({
  sourceId: testimonial.id,
  studentName: testimonial.name,
  designation: testimonial.designation,
  company: testimonial.company,
  avatar: testimonial.avatar,
  rating: testimonial.rating,
  review: testimonial.review,
  isFeatured: testimonial.featured,
  isPublished: true,
}))
