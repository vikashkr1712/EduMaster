import { useMemo, useState, useEffect } from 'react'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import CoursesHero from '../../components/Courses/CoursesHero.jsx'
import CoursesSidebar from '../../components/Courses/CoursesSidebar.jsx'
import CourseGrid from '../../components/Courses/CourseGrid.jsx'
import CoursesPagination from '../../components/Courses/CoursesPagination.jsx'
import RequestCourseBanner from '../../components/Courses/RequestCourseBanner.jsx'
import { COURSES_PER_PAGE } from '../../data/coursesData.js'
import { getCourses } from '../../api/course.js'
import './CoursesPage.css'
import './CoursesMotion.css'

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

// Backend-supported sort options only (see course.service SORT_OPTIONS)
const SORT_PARAMS = {
  Newest: 'newest',
  'Price: Low to High': 'priceAsc',
  'Price: High to Low': 'priceDesc',
}
const SORT_OPTIONS = Object.keys(SORT_PARAMS)

const SEARCH_DEBOUNCE_MS = 400

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState('Newest')
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [courses, setCourses] = useState([])
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'error' | 'success'
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  /* --- debounce the search input --- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  // reset to page 1 whenever filters/search/sort change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters, sort])

  /* --- backend query params --- */
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: COURSES_PER_PAGE,
      sort: SORT_PARAMS[sort] ?? 'newest',
    }
    if (debouncedSearch) params.search = debouncedSearch
    if (filters.category !== 'All Categories') params.category = filters.category
    // backend accepts a single level; multi-select can't be expressed server-side
    if (filters.levels.length === 1) params.level = filters.levels[0]
    // Free = price 0, Paid = price > 0 (via min/max price params)
    if (filters.prices.length === 1) {
      if (filters.prices[0] === 'Free') params.maxPrice = 0
      else params.minPrice = 1
    }
    return params
  }, [debouncedSearch, filters, sort, page])

  /* --- fetch courses --- */
  useEffect(() => {
    let ignore = false
    setStatus('loading')

    getCourses(queryParams)
      .then((response) => {
        if (ignore) return
        const data = response?.data ?? {}
        const apiCourses = Array.isArray(data.courses) ? data.courses : []
        setCourses(apiCourses)
        setPagination(data.pagination ?? null)
        setStatus('success')
      })
      .catch((error) => {
        if (ignore) return
        setCourses([])
        setPagination(null)
        setErrorMessage(error.message)
        setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [queryParams, retryToken])

  /* --- pagination (from backend) --- */
  const totalPages = pagination?.pages ?? 1
  const total = pagination?.total ?? 0
  const currentPage = pagination?.page ?? page
  const limit = pagination?.limit ?? COURSES_PER_PAGE

  const handlePage = (p) => {
    setPage(p)
    // scroll back to the top of the results
    document.querySelector('.courses-page-body')?.scrollIntoView({ behavior: 'smooth' })
  }

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const showingTo = total === 0 ? 0 : (currentPage - 1) * limit + courses.length

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
                {status === 'success' ? (
                  <>
                    Showing <b>{showingFrom}</b> – <b>{showingTo}</b> of <b>{total}</b> courses
                  </>
                ) : (
                  <>&nbsp;</>
                )}
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
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {status === 'loading' && (
              <div className="cgrid-empty" role="status">
                <h3>Loading courses…</h3>
                <p>Fetching the latest courses for you.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="cgrid-empty" role="alert">
                <h3>Unable to load courses</h3>
                <p>{errorMessage || 'Unable to connect to the server. Please try again.'}</p>
                <button className="courses-filter-btn" onClick={() => setRetryToken((t) => t + 1)}>
                  Try Again
                </button>
              </div>
            )}

            {status === 'success' && (
              <>
                <CourseGrid courses={courses} />
                <CoursesPagination page={currentPage} totalPages={totalPages} onPage={handlePage} />
              </>
            )}
          </div>
        </div>
      </div>

      <RequestCourseBanner />
      <Footer />
    </>
  )
}
