import { serviceCards } from '../../frontend/src/data/servicesData.js'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const serviceSeeds = serviceCards.map((service) => ({
  sourceId: service.id,
  title: service.title,
  slug: slugify(service.title),
  description: service.text,
  shortDescription: service.text,
  category: 'Learning Services',
  icon: service.icon,
  tint: service.tint,
  isPublished: true,
}))
