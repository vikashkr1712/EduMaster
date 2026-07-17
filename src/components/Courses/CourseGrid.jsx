import CourseCard from './CourseCard.jsx'

export default function CourseGrid({ courses }) {
  if (courses.length === 0) {
    return (
      <div className="cgrid-empty">
        <h3>No courses found</h3>
        <p>Try adjusting your filters or search to find what you&apos;re looking for.</p>
      </div>
    )
  }

  return (
    <div className="cgrid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
