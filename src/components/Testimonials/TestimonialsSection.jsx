import { useEffect, useMemo, useState } from 'react'
import './TestimonialsSection.css'
import TestimonialCard from './TestimonialCard.jsx'
import { testimonials } from '../../data/testimonialsData.js'

function ArrowNav({ dir }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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

function usePerPage() {
  const query = (q) => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false)
  const compute = () =>
    query('(max-width: 576px)') ? 1 : query('(max-width: 900px)') ? 2 : query('(max-width: 1024px)') ? 3 : 4
  const [perPage, setPerPage] = useState(compute)

  useEffect(() => {
    const onResize = () => setPerPage(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return perPage
}

const DOT_COUNT = 3

export default function TestimonialsSection() {
  const perPage = usePerPage()
  const [page, setPage] = useState(0)

  const pages = useMemo(() => {
    const chunks = []
    for (let i = 0; i < testimonials.length; i += perPage) {
      chunks.push(testimonials.slice(i, i + perPage))
    }
    return chunks
  }, [perPage])

  useEffect(() => {
    setPage((p) => Math.min(p, pages.length - 1))
  }, [pages.length])

  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length)
  const next = () => setPage((p) => (p + 1) % pages.length)

  return (
    <section className="tsection">
      <div className="container">
        <div className="tsection-head">
          <span className="tsection-badge">Testimonials</span>
          <h2 className="tsection-title">What Our Students Have to Say</h2>
          <p className="tsection-sub">
            Real stories from real learners who transformed their careers with EduMaster.
          </p>
        </div>

        <div className="tsection-slider">
          <button className="tsection-arrow tsection-arrow-left" onClick={prev} aria-label="Previous testimonials">
            <ArrowNav dir="left" />
          </button>

          <div className="tsection-viewport">
            <div
              className="tsection-track"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {pages.map((group, i) => (
                <div className="tsection-page" key={i} aria-hidden={i !== page}>
                  {group.map((t) => (
                    <TestimonialCard testimonial={t} key={t.id} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className="tsection-arrow tsection-arrow-right" onClick={next} aria-label="Next testimonials">
            <ArrowNav dir="right" />
          </button>
        </div>

        {/* 3 cycling dots: the active dot is page % 3, so after the third dot the
            carousel keeps advancing to new cards instead of restarting */}
        <div className="tsection-dots">
          {Array.from({ length: Math.min(DOT_COUNT, pages.length) }, (_, i) => (
            <button
              className={`tsection-dot${page % DOT_COUNT === i ? ' active' : ''}`}
              key={i}
              onClick={() =>
                setPage(
                  Math.min(
                    Math.floor(page / DOT_COUNT) * DOT_COUNT + i,
                    pages.length - 1,
                  ),
                )
              }
              aria-label={`Go to testimonials page ${i + 1} of current group`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
