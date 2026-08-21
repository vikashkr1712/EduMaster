const unsafeFormula = /^[=+\-@]/

export const safeCsvCell = (value) => {
  const text = value == null ? '' : String(value)
  const protectedText = unsafeFormula.test(text) ? `'${text}` : text
  return `"${protectedText.replaceAll('"', '""')}"`
}

export const buildCoursePerformanceCsv = (courses = []) => {
  const headers = ['Course', 'Enrollments', 'Completed', 'Completion Rate', 'Revenue (INR)', 'Certificates', 'Average Progress']
  const rows = courses.map((course) => [
    course.title,
    course.enrollments,
    course.completed,
    `${course.completionRate}%`,
    course.revenue,
    course.certificates,
    `${course.averageProgress}%`,
  ])
  return [headers, ...rows].map((row) => row.map(safeCsvCell).join(',')).join('\r\n')
}

export const downloadCsv = (csv, filename) => {
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
