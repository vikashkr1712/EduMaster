import { Component, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionProvider } from './components/Home/motion.jsx'
import { LogoutConfirmProvider } from './components/Dashboard/LogoutModal.jsx'
import { AvatarProvider } from './components/Profile/AvatarProvider.jsx'
import { NotificationProvider } from './components/Notifications/NotificationProvider.jsx'
import { AuthProvider, useAuth } from './components/Auth/AuthProvider.jsx'
import { WishlistProvider } from './components/Wishlist/WishlistProvider.jsx'
import { CartProvider } from './components/Cart/CartProvider.jsx'
import StatusPage from './pages/Status/StatusPage.jsx'
import AdminRoute from './components/Admin/AdminRoute.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const CoursesPage = lazy(() => import('./pages/Courses/CoursesPage.jsx'))
const CourseDetailsPage = lazy(() => import('./pages/CourseDetails/CourseDetailsPage.jsx'))
const EventsPage = lazy(() => import('./pages/Events/EventsPage.jsx'))
const ServicesPage = lazy(() => import('./pages/Services/ServicesPage.jsx'))
const Testimonials = lazy(() => import('./pages/Testimonials/Testimonials.jsx'))
const About = lazy(() => import('./pages/About/About.jsx'))
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'))
const LoginPage = lazy(() => import('./pages/Auth/LoginPage.jsx'))
const SignupPage = lazy(() => import('./pages/Auth/SignupPage.jsx'))
const MyProfilePage = lazy(() => import('./pages/Profile/MyProfilePage.jsx'))
const CertificatesPage = lazy(() => import('./pages/Profile/CertificatesPage.jsx'))
const OrderHistoryPage = lazy(() => import('./pages/Profile/OrderHistoryPage.jsx'))
const MyCoursesPage = lazy(() => import('./pages/Profile/MyCoursesPage.jsx'))
const SettingsPage = lazy(() => import('./pages/Profile/SettingsPage.jsx'))
const PaymentMethodsPage = lazy(() => import('./pages/Profile/PaymentMethodsPage.jsx'))
const WishlistPage = lazy(() => import('./pages/Profile/WishlistPage.jsx'))
const HelpSupportPage = lazy(() => import('./pages/Profile/HelpSupportPage.jsx'))
const AdminLoginPage = lazy(() => import('./pages/Admin/AdminLoginPage.jsx'))
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout.jsx'))
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage.jsx'))
const AdminCoursesPage = lazy(() => import('./pages/Admin/AdminCoursesPage.jsx'))
const AdminCourseFormPage = lazy(() => import('./pages/Admin/AdminCourseFormPage.jsx'))
const AdminCurriculumPage = lazy(() => import('./pages/Admin/AdminCurriculumPage.jsx'))
const AdminUsersPage = lazy(() => import('./pages/Admin/AdminUsersPage.jsx'))
const AdminUserDetailsPage = lazy(() => import('./pages/Admin/AdminUserDetailsPage.jsx'))
const AdminOrdersPage = lazy(() => import('./pages/Admin/AdminOrdersPage.jsx'))
const AdminOrderDetailsPage = lazy(() => import('./pages/Admin/AdminOrderDetailsPage.jsx'))
const AdminEnrollmentsPage = lazy(() => import('./pages/Admin/AdminEnrollmentsPage.jsx'))
const AdminEnrollmentDetailsPage = lazy(() => import('./pages/Admin/AdminEnrollmentDetailsPage.jsx'))
const AdminQuizzesPage = lazy(() => import('./pages/Admin/AdminQuizzesPage.jsx'))
const AdminQuizFormPage = lazy(() => import('./pages/Admin/AdminQuizFormPage.jsx'))
const AdminQuizDetailsPage = lazy(() => import('./pages/Admin/AdminQuizDetailsPage.jsx'))
const AdminAssignmentsPage = lazy(() => import('./pages/Admin/AdminAssignmentsPage.jsx'))
const AdminAssignmentFormPage = lazy(() => import('./pages/Admin/AdminAssignmentFormPage.jsx'))
const AdminAssignmentDetailsPage = lazy(() => import('./pages/Admin/AdminAssignmentDetailsPage.jsx'))
const AdminAssignmentSubmissionsPage = lazy(() => import('./pages/Admin/AdminAssignmentSubmissionsPage.jsx'))
const AdminAssignmentSubmissionDetailsPage = lazy(() => import('./pages/Admin/AdminAssignmentSubmissionDetailsPage.jsx'))
const AdminCertificatesPage = lazy(() => import('./pages/Admin/AdminCertificatesPage.jsx'))
const AdminCertificateDetailsPage = lazy(() => import('./pages/Admin/AdminCertificateDetailsPage.jsx'))
const AdminDiscussionsPage = lazy(() => import('./pages/Admin/AdminDiscussionsPage.jsx'))
const AdminDiscussionDetailsPage = lazy(() => import('./pages/Admin/AdminDiscussionDetailsPage.jsx'))
const AdminNotificationsPage = lazy(() => import('./pages/Admin/AdminNotificationsPage.jsx'))
const AdminNotificationFormPage = lazy(() => import('./pages/Admin/AdminNotificationFormPage.jsx'))
const AdminNotificationDetailsPage = lazy(() => import('./pages/Admin/AdminNotificationDetailsPage.jsx'))
const AdminReportsPage = lazy(() => import('./pages/Admin/AdminReportsPage.jsx'))
const AdminSettingsPage = lazy(() => import('./pages/Admin/AdminSettingsPage.jsx'))
const AdminProfilePage = lazy(() => import('./pages/Admin/AdminProfilePage.jsx'))
const CartPage = lazy(() => import('./pages/Cart/CartPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccess/OrderSuccessPage.jsx'))
const CourseLearningPage = lazy(() => import('./pages/Learning/CourseLearningPage.jsx'))
const CertificateVerifyPage = lazy(() => import('./pages/CertificateVerify/CertificateVerifyPage.jsx'))
const QuizPage = lazy(() => import('./pages/Quiz/QuizPage.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

const titles = {
  '/': 'EduMaster — Learn. Grow. Succeed.',
  '/courses': 'Online Courses | EduMaster',
  '/events': 'Learning Events | EduMaster',
  '/services': 'Student Services | EduMaster',
  '/testimonials': 'Student Stories | EduMaster',
  '/about': 'About EduMaster',
  '/contact': 'Contact EduMaster',
  '/admin/dashboard': 'Admin Dashboard | EduMaster',
  '/admin/courses': 'Admin Courses | EduMaster',
  '/admin/courses/new': 'Add Course | EduMaster',
  '/admin/users': 'Admin Users | EduMaster',
  '/admin/orders': 'Admin Orders | EduMaster',
  '/admin/enrollments': 'Admin Enrollments | EduMaster',
  '/admin/quizzes': 'Admin Quizzes | EduMaster',
  '/admin/quizzes/new': 'Create Quiz | EduMaster',
  '/admin/assignments': 'Admin Assignments | EduMaster',
  '/admin/assignments/new': 'Create Assignment | EduMaster',
  '/admin/certificates': 'Admin Certificates | EduMaster',
  '/admin/discussions': 'Admin Discussions | EduMaster',
  '/admin/notifications': 'Admin Notifications | EduMaster',
  '/admin/notifications/new': 'Create Notification | EduMaster',
  '/admin/reports': 'Admin Reports & Analytics | EduMaster',
  '/admin/settings': 'Admin Settings | EduMaster',
  '/admin/profile': 'Admin Profile | EduMaster',
}

function SeoManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    const title = titles[pathname] || (/^\/admin\/courses\/[^/]+\/curriculum$/.test(pathname) ? 'Manage Curriculum | EduMaster' : pathname.startsWith('/admin/notifications/') ? 'Notification Details | EduMaster' : pathname.startsWith('/admin/discussions/') ? 'Discussion Details | EduMaster' : pathname.startsWith('/admin/certificates/') ? 'Certificate Details | EduMaster' : /^\/admin\/assignments\/[^/]+\/submissions\/[^/]+$/.test(pathname) ? 'Submission Review | EduMaster' : /^\/admin\/assignments\/[^/]+\/submissions$/.test(pathname) ? 'Assignment Submissions | EduMaster' : /^\/admin\/assignments\/[^/]+\/edit$/.test(pathname) ? 'Edit Assignment | EduMaster' : pathname.startsWith('/admin/assignments/') ? 'Assignment Details | EduMaster' : /^\/admin\/quizzes\/[^/]+\/edit$/.test(pathname) ? 'Edit Quiz | EduMaster' : pathname.startsWith('/admin/quizzes/') ? 'Quiz Details | EduMaster' : pathname.startsWith('/admin/orders/') ? 'Admin Order Details | EduMaster' : pathname.startsWith('/admin/enrollments/') ? 'Admin Enrollment Details | EduMaster' : pathname.startsWith('/admin/users/') ? 'Admin User Details | EduMaster' : pathname.startsWith('/admin/courses/') ? 'Edit Course | EduMaster' : pathname.startsWith('/learn/') ? 'Course Player | EduMaster' : pathname.startsWith('/profile') ? 'Student Dashboard | EduMaster' : 'EduMaster — Learn. Grow. Succeed.')
    document.title = title
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${window.location.origin}${pathname}`)
  }, [pathname])
  return null
}

function RouteFallback() {
  return <main className="route-loading" aria-busy="true" aria-label="Loading page"><span /><span /><span /></main>
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <RouteFallback />
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function AdminLoginRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <RouteFallback />
  if (!isAuthenticated) return children
  if (user?.role !== 'admin') return <Navigate to="/forbidden" replace />

  const returnLocation = location.state?.from
  const requestedPath = returnLocation
    ? `${returnLocation.pathname}${returnLocation.search}${returnLocation.hash}`
    : '/admin/dashboard'
  const returnPath = requestedPath.startsWith('/admin') ? requestedPath : '/admin/dashboard'
  return <Navigate to={returnPath} replace />
}

class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { if (import.meta.env.DEV) console.error(error) }
  render() {
    return this.state.failed
      ? <StatusPage code="500" title="Something went wrong" message="EduMaster could not display this page. Your data is safe; reload and try again." primaryLabel="Reload page" onPrimary={() => window.location.reload()} />
      : this.props.children
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoManager />
      <AppErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <AvatarProvider>
                  <LogoutConfirmProvider>
                    <MotionProvider>
                      <Suspense fallback={<RouteFallback />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/courses" element={<CoursesPage />} />
                          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
                          <Route path="/events" element={<EventsPage />} />
                          <Route path="/services" element={<ServicesPage />} />
                          <Route path="/programs" element={<Navigate to="/events" replace />} />
                          <Route path="/testimonials" element={<Testimonials />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignupPage />} />
                          <Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
                          <Route path="/profile/courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
                          <Route path="/profile/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
                          <Route path="/profile/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                          <Route path="/profile/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                          <Route path="/profile/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
                          <Route path="/profile/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                          <Route path="/profile/payments" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
                          <Route path="/profile/*" element={<ProtectedRoute><StatusPage code="404" title="Dashboard page not found" message="That student dashboard section does not exist." primaryLabel="Back to dashboard" primaryTo="/profile" /></ProtectedRoute>} />
                          <Route path="/admin/login" element={<AdminLoginRoute><AdminLoginPage /></AdminLoginRoute>} />
                          <Route path="/admin" element={(
                            <AdminRoute fallback={<RouteFallback />}>
                              <AdminLayout />
                            </AdminRoute>
                          )}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboardPage />} />
                            <Route path="courses" element={<AdminCoursesPage />} />
                            <Route path="courses/new" element={<AdminCourseFormPage mode="create" />} />
                            <Route path="courses/:courseId/curriculum" element={<AdminCurriculumPage />} />
                            <Route path="courses/:id/edit" element={<AdminCourseFormPage mode="edit" />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="users/:id" element={<AdminUserDetailsPage />} />
                            <Route path="orders" element={<AdminOrdersPage />} />
                            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                            <Route path="enrollments" element={<AdminEnrollmentsPage />} />
                            <Route path="enrollments/:id" element={<AdminEnrollmentDetailsPage />} />
                            <Route path="quizzes" element={<AdminQuizzesPage />} />
                            <Route path="quizzes/new" element={<AdminQuizFormPage mode="create" />} />
                            <Route path="quizzes/:id/edit" element={<AdminQuizFormPage mode="edit" />} />
                            <Route path="quizzes/:id" element={<AdminQuizDetailsPage />} />
                            <Route path="assignments" element={<AdminAssignmentsPage />} />
                            <Route path="assignments/new" element={<AdminAssignmentFormPage mode="create" />} />
                            <Route path="assignments/:id/edit" element={<AdminAssignmentFormPage mode="edit" />} />
                            <Route path="assignments/:id/submissions" element={<AdminAssignmentSubmissionsPage />} />
                            <Route path="assignments/:id/submissions/:submissionId" element={<AdminAssignmentSubmissionDetailsPage />} />
                            <Route path="assignments/:id" element={<AdminAssignmentDetailsPage />} />
                            <Route path="certificates" element={<AdminCertificatesPage />} />
                            <Route path="certificates/:id" element={<AdminCertificateDetailsPage />} />
                            <Route path="discussions" element={<AdminDiscussionsPage />} />
                            <Route path="discussions/:id" element={<AdminDiscussionDetailsPage />} />
                            <Route path="notifications" element={<AdminNotificationsPage />} />
                            <Route path="notifications/new" element={<AdminNotificationFormPage />} />
                            <Route path="notifications/:id" element={<AdminNotificationDetailsPage />} />
                            <Route path="reports" element={<AdminReportsPage />} />
                            <Route path="settings" element={<AdminSettingsPage />} />
                            <Route path="profile" element={<AdminProfilePage />} />
                            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                          </Route>
                          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                          <Route path="/learn/:courseId" element={<ProtectedRoute><CourseLearningPage /></ProtectedRoute>} />
                          <Route path="/certificate/verify/:code" element={<CertificateVerifyPage />} />
                          <Route path="/quiz/:lessonId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                          <Route path="/offline" element={<StatusPage code="Offline" title="You're offline" message="Reconnect to the internet, then try the page again." primaryLabel="Try again" onPrimary={() => window.location.reload()} />} />
                          <Route path="/unauthorized" element={<StatusPage code="401" title="Sign in required" message="Please sign in to access this page." primaryLabel="Sign in" primaryTo="/login" />} />
                          <Route path="/forbidden" element={<StatusPage code="403" title="Access denied" message="Your account does not have permission to view this page." primaryLabel="Go to dashboard" primaryTo="/profile" />} />
                          <Route path="/server-error" element={<StatusPage code="500" title="Server unavailable" message="We could not complete your request. Please try again shortly." primaryLabel="Try again" onPrimary={() => window.location.reload()} />} />
                          <Route path="*" element={<StatusPage code="404" title="Page not found" message="The page you requested does not exist or has moved." primaryLabel="Back to home" primaryTo="/" />} />
                        </Routes>
                      </Suspense>
                    </MotionProvider>
                  </LogoutConfirmProvider>
                </AvatarProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </NotificationProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  )
}
