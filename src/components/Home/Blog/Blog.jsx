import './Blog.css'
import blogFrontendSvg from '../../../svg/svg_latest_article_insights_left.svg'
import BlogIllustration2 from '../../../svg/BlogIllustration2.jsx'
import blogCloudSvg from '../../../svg/svg_latest_article_insights_why_cloud.svg'
import blogDataScienceSvg from '../../../svg/svg_latest_article_insights_right.svg'

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M3.5 9.5h17M8 3v3.6M16 3v3.6" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockSmallIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M12 8v4l2.8 1.6" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const posts = [
  {
    illustration: (
      <img src={blogFrontendSvg} alt="Frontend developer working on laptop" />
    ),
    category: 'Web Development',
    title: '10 Tips to Become a Better Frontend Developer',
    date: 'May 15, 2024',
    read: '5 min read',
  },
  {
    illustration: <BlogIllustration2 />,
    category: 'Programming',
    title: 'JavaScript Roadmap for Beginners in 2024',
    date: 'May 10, 2024',
    read: '6 min read',
  },
  {
    illustration: (
      <img src={blogCloudSvg} alt="Cloud computing with upload and database" />
    ),
    category: 'Career',
    title: 'Why Cloud Computing Skills Are in High Demand',
    date: 'May 5, 2024',
    read: '4 min read',
  },
  {
    illustration: (
      <img src={blogDataScienceSvg} alt="Data scientist analyzing charts" />
    ),
    category: 'Data Science',
    title: 'Top Data Science Tools You Should Learn in 2024',
    date: 'Apr 28, 2024',
    read: '6 min read',
  },
]

export default function Blog() {
  return (
    <section className="blog">
      <div className="container">
        <div className="blog-badge-row">
          <span className="section-badge">From Our Blog</span>
        </div>
        <div className="blog-head">
          <h2 className="section-title blog-title">
            Latest <span className="blog-underline">Articles</span> &amp; Insights
          </h2>
          <a href="#" className="blog-viewall">
            View All Articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="blog-grid">
          {posts.map((p) => (
            <article className="blog-card" key={p.title}>
              <div className="blog-media">{p.illustration}</div>
              <div className="blog-body">
                <span className="blog-cat">{p.category}</span>
                <h3 className="blog-card-title">{p.title}</h3>
                <div className="blog-meta">
                  <span>
                    <CalendarIcon />
                    {p.date}
                  </span>
                  <span className="blog-meta-sep">•</span>
                  <span>
                    <ClockSmallIcon />
                    {p.read}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
