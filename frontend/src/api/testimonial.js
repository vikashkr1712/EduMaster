import { client } from './client.js'

export const getTestimonials = (params = '') => client(`/testimonials${params}`)
