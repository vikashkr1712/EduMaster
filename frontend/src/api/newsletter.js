import { client } from './client.js'

export const submitNewsletter = ({ email }) => client('/newsletter/subscribe', { method: 'POST', body: { email } })
