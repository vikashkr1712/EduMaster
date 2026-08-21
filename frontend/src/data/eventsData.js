// Data for the Events page — popular events grid, features strip,
// how-it-works steps and the stats bar.

export const eventFeatures = [
  {
    key: 'industry',
    tint: 'var(--tint-blue)',
    title: 'Industry Focused',
    text: 'Events designed with input from top industry experts.',
  },
  {
    key: 'handson',
    tint: 'var(--tint-green)',
    title: 'Hands-on Learning',
    text: 'Work on real-world projects and practical assignments.',
  },
  {
    key: 'career',
    tint: 'var(--tint-orange)',
    title: 'Career Support',
    text: 'Get resume reviews, interview preparation and job support.',
  },
  {
    key: 'flexible',
    tint: 'var(--tint-purple)',
    title: 'Flexible Learning',
    text: 'Learn at your own pace with lifetime access to content.',
  },
]

export const popularEvents = [
  {
    id: 1,
    imageType: 'development',
    title: 'Full Stack Web Development Bootcamp',
    description:
      'Master front-end, back-end and database technologies to become a full stack developer.',
    duration: '6 Months',
    courses: '8 Sessions',
    rating: '4.8',
    reviews: '2.4K',
  },
  {
    id: 2,
    imageType: 'datascience',
    title: 'Data Science & Machine Learning Summit',
    description: 'Learn data analysis, machine learning and AI to solve real-world problems.',
    duration: '6 Months',
    courses: '10 Sessions',
    rating: '4.7',
    reviews: '1.8K',
  },
  {
    id: 3,
    imageType: 'design',
    title: 'UI/UX Design Masterclass',
    description: 'Design beautiful user experiences and interfaces with industry-standard tools.',
    duration: '4 Months',
    courses: '6 Sessions',
    rating: '4.9',
    reviews: '1.2K',
  },
  {
    id: 4,
    imageType: 'marketing',
    title: 'Digital Marketing Workshop',
    description: 'Learn SEO, social media, paid ads and content marketing to grow businesses.',
    duration: '3 Months',
    courses: '6 Sessions',
    rating: '4.8',
    reviews: '1.5K',
  },
  {
    id: 5,
    imageType: 'business',
    title: 'Business Analytics Workshop',
    description: 'Make data-driven business decisions and drive growth with analytics.',
    duration: '4 Months',
    courses: '7 Sessions',
    rating: '4.6',
    reviews: '900',
  },
  {
    id: 6,
    imageType: 'python',
    title: 'Python Programming Bootcamp',
    description: 'Learn Python from basics to advanced and build powerful applications.',
    duration: '3 Months',
    courses: '5 Sessions',
    rating: '4.7',
    reviews: '2.1K',
  },
]

export const howItWorksSteps = [
  {
    number: '01',
    tint: 'var(--tint-blue)',
    title: 'Choose an Event',
    text: 'Browse events and choose the one that fits your goals.',
  },
  {
    number: '02',
    tint: 'var(--tint-green)',
    title: 'Enroll & Get Access',
    text: 'Complete enrollment and get instant access to all materials.',
  },
  {
    number: '03',
    tint: 'var(--tint-orange)',
    title: 'Learn & Practice',
    text: 'Learn with expert guidance and work on real-world projects.',
  },
  {
    number: '04',
    tint: 'var(--tint-purple)',
    title: 'Get Certified',
    text: 'Complete the event and earn an industry-recognized certificate.',
  },
]

export const eventStats = [
  { key: 'students', tint: 'var(--tint-blue)', value: '50,000+', label: 'Active Students' },
  { key: 'courses', tint: 'var(--tint-green)', value: '1,200+', label: 'Expert Courses' },
  { key: 'instructors', tint: 'var(--tint-orange)', value: '300+', label: 'Expert Instructors' },
  { key: 'certs', tint: 'var(--tint-purple)', value: '25,000+', label: 'Certifications Issued' },
  { key: 'satisfaction', tint: 'var(--tint-pink)', value: '95%', label: 'Satisfaction Rate' },
]
