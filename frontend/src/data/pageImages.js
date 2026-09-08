import courseDevelopment from '../assets/images/courses/web-development.webp'
import courseDataScience from '../assets/images/courses/data-science.webp'
import courseDesign from '../assets/images/courses/ui-ux-design.webp'
import courseBusiness from '../assets/images/courses/business-growth.webp'
import courseMarketing from '../assets/images/courses/digital-marketing.webp'
import courseNlp from '../assets/images/courses/natural-language-processing.webp'
import courseDeepLearning from '../assets/images/courses/deep-learning.webp'
import courseMobile from '../assets/images/courses/mobile-app-development.webp'
import courseProductivity from '../assets/images/courses/productivity.webp'

import eventDevelopment from '../assets/images/events/web-development.webp'
import eventDataScience from '../assets/images/events/data-science-machine-learning.webp'
import eventDesign from '../assets/images/events/ui-ux-design.webp'
import eventMarketing from '../assets/images/events/digital-marketing.webp'
import eventBusiness from '../assets/images/events/business-analytics.webp'
import eventPython from '../assets/images/events/python-programming.webp'

export { default as coursesHeroPhoto } from '../assets/images/courses/hero.webp'
export { default as eventsHeroPhoto } from '../assets/images/events/hero.webp'

export const COURSE_PAGE_IMAGES = Object.freeze({
  'course-development': courseDevelopment,
  'course-data-science': courseDataScience,
  'course-design': courseDesign,
  'course-business': courseBusiness,
  'course-marketing': courseMarketing,
  'course-nlp': courseNlp,
  'course-deep-learning': courseDeepLearning,
  'course-mobile': courseMobile,
  'course-productivity': courseProductivity,
})

export const EVENT_PAGE_IMAGES = Object.freeze({
  'event-development': eventDevelopment,
  'event-data-science': eventDataScience,
  'event-design': eventDesign,
  'event-marketing': eventMarketing,
  'event-business': eventBusiness,
  'event-python': eventPython,
})

const LEGACY_COURSE_IMAGE_TYPES = new Set([
  'development',
  'datascience',
  'dataScience',
  'design',
  'business',
  'marketing',
  'python',
  'ai',
  'react',
  'cloud',
  'finance',
  'productivity',
  'personalDevelopment',
])

export function getCoursePageImageKey(course = {}) {
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

export function resolveCoursePageImage(course = {}, source, useRelatedFallback = false) {
  const value = String(source ?? course.thumbnail ?? '').trim()
  if (COURSE_PAGE_IMAGES[value]) return COURSE_PAGE_IMAGES[value]
  if (!value || LEGACY_COURSE_IMAGE_TYPES.has(value)) {
    return useRelatedFallback ? COURSE_PAGE_IMAGES[getCoursePageImageKey(course)] : ''
  }
  return ''
}

export function resolveEventPageImage(event = {}) {
  const value = String(event.thumbnail || '').trim()
  if (EVENT_PAGE_IMAGES[value]) return EVENT_PAGE_IMAGES[value]

  const type = String(event.imageType || '').toLowerCase()
  const category = String(event.category || '').toLowerCase()
  const topic = `${event.title || ''} ${category}`.toLowerCase()
  if (/python/.test(topic) || type === 'python') return EVENT_PAGE_IMAGES['event-python']
  if (/data science|machine learning/.test(topic) || type === 'datascience') return EVENT_PAGE_IMAGES['event-data-science']
  if (/design|\bui\b|\bux\b/.test(topic) || type === 'design') return EVENT_PAGE_IMAGES['event-design']
  if (/marketing/.test(topic) || type === 'marketing') return EVENT_PAGE_IMAGES['event-marketing']
  if (/business|analytics/.test(topic) || type === 'business') return EVENT_PAGE_IMAGES['event-business']
  return EVENT_PAGE_IMAGES['event-development']
}
