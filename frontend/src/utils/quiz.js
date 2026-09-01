export const requiredCorrectAnswers = (totalQuestions, passingMarks) => {
  const total = Math.max(0, Number(totalQuestions) || 0)
  const percentage = Math.min(100, Math.max(0, Number(passingMarks) || 0))
  return total ? Math.ceil((total * percentage) / 100) : 0
}
