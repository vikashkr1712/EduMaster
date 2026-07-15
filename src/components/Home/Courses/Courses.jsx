import './Courses.css'
import CourseIllustration1 from '../../../svg/CourseIllustration1.jsx'
import CourseIllustration2 from '../../../svg/CourseIllustration2.jsx'
import CourseIllustration3 from '../../../svg/CourseIllustration3.jsx'
import Avatar from '../../../svg/Avatar.jsx'

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.5c-6-4-9-7.5-9-11A5 5 0 0 1 12 6.6 5 5 0 0 1 21 9.5c0 3.5-3 7-9 11z"
        stroke="#94A3B8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarFilled() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M3.5 19c.5-3 2.7-4.8 5.5-4.8s5 1.8 5.5 4.8" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="9" r="2.6" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M17 14.4c2.2.4 3.6 2 4 4.6" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ArrowNav({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="#1B2B4B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const courses = [
  {
    illustration: <CourseIllustration1 />,
    category: 'Development',
    categoryClass: 'cat-dev',
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'John Doe',
    avatar: 'm1',
    rating: '4.8',
    reviews: '(2.4K)',
    students: '12,500+ Students',
    price: '₹4,999',
    oldPrice: '₹9,999',
  },
  {
    illustration: <CourseIllustration2 />,
    category: 'Data Science',
    categoryClass: 'cat-data',
    title: 'Data Science & Machine Learning with Python',
    instructor: 'Jane Smith',
    avatar: 'f1',
    rating: '4.7',
    reviews: '(1.8K)',
    students: '8,750+ Students',
    price: '₹3,999',
    oldPrice: '₹7,999',
  },
  {
    illustration: <CourseIllustration3 />,
    category: 'Design',
    categoryClass: 'cat-design',
    title: 'UI/UX Design Masterclass for Beginners',
    instructor: 'Mike Johnson',
    avatar: 'm2',
    rating: '4.9',
    reviews: '(1.2K)',
    students: '6,300+ Students',
    price: '₹2,999',
    oldPrice: '₹5,999',
  },
]

export default function Courses() {
  return (
    <section className="courses">
      <div className="container">
        <div className="courses-head">
          <span className="section-badge">Popular Courses</span>
          <h2 className="section-title courses-title">
            Explore Our Most <span className="hl-highlight">Popular</span> Courses
          </h2>
          <p className="section-sub">
            Learn in-demand skills from industry experts and advance your career
          </p>
        </div>

        <div className="courses-slider">
          <button className="courses-arrow courses-arrow-left" aria-label="Previous courses">
            <ArrowNav dir="left" />
          </button>

          <div className="courses-grid">
            {courses.map((c) => (
              <article className="course-card" key={c.title}>
                <div className="course-media">{c.illustration}</div>
                <div className="course-body">
                  <div className="course-topline">
                    <span className={`course-cat ${c.categoryClass}`}>{c.category}</span>
                    <button className="course-wishlist" aria-label="Add to wishlist">
                      <HeartIcon />
                    </button>
                  </div>
                  <h3 className="course-title">{c.title}</h3>
                  <div className="course-instructor">
                    <Avatar variant={c.avatar} size={32} />
                    <span>{c.instructor}</span>
                  </div>
                  <div className="course-meta">
                    <span className="course-rating">
                      <StarFilled />
                      <b>{c.rating}</b>
                      <span className="course-reviews">{c.reviews}</span>
                    </span>
                    <span className="course-students">
                      <UsersIcon />
                      {c.students}
                    </span>
                  </div>
                  <div className="course-pricing">
                    <span className="course-price">{c.price}</span>
                    <span className="course-oldprice">{c.oldPrice}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button className="courses-arrow courses-arrow-right" aria-label="Next courses">
            <ArrowNav dir="right" />
          </button>
        </div>

        <div className="courses-viewall">
          <button className="btn-viewall">
            View All Courses
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
