import { client } from './client.js'

const buildQuery = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

export const getEvents = (params) => client(`/events${buildQuery(params)}`)
export const getEventBySlug = (slug) => client(`/events/${encodeURIComponent(slug)}`)
