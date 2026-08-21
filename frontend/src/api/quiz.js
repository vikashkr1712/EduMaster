import { client } from './client.js'

export const getQuizByLesson = (lessonId, courseId) => client(`/quizzes/${encodeURIComponent(lessonId)}${courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''}`)
export const startQuiz = (quizId) => client(`/quizzes/${encodeURIComponent(quizId)}/start`, { method: 'POST' })
export const submitQuiz = (quizId, payload) => client(`/quizzes/${encodeURIComponent(quizId)}/submit`, { method: 'POST', body: payload })
export const getQuizResult = (attemptId) => client(`/quizzes/result/${encodeURIComponent(attemptId)}`)
export const getQuizHistory = () => client('/quizzes/history')
