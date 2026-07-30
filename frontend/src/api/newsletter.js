import { client } from './client.js'

export const subscribeToNewsletter = (email) => client('/newsletter/subscribe', { method: 'POST', body: { email } })
export const unsubscribeFromNewsletter = (email) => client('/newsletter/unsubscribe', { method: 'POST', body: { email } })
