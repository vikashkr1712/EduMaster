import { client } from './client.js'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

export const getAdminDashboard = () => client('/admin/dashboard')
export const getAdminReport = (params) => client(`/admin/reports${toQueryString(params)}`)
export const getAdminSettings = () => client('/admin/settings')
export const updateAdminSettings = (payload) => client('/admin/settings', { method: 'PATCH', body: payload })

const toQueryString = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export const getAdminCourses = (params) => client(`/admin/courses${toQueryString(params)}`)
export const getAdminCourse = (id) => client(`/admin/courses/${id}`)
export const createAdminCourse = (payload) => client('/admin/courses', { method: 'POST', body: payload })
export const updateAdminCourse = (id, payload) => client(`/admin/courses/${id}`, { method: 'PATCH', body: payload })
export const toggleAdminCoursePublish = (id) => client(`/admin/courses/${id}/publish`, { method: 'PATCH' })
export const deleteAdminCourse = (id) => client(`/admin/courses/${id}`, { method: 'DELETE' })

export const getAdminCurriculum = (courseId) => client(`/admin/courses/${courseId}/curriculum`)
export const createAdminModule = (courseId, payload) => client(`/admin/courses/${courseId}/modules`, { method: 'POST', body: payload })
export const updateAdminModule = (courseId, moduleId, payload) => client(`/admin/courses/${courseId}/modules/${moduleId}`, { method: 'PATCH', body: payload })
export const deleteAdminModule = (courseId, moduleId) => client(`/admin/courses/${courseId}/modules/${moduleId}`, { method: 'DELETE' })
export const reorderAdminModules = (courseId, ids) => client(`/admin/courses/${courseId}/modules/reorder`, { method: 'PATCH', body: { ids } })
export const createAdminLesson = (courseId, moduleId, payload) => client(`/admin/courses/${courseId}/modules/${moduleId}/lessons`, { method: 'POST', body: payload })
export const updateAdminLesson = (courseId, moduleId, lessonId, payload) => client(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, { method: 'PATCH', body: payload })
export const deleteAdminLesson = (courseId, moduleId, lessonId) => client(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, { method: 'DELETE' })
export const reorderAdminLessons = (courseId, moduleId, ids) => client(`/admin/courses/${courseId}/modules/${moduleId}/lessons/reorder`, { method: 'PATCH', body: { ids } })

export const getAdminUsers = (params) => client(`/admin/users${toQueryString(params)}`)
export const getAdminUser = (id) => client(`/admin/users/${id}`)
export const updateAdminUser = (id, payload) => client(`/admin/users/${id}`, { method: 'PATCH', body: payload })
export const updateAdminUserRole = (id, role) => client(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } })
export const updateAdminUserStatus = (id, isActive) => client(`/admin/users/${id}/status`, { method: 'PATCH', body: { isActive } })
export const deleteAdminUser = (id) => client(`/admin/users/${id}`, { method: 'DELETE' })

export const getAdminOrders = (params) => client(`/admin/orders${toQueryString(params)}`)
export const getAdminOrder = (id) => client(`/admin/orders/${id}`)
export const getAdminEnrollments = (params) => client(`/admin/enrollments${toQueryString(params)}`)
export const getAdminEnrollment = (id) => client(`/admin/enrollments/${id}`)

export const getAdminQuizzes = (params) => client(`/admin/quizzes${toQueryString(params)}`)
export const getAdminQuizOptions = () => client('/admin/quizzes/options')
export const getAdminQuiz = (id) => client(`/admin/quizzes/${id}`)
export const createAdminQuiz = (payload) => client('/admin/quizzes', { method: 'POST', body: payload })
export const updateAdminQuiz = (id, payload) => client(`/admin/quizzes/${id}`, { method: 'PATCH', body: payload })
export const deleteAdminQuiz = (id) => client(`/admin/quizzes/${id}`, { method: 'DELETE' })
export const createAdminQuizQuestion = (id, payload) => client(`/admin/quizzes/${id}/questions`, { method: 'POST', body: payload })
export const updateAdminQuizQuestion = (id, questionId, payload) => client(`/admin/quizzes/${id}/questions/${questionId}`, { method: 'PATCH', body: payload })
export const deleteAdminQuizQuestion = (id, questionId) => client(`/admin/quizzes/${id}/questions/${questionId}`, { method: 'DELETE' })
export const reorderAdminQuizQuestions = (id, ids) => client(`/admin/quizzes/${id}/questions/reorder`, { method: 'PATCH', body: { ids } })

export const getAdminAssignments = (params) => client(`/admin/assignments${toQueryString(params)}`)
export const getAdminAssignmentOptions = () => client('/admin/assignments/options')
export const getAdminAssignment = (id) => client(`/admin/assignments/${id}`)
export const createAdminAssignment = (payload) => client('/admin/assignments', { method: 'POST', body: payload })
export const updateAdminAssignment = (id, payload) => client(`/admin/assignments/${id}`, { method: 'PATCH', body: payload })
export const deleteAdminAssignment = (id) => client(`/admin/assignments/${id}`, { method: 'DELETE' })
export const getAdminAssignmentSubmissions = (id, params) => client(`/admin/assignments/${id}/submissions${toQueryString(params)}`)
export const getAdminAssignmentSubmission = (id, submissionId) => client(`/admin/assignments/${id}/submissions/${submissionId}`)
export const gradeAdminAssignmentSubmission = (id, submissionId, payload) => client(`/admin/assignments/${id}/submissions/${submissionId}`, { method: 'PATCH', body: payload })

export const getAdminCertificates = (params) => client(`/admin/certificates${toQueryString(params)}`)
export const getAdminCertificate = (id) => client(`/admin/certificates/${id}`)
export const updateAdminCertificateStatus = (id, status) => client(`/admin/certificates/${id}/status`, { method: 'PATCH', body: { status } })
export const getAdminCertificatePdfUrl = (id) => `${API_BASE_URL}/admin/certificates/${encodeURIComponent(id)}/pdf`

export const getAdminDiscussions = (params) => client(`/admin/discussions${toQueryString(params)}`)
export const getAdminDiscussion = (id) => client(`/admin/discussions/${id}`)
export const deleteAdminDiscussion = (id) => client(`/admin/discussions/${id}`, { method: 'DELETE' })
export const deleteAdminDiscussionReply = (id, replyId) => client(`/admin/discussions/${id}/replies/${replyId}`, { method: 'DELETE' })

export const getAdminNotifications = (params) => client(`/admin/notifications${toQueryString(params)}`)
export const getAdminNotification = (id, params) => client(`/admin/notifications/${id}${toQueryString(params)}`)
export const getAdminNotificationOptions = (params) => client(`/admin/notifications/options${toQueryString(params)}`)
export const createAdminNotification = (payload) => client('/admin/notifications', { method: 'POST', body: payload })
