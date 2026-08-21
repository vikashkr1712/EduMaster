import { useCallback, useEffect, useRef, useState } from 'react'
import { getAdminReport } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import AdminPagination from '../../components/Admin/AdminPagination.jsx'
import AdminReportChart from '../../components/Admin/AdminReportChart.jsx'
import AdminStatCard from '../../components/Admin/AdminStatCard.jsx'
import { buildCoursePerformanceCsv, downloadCsv } from '../../utils/reportCsv.js'
import './AdminReports.css'

const numbers = new Intl.NumberFormat('en-IN')
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const ranges = [{ value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }, { value: '90d', label: 'Last 90 Days' }, { value: 'all', label: 'All Time' }]
const COURSE_PAGE_SIZE = 10
const overviewCards = [
  ['users', 'Users', 'users'], ['courses', 'Courses', 'courses'], ['enrollments', 'Enrollments', 'enrollments'],
  ['orders', 'Orders', 'orders'], ['revenue', 'Revenue', 'revenue'], ['certificates', 'Certificates', 'certificates'],
  ['quizAttempts', 'Quiz Attempts', 'quizzes'], ['assignmentSubmissions', 'Submissions', 'assignments'], ['discussions', 'Discussions', 'discussions'],
]

const errorCopy = (error) => {
  if (error?.status === 400) return 'The selected report range is invalid. Choose one of the available ranges.'
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Your account does not have permission to view analytics.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE' || error?.code === 'TIMEOUT') return 'Unable to reach the analytics service. Check your connection and retry.'
  return error?.message || 'The analytics query could not be completed.'
}

const Metric = ({ label, value, suffix = '' }) => <div className="admin-report-metric"><span>{label}</span><strong>{value}{suffix}</strong></div>

export default function AdminReportsPage() {
  const [range, setRange] = useState('30d')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)
  const [coursePage, setCoursePage] = useState(1)

  const load = useCallback(async (selectedRange, refresh = false) => {
    const currentRequest = ++requestId.current
    refresh ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const response = await getAdminReport({ range: selectedRange })
      if (requestId.current === currentRequest) setReport(response?.data ?? null)
    } catch (requestError) {
      if (requestId.current === currentRequest) setError(requestError)
    } finally {
      if (requestId.current === currentRequest) { setLoading(false); setRefreshing(false) }
    }
  }, [])

  useEffect(() => { setCoursePage(1); load(range); return () => { requestId.current += 1 } }, [load, range])

  const courseRows = report?.coursePerformance ?? []
  const coursePages = Math.max(1, Math.ceil(courseRows.length / COURSE_PAGE_SIZE))
  const visibleCourses = courseRows.slice((coursePage - 1) * COURSE_PAGE_SIZE, coursePage * COURSE_PAGE_SIZE)

  const exportCourses = () => {
    if (!report?.coursePerformance?.length) return
    downloadCsv(buildCoursePerformanceCsv(report.coursePerformance), `edumaster-course-performance-${range}.csv`)
  }

  if (loading) return <div className="admin-report-loading" aria-busy="true" aria-label="Loading analytics"><span /><span /><span /><span /><span /><span /></div>

  return (
    <div className="admin-reports">
      <div className="admin-reports__intro">
        <div><h1>Reports &amp; Analytics</h1><p>Understand EduMaster performance using real platform data.</p></div>
        <div className="admin-reports__controls">
          <label><span>Date range</span><select value={range} onChange={(event) => setRange(event.target.value)}>{ranges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <button type="button" className="admin-refresh-button" onClick={() => load(range, true)} disabled={refreshing}><AdminIcon name="refresh" size={17} className={refreshing ? 'is-spinning' : ''} />{refreshing ? 'Refreshing…' : 'Refresh'}</button>
          <button type="button" className="admin-report-export" onClick={exportCourses} disabled={!report?.coursePerformance?.length}><AdminIcon name="download" size={17} />Export CSV</button>
        </div>
      </div>

      {error ? <section className="admin-report-error" role="alert"><h2>Unable to load reports</h2><p>{errorCopy(error)}</p><button type="button" onClick={() => load(range)}>Retry</button></section> : report && <>
        <section aria-labelledby="report-overview-title"><div className="admin-report-section-heading"><div><h2 id="report-overview-title">Platform Overview</h2><p>{report.range.label} · generated {new Date(report.generatedAt).toLocaleString()}</p></div></div><div className="admin-report-card-grid">{overviewCards.map(([field, label, icon]) => <AdminStatCard key={field} field={field} label={label} icon={icon} description={range === 'all' ? 'All-time total' : 'Within selected range'} value={field === 'revenue' ? currency.format(report.overview[field] || 0) : numbers.format(report.overview[field] || 0)} />)}</div></section>

        <div className="admin-report-chart-grid">
          <AdminReportChart id="revenue-chart" title="Revenue Over Time" description="Completed paid orders only" data={report.series.revenue} valueLabel="Revenue" currency />
          <AdminReportChart id="users-chart" title="Users Joined Over Time" description="Accounts created in each period" data={report.series.users} valueLabel="Users joined" />
          <AdminReportChart id="enrollments-chart" title="Enrollments Over Time" description="Course enrollments created in each period" data={report.series.enrollments} valueLabel="Enrollments" />
        </div>

        <section className="admin-report-panel" aria-labelledby="revenue-overview-title"><div className="admin-report-section-heading"><div><h2 id="revenue-overview-title">Revenue &amp; Orders</h2><p>Revenue excludes free, pending, failed, and refunded orders.</p></div></div><div className="admin-report-metric-grid"><Metric label="Revenue" value={currency.format(report.orders.revenue)} /><Metric label="Paid Orders" value={numbers.format(report.orders.paid)} /><Metric label="Average Paid Order" value={currency.format(report.orders.averagePaidOrderValue)} /><Metric label="Completed" value={numbers.format(report.orders.completed)} /><Metric label="Pending" value={numbers.format(report.orders.pending)} /><Metric label="Failed" value={numbers.format(report.orders.failed)} /><Metric label="Refunded" value={numbers.format(report.orders.refunded)} /><Metric label="Free Orders" value={numbers.format(report.orders.free)} /></div></section>

        <section className="admin-report-panel admin-report-panel--course-performance" aria-labelledby="course-performance-title"><div className="admin-report-section-heading"><div><h2 id="course-performance-title">Course Performance</h2><p>Aggregated enrollment, completion, revenue, certificate, and progress data.</p></div></div>{courseRows.length === 0 ? <div className="admin-report-empty">No courses are available.</div> : <><div className="admin-report-table-wrap"><table className="admin-report-table"><caption className="sr-only">Course performance for {report.range.label}</caption><thead><tr><th scope="col">Course</th><th scope="col">Enrollments</th><th scope="col">Completed</th><th scope="col">Completion</th><th scope="col">Revenue</th><th scope="col">Certificates</th><th scope="col">Avg. Progress</th></tr></thead><tbody>{visibleCourses.map((course) => <tr key={course._id}><th scope="row">{course.title}</th><td>{numbers.format(course.enrollments)}</td><td>{numbers.format(course.completed)}</td><td>{course.completionRate}%</td><td>{currency.format(course.revenue)}</td><td>{numbers.format(course.certificates)}</td><td>{course.averageProgress}%</td></tr>)}</tbody></table></div><AdminPagination page={coursePage} pages={coursePages} total={courseRows.length} limit={COURSE_PAGE_SIZE} itemLabel="courses" onPageChange={setCoursePage} /></>}</section>

        <div className="admin-report-detail-grid">
          <section className="admin-report-panel" aria-labelledby="learning-title"><div className="admin-report-section-heading"><div><h2 id="learning-title">Learning &amp; Assessment</h2><p>Completed learning records only drive assessment results.</p></div></div><h3>Enrollments</h3><div className="admin-report-metric-grid is-compact"><Metric label="Completed" value={report.learning.completed} /><Metric label="In Progress" value={report.learning.inProgress} /><Metric label="Completion Rate" value={report.learning.completionRate} suffix="%" /><Metric label="Average Progress" value={report.learning.averageProgress} suffix="%" /></div><h3>Quizzes &amp; assignments</h3><div className="admin-report-metric-grid is-compact"><Metric label="Quiz Attempts" value={report.assessments.attempts} /><Metric label="Passed" value={report.assessments.passed} /><Metric label="Pass Rate" value={report.assessments.passRate} suffix="%" /><Metric label="Average Score" value={report.assessments.averageScore} suffix="%" /><Metric label="Submissions" value={report.assessments.submissions} /><Metric label="Reviewed" value={report.assessments.reviewed} /><Metric label="Pending Review" value={report.assessments.pendingReview} /><Metric label="Average Marks" value={report.assessments.averageMarks} /></div></section>
          <section className="admin-report-panel" aria-labelledby="community-title"><div className="admin-report-section-heading"><div><h2 id="community-title">Community &amp; Communication</h2><p>Discussion activity and Admin notification campaigns.</p></div></div><h3>Community</h3><div className="admin-report-metric-grid is-compact"><Metric label="Discussions" value={report.community.discussions} /><Metric label="Replies" value={report.community.replies} /><Metric label="Likes" value={report.community.likes} /><Metric label="Courses Discussed" value={report.community.coursesWithDiscussions} /></div><h3>Notification Campaigns</h3><div className="admin-report-metric-grid is-compact"><Metric label="Campaigns" value={report.notifications.campaigns} /><Metric label="Recipients" value={report.notifications.recipients} /><Metric label="Read" value={report.notifications.read} /><Metric label="Unread" value={report.notifications.unread} /><Metric label="Read Rate" value={report.notifications.readRate} suffix="%" /></div></section>
          <section className="admin-report-panel" aria-labelledby="accounts-title"><div className="admin-report-section-heading"><div><h2 id="accounts-title">Accounts &amp; Certificates</h2><p>Account status is not real-time user activity.</p></div></div><h3>Account Breakdown</h3><div className="admin-report-metric-grid is-compact"><Metric label="Students" value={report.users.students} /><Metric label="Admins" value={report.users.admins} /><Metric label="Enabled Accounts" value={report.users.enabled} /><Metric label="Disabled Accounts" value={report.users.disabled} /></div><h3>Certificates</h3><div className="admin-report-metric-grid is-compact"><Metric label="Issued" value={report.certificates.issued} /><Metric label="Valid" value={report.certificates.valid} /><Metric label="Revoked" value={report.certificates.revoked} /><Metric label="Unique Users" value={report.certificates.uniqueUsers} /><Metric label="Issuing Courses" value={report.certificates.issuingCourses} /></div></section>
        </div>
      </>}
    </div>
  )
}
