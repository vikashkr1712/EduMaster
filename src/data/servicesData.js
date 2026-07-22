// Data for the Services page — service cards, why-choose features,
// popular courses row, process steps, pricing, stats and FAQs.

export const serviceCards = [
  {
    id: 'live',
    tint: 'blue',
    icon: 'live',
    title: 'Live Online Classes',
    text: 'Interactive live sessions with expert instructors from industry.',
  },
  {
    id: 'career',
    tint: 'green',
    icon: 'career',
    title: 'Career Guidance',
    text: 'Personalized guidance to help you choose the right career path.',
  },
  {
    id: 'placement',
    tint: 'orange',
    icon: 'placement',
    title: 'Placement Assistance',
    text: 'End-to-end placement support to kickstart your dream career.',
  },
  {
    id: 'certification',
    tint: 'purple',
    icon: 'certification',
    title: 'Certification Programs',
    text: 'Industry-recognized certifications to validate your skills.',
  },
  {
    id: 'corporate',
    tint: 'orange',
    icon: 'corporate',
    title: 'Corporate Training',
    text: 'Customized training solutions for teams and organizations.',
  },
  {
    id: 'resources',
    tint: 'blue',
    icon: 'resources',
    title: 'Learning Resources',
    text: 'Access high-quality resources anytime to boost your learning.',
  },
]

export const whyChooseFeatures = [
  {
    id: 'mentors',
    tint: 'blue',
    icon: 'mentor',
    title: 'Expert Mentors',
    text: 'Learn from industry experts with real-world experience.',
  },
  {
    id: 'projects',
    tint: 'green',
    icon: 'projects',
    title: 'Industry Projects',
    text: 'Work on real-world projects and build your portfolio.',
  },
  {
    id: 'skills',
    tint: 'purple',
    icon: 'skills',
    title: 'Job Ready Skills',
    text: 'Gain in-demand skills and become job ready.',
  },
  {
    id: 'flexible',
    tint: 'orange',
    icon: 'flexible',
    title: 'Flexible Learning',
    text: 'Learn anytime, anywhere with our flexible programs.',
  },
  {
    id: 'support',
    tint: 'blue',
    icon: 'support',
    title: 'Lifetime Support',
    text: 'Get lifetime support from mentors and career experts.',
  },
  {
    id: 'certificates',
    tint: 'green',
    icon: 'certificates',
    title: 'Verified Certificates',
    text: 'Earn verified certificates to showcase your achievements.',
  },
]

// Shaped for the shared CourseCard component.
export const popularServiceCourses = [
  {
    id: 'sc1',
    imageType: 'development',
    category: 'Development',
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'Rahul Sharma',
    rating: 4.8,
    students: '12,500+',
    priceType: 'Paid',
    price: 3999,
    oldPrice: 7999,
  },
  {
    id: 'sc2',
    imageType: 'python',
    category: 'Data Science',
    title: 'Data Science & Machine Learning with Python',
    instructor: 'Priya Verma',
    rating: 4.7,
    students: '8,750+',
    priceType: 'Paid',
    price: 4499,
    oldPrice: 8999,
  },
  {
    id: 'sc3',
    imageType: 'js',
    category: 'Development',
    title: 'JavaScript Mastery for Beginners',
    instructor: 'Aman Gupta',
    rating: 4.6,
    students: '9,200+',
    priceType: 'Paid',
    price: 2499,
    oldPrice: 4999,
  },
  {
    id: 'sc4',
    imageType: 'design',
    category: 'Design',
    title: 'UI/UX Design Masterclass for Beginners',
    instructor: 'Sneha Patel',
    rating: 4.9,
    students: '6,300+',
    priceType: 'Paid',
    price: 3499,
    oldPrice: 6999,
  },
  {
    id: 'sc5',
    imageType: 'cloud',
    category: 'IT & Software',
    title: 'Cloud Computing Fundamentals',
    instructor: 'Vikram Singh',
    rating: 4.8,
    students: '4,100+',
    priceType: 'Paid',
    price: 2999,
    oldPrice: 5999,
  },
]

export const processSteps = [
  {
    id: 1,
    step: 'Step 01',
    tint: 'blue',
    icon: 'enroll',
    title: 'Enroll',
    text: 'Choose your program and start in few easy steps.',
  },
  {
    id: 2,
    step: 'Step 02',
    tint: 'green',
    icon: 'learn',
    title: 'Learn',
    text: 'Attend live classes and learn from industry experts.',
  },
  {
    id: 3,
    step: 'Step 03',
    tint: 'purple',
    icon: 'practice',
    title: 'Practice',
    text: 'Work on projects and assignments to build your skills.',
  },
  {
    id: 4,
    step: 'Step 04',
    tint: 'orange',
    icon: 'certified',
    title: 'Get Certified',
    text: 'Complete the program and earn industry-recognized certificate.',
  },
  {
    id: 5,
    step: 'Step 05',
    tint: 'green',
    icon: 'careerstep',
    title: 'Career Support',
    text: 'Get placement support and grow your career.',
  },
]

export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for Beginners',
    price: '₹2,999',
    period: '/course',
    highlighted: false,
    features: ['Live Classes', 'Study Materials', 'Assignments', 'Certificate of Completion'],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For serious learners',
    price: '₹6,999',
    period: '/course',
    highlighted: true,
    ribbon: 'Most Popular',
    features: ['Everything in Starter', 'Live Projects', 'Mentor Support', 'Placement Assistance'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For teams & organizations',
    price: '₹14,999',
    period: '/course',
    highlighted: false,
    features: [
      'Everything in Professional',
      'Custom Training',
      'Dedicated Support',
      'Performance Reports',
    ],
  },
]

export const servicesStats = [
  { key: 'students', tint: 'blue', icon: 'students', value: '50,000+', label: 'Students' },
  { key: 'courses', tint: 'green', icon: 'courses', value: '1,200+', label: 'Courses' },
  { key: 'experts', tint: 'orange', icon: 'experts', value: '300+', label: 'Experts' },
  { key: 'certs', tint: 'purple', icon: 'certs', value: '25,000+', label: 'Certificates' },
  { key: 'partners', tint: 'pink', icon: 'partners', value: '100+', label: 'Partners' },
]

export const servicesFaqs = [
  {
    id: 1,
    q: 'How do online classes work?',
    a: 'You attend live interactive sessions with expert instructors through our platform. Every class is also recorded, so you can revisit lessons anytime at your own pace.',
  },
  {
    id: 2,
    q: 'What kind of placement support do you provide?',
    a: 'We provide end-to-end placement assistance including portfolio building, interview preparation and direct referrals to our 100+ hiring partners.',
  },
  {
    id: 3,
    q: 'Will I receive a certificate after completion?',
    a: 'Yes. After successfully completing your course or program, you receive an industry-recognized certificate that you can share on your resume and LinkedIn profile.',
  },
  {
    id: 4,
    q: 'Do you offer corporate training for teams?',
    a: 'Yes. We design customized training solutions for teams and organizations with dedicated support, progress tracking and performance reports.',
  },
  {
    id: 5,
    q: 'How does career guidance work?',
    a: 'Our career experts help you identify the right path through one-on-one counselling sessions, resume reviews, mock interviews and personalized learning roadmaps.',
  },
  {
    id: 6,
    q: 'Can I access the courses on mobile devices?',
    a: 'Absolutely. Our platform works seamlessly on desktop, tablet and mobile, so you can learn anytime, anywhere.',
  },
]
