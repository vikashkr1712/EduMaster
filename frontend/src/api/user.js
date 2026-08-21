import { client } from './client.js'

export const getProfile = () => client('/users/profile')
export const updateProfile = (payload) => client('/users/profile', { method: 'PATCH', body: payload })
export const uploadAvatar = (dataUrl) => client('/users/profile/avatar', { method: 'PATCH', body: { dataUrl } })
export const changePassword = (payload) => client('/users/password', { method: 'PATCH', body: payload })
