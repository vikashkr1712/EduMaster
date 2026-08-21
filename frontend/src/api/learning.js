import { client } from './client.js'

const learningCache = new Map()

export function getLearningCourse(courseId, { force = false } = {}) {
  const key = String(courseId)
  if (!force && learningCache.has(key)) return learningCache.get(key)
  const request = client(`/learn/${encodeURIComponent(key)}`)
    .catch((error) => { learningCache.delete(key); throw error })
  learningCache.set(key, request)
  return request
}

export function updateCachedEnrollment(courseId, enrollment) {
  const key = String(courseId)
  const cached = learningCache.get(key)
  if (!cached) return
  learningCache.set(key, Promise.resolve(cached).then((response) => ({
    ...response,
    data: { ...response.data, enrollment },
  })))
}

export async function saveLessonProgress(payload) {
  const response = await client('/learn/progress', { method: 'PATCH', body: payload })
  if (response?.data?.enrollment) updateCachedEnrollment(payload.courseId, response.data.enrollment)
  return response
}

export async function saveCurrentLesson(payload) {
  const response = await client('/learn/current-lesson', { method: 'PATCH', body: payload })
  if (response?.data?.enrollment) updateCachedEnrollment(payload.courseId, response.data.enrollment)
  return response
}

export const createLessonNote = (payload) =>
  client('/learn/notes', { method: 'POST', body: payload })

export const updateLessonNote = (noteId, payload) =>
  client(`/learn/notes/${encodeURIComponent(noteId)}`, { method: 'PATCH', body: payload })

export const deleteLessonNote = (noteId, courseId) =>
  client(`/learn/notes/${encodeURIComponent(noteId)}?courseId=${encodeURIComponent(courseId)}`, { method: 'DELETE' })

export const setLessonBookmark = (payload) =>
  client('/learn/bookmark', { method: 'POST', body: payload })
