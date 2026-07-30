import { client } from './client.js'

export const getEvents = (params = '') => client(`/events${params}`)
export const getEventById = (eventId) => client(`/events/${eventId}`)
