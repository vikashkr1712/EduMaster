// Data for the authentication pages — left panel feature lists,
// shared statistics row and signup password requirements.

export const loginFeatures = [
  {
    id: 'continue',
    tint: 'blue',
    icon: 'book',
    title: 'Continue Learning',
    text: 'Access your courses, progress and learning materials.',
  },
  {
    id: 'progress',
    tint: 'green',
    icon: 'chart',
    title: 'Track Progress',
    text: 'Monitor your achievements and skills development.',
  },
  {
    id: 'certified',
    tint: 'orange',
    icon: 'medal',
    title: 'Get Certified',
    text: 'Earn certificates and boost your career opportunities.',
  },
]

export const signupFeatures = [
  {
    id: 'experts',
    tint: 'blue',
    icon: 'book',
    title: 'Learn from Experts',
    text: 'Access industry-expert courses and gain in-demand skills.',
  },
  {
    id: 'progress',
    tint: 'green',
    icon: 'chart',
    title: 'Track Your Progress',
    text: 'Monitor your learning journey and achieve your goals.',
  },
  {
    id: 'certified',
    tint: 'purple',
    icon: 'trophy',
    title: 'Get Certified',
    text: 'Earn recognized certificates and boost your career.',
  },
  {
    id: 'community',
    tint: 'orange',
    icon: 'people',
    title: 'Join a Global Community',
    text: 'Connect with learners worldwide and grow together.',
  },
]

export const authStats = [
  {
    id: 'students',
    tint: 'blue',
    icon: 'students',
    value: '50,000+',
    label: 'Active Students',
  },
  {
    id: 'courses',
    tint: 'green',
    icon: 'book',
    value: '1,200+',
    label: 'Expert Courses',
  },
  {
    id: 'instructors',
    tint: 'orange',
    icon: 'instructor',
    value: '300+',
    label: 'Expert Instructors',
  },
  {
    id: 'certificates',
    tint: 'purple',
    icon: 'trophy',
    value: '25,000+',
    label: 'Certificates Issued',
  },
]

export const passwordRules = [
  { id: 'length', label: 'At least 8 characters long' },
  { id: 'case', label: 'Includes uppercase & lowercase' },
  { id: 'number', label: 'Includes a number' },
  { id: 'special', label: 'Includes a special character' },
]
