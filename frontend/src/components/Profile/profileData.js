// Placeholder profile-page data (mirrors the design reference).
// Swap for API data when the profile endpoints are ready.

export const PROFILE_DEFAULTS = {
  location: 'New Delhi, India',
  bio: 'Passionate learner with a keen interest in web development, data science and emerging technologies. Always eager to learn and grow.',
}

export const PROFILE_STATS = [
  { id: 'courses', label: 'Enrolled Courses', tint: 'blue', valueKey: 'enrolledCourses' },
  { id: 'certificates', label: 'Certificates', tint: 'green', valueKey: 'certificates' },
  { id: 'hours', label: 'Hours Learned', tint: 'purple', valueKey: 'hoursLearned' },
]

export const PROFILE_COURSES = [
  {
    id: 'fullstack',
    title: 'Full Stack Web Development Bootcamp',
    status: 'In Progress',
    tint: 'blue',
    imageType: 'development',
    cta: 'Continue Learning',
  },
  {
    id: 'python',
    title: 'Python for Data Science',
    status: 'In Progress',
    tint: 'green',
    imageType: 'datascience',
    cta: 'Continue Learning',
  },
  {
    id: 'uiux',
    title: 'UI/UX Design Masterclass for Beginners',
    status: 'Not Started',
    tint: 'purple',
    imageType: 'design',
    cta: 'Start Learning',
  },
]

export const PROFILE_ACHIEVEMENTS = [
  { id: 'webdev', title: 'Web Development Certificate', date: '15 Jan 2024', tint: 'blue' },
  { id: 'datascience', title: 'Data Science Certificate', date: '22 Feb 2024', tint: 'green' },
  { id: 'design', title: 'UI/UX Design Certificate', date: '10 Mar 2024', tint: 'purple' },
]

export const PROFILE_ACTIVITY = [
  { id: 'started', type: 'play', text: 'You started "Python for Data Science"', time: '2 hours ago' },
  { id: 'earned', type: 'certificate', text: 'You earned a certificate in Web Development', time: '1 day ago' },
  { id: 'reviewed', type: 'star', text: 'You reviewed "Full Stack Web Development Bootcamp"', time: '3 days ago' },
]

export const PROFILE_COMPLETION = [
  { id: 'picture', label: 'Add Profile Picture', done: true },
  { id: 'bio', label: 'Add Bio', done: true },
  { id: 'location', label: 'Add Location', done: true },
  { id: 'education', label: 'Add Education', done: false },
  { id: 'social', label: 'Add Social Links', done: false },
]
