import { client } from './client.js'

const buildQuery = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

export const getCourses = (params) => client(`/courses${buildQuery(params)}`)
export const getCourseBySlug = (slug) => client(`/courses/${encodeURIComponent(slug)}`)
