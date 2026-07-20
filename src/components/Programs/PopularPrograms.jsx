import './PopularPrograms.css'
import ProgramCard from './ProgramCard.jsx'
import { popularPrograms } from '../../data/programsData.js'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16m0 0l-6-6m6 6l-6 6"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PopularPrograms() {
  return (
    <section className="popular-programs">
      <div className="container">
        <div className="popular-programs-head">
          <span className="popular-programs-badge">POPULAR PROGRAMS</span>
          <h2 className="popular-programs-title">
            Explore Our Most <span>Popular</span> Programs
          </h2>
          <p className="popular-programs-sub">
            Industry-aligned programs to help you upskill and advance your career
          </p>
        </div>

        <div className="popular-programs-grid">
          {popularPrograms.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>

        <div className="popular-programs-cta">
          <button className="popular-programs-viewall">
            View All Programs
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
