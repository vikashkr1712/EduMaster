import { client } from './client.js'

export const register = (payload) => client('/auth/register', { method: 'POST', body: payload })
export const login = (payload) => client('/auth/login', { method: 'POST', body: payload })
export const logout = () => client('/auth/logout', { method: 'POST' })
export const refreshSession = () => client('/auth/refresh', { method: 'POST' })
export const getCurrentUser = () => client('/auth/me')
