import { client } from './client.js'

export const getServices = (params = '') => client(`/services${params}`)
export const getServiceById = (serviceId) => client(`/services/${serviceId}`)
