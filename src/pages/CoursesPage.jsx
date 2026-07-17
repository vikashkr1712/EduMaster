import { useMemo, useState, useEffect } from 'react'
import Navbar from '../components/Home/Navbar/Navbar.jsx'
import Footer from '../components/Home/Footer/Footer.jsx'
import CoursesHero from '../components/Courses/CoursesHero.jsx'
import CoursesSidebar from '../components/Courses/CoursesSidebar.jsx'
import CourseGrid from '../components/Courses/CourseGrid.jsx'
import CoursesPagination from '../components/Courses/CoursesPagination.jsx'
import RequestCourseBanner from '../components/Courses/RequestCourseBanner.jsx'
import { courses, sortOptions, COURSES_PER_PAGE } from '../data/coursesData.js'
import '../components/Courses/CoursesPage.css'

function FilterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const DEFAULT_FILTERS = {
  category: 'All Categories',
  levels: [],
  prices: [],
  ratings: [],
}

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState('Popular')
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* --- filtering --- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = courses.filter((c) => {
      if (filters.category !== 'All Categories' && c.category !== filters.category) return false
      if (filters.levels.length > 0 && !filters.levels.includes(c.level)) return false
      if (filters.prices.length > 0 && !filters.prices.includes(c.priceType)) return false
      if (filters.ratings.length > 0 && !filters.ratings.some((r) => c.rating >= r)) return false
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.category.toLowerCase().includes(q) &&
        !c.instructor.toLowerCase().includes(q) &&
        !c.level.toLowerCase().includes(q)
      )
        return false
      return true
    })

    /* --- sorting --- */
    const students = (c) => parseInt(c.students.replace(/[,+]/g, ''), 10) || 0
    switch (sort) {
      case 'Popular':
        list = [...list].sort((a, b) => students(b) - students(a))
        break
      case 'Newest':
        list = [...list].sort((a, b) => b.id - a.id)
        break
      case 'Highest Rated':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      case 'Price: Low to High':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'Price: High to Low':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    return list
  }, [search, filters, sort])

  /* --- pagination --- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / COURSES_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const pageCourses = filtered.slice((safePage - 1) * COURSES_PER_PAGE, safePage * COURSES_PER_PAGE)

  // reset to page 1 whenever filters/search/sort change
  useEffect(() => {
    setPage(1)
  }, [search, filters, sort])

  const handlePage = (p) => {
    setPage(p)
    // scroll back to the top of the results
    document.querySelector('.courses-page-body')?.scrollIntoView({ behavior: 'smooth' })
  }

  const showingFrom = filtered.length === 0 ? 0 : (safePage - 1) * COURSES_PER_PAGE + 1
  const showingTo = Math.min(safePage * COURSES_PER_PAGE, filtered.length)

  return (
    <>
      <Navbar />
      <CoursesHero search={search} onSearch={setSearch} />

      <div className="courses-page-body">
        <div className="container courses-layout">
          <CoursesSidebar
            filters={filters}
            setFilters={setFilters}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="courses-main">
            <div className="courses-toolbar">
              <p className="courses-toolbar-count">
                Showing <b>{showingFrom}</b> – <b>{showingTo}</b> of <b>{filtered.length}</b>{' '}
                courses
              </p>
              <div className="courses-toolbar-right">
                <button className="courses-filter-btn" onClick={() => setSidebarOpen(true)}>
                  <FilterIcon />
                  Filters
                </button>
                <div className="courses-sort">
                  <label htmlFor="courses-sort-select">Sort by:</label>
                  <select
                    id="courses-sort-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {sortOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <CourseGrid courses={pageCourses} />
            <CoursesPagination page={safePage} totalPages={totalPages} onPage={handlePage} />
          </div>
        </div>
      </div>

      <RequestCourseBanner />
      <Footer />
    </>
  )
}
