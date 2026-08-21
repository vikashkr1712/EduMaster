import { client } from './client.js'

export const submitContact = (payload) => client('/contact', { method: 'POST', body: payload })
