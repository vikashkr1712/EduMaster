import { client } from './client.js'

export const createOrder = (payload) =>
  client('/orders', { method: 'POST', body: payload })

export const getOrder = (id) =>
  client(`/orders/${encodeURIComponent(id)}`)

export const getUserOrders = () =>
  client('/orders/user')
