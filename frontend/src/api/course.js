import { client } from './client.js'

export const getCourses = (params = '') => client(`/courses${params}`)
export const getCourseById = (courseId) => client(`/courses/${courseId}`)
