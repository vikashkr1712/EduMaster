import { client } from './client.js'

export const submitContactMessage = (payload) => client('/contact', { method: 'POST', body: payload })
