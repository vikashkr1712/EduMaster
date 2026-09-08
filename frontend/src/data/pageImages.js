import courseDevelopment from '../ChatGPT Image Sep 8, 2026, 03_49_06 PM (2).png'
import courseDataScience from '../ChatGPT Image Sep 8, 2026, 03_49_07 PM (3).png'
import courseDesign from '../ChatGPT Image Sep 8, 2026, 03_49_07 PM (4).png'
import courseBusiness from '../ChatGPT Image Sep 8, 2026, 03_49_08 PM (5).png'
import courseMarketing from '../ChatGPT Image Sep 8, 2026, 03_49_08 PM (6).png'
import courseNlp from '../ChatGPT Image Sep 8, 2026, 03_49_09 PM (7).png'
import courseDeepLearning from '../ChatGPT Image Sep 8, 2026, 03_49_09 PM (8).png'
import courseMobile from '../ChatGPT Image Sep 8, 2026, 03_49_09 PM (9).png'
import courseProductivity from '../ChatGPT Image Sep 8, 2026, 03_49_10 PM (10).png'

import eventDevelopment from '../ChatGPT Image Sep 8, 2026, 03_54_59 PM (2).png'
import eventDataScience from '../ChatGPT Image Sep 8, 2026, 03_55_00 PM (3).png'
import eventDesign from '../ChatGPT Image Sep 8, 2026, 03_55_00 PM (4).png'
import eventMarketing from '../ChatGPT Image Sep 8, 2026, 03_55_01 PM (5).png'
import eventBusiness from '../ChatGPT Image Sep 8, 2026, 03_55_01 PM (6).png'
import eventPython from '../ChatGPT Image Sep 8, 2026, 03_55_02 PM (7).png'

export { default as coursesHeroPhoto } from '../ChatGPT Image Sep 8, 2026, 03_57_35 PM.png'
export { default as eventsHeroPhoto } from '../ChatGPT Image Sep 8, 2026, 03_58_45 PM.png'

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
