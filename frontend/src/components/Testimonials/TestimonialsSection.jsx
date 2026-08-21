import { useEffect, useMemo, useState } from 'react'
import './TestimonialsSection.css'
import TestimonialCard from './TestimonialCard.jsx'
import { getTestimonials } from '../../api/testimonial.js'
import { motion, useReducedMotion } from '../Home/motion.jsx'

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
const TESTIMONIALS_LIMIT = 12

// Backend avatars aren't local SVG variants; cycle variants so faces look distinct
const AVATAR_VARIANTS = ['m1', 'f1', 'm2', 'f2', 'm3', 'f3', 'm4']

const toCard = (t, index) => ({
  ...t,
  name: t.studentName ?? t.name,
  avatar: AVATAR_VARIANTS.includes(t.avatar) ? t.avatar : AVATAR_VARIANTS[index % AVATAR_VARIANTS.length],
})

export default function TestimonialsSection() {
  const perPage = usePerPage()
  const [page, setPage] = useState(0)
  const reducedMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'error' | 'success'

  useEffect(() => {
    let ignore = false

    getTestimonials({ limit: TESTIMONIALS_LIMIT })
      .then((response) => {
        if (ignore) return
        const data = response?.data ?? {}
        setTestimonials(Array.isArray(data.testimonials) ? data.testimonials.map(toCard) : [])
        setStatus('success')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  const pages = useMemo(() => {
    const chunks = []
    for (let i = 0; i < testimonials.length; i += perPage) {
      chunks.push(testimonials.slice(i, i + perPage))
    }
    return chunks
  }, [testimonials, perPage])

  useEffect(() => {
    setPage((p) => Math.max(0, Math.min(p, pages.length - 1)))
  }, [pages.length])

  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length)
  const next = () => setPage((p) => (p + 1) % pages.length)

  return (
    <section className="tsection">
      <div className="container">
        <motion.div className="tsection-head" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.55 }}>
          <span className="tsection-badge">Testimonials</span>
          <h2 className="tsection-title">What Our Students Have to Say</h2>
          <p className="tsection-sub">
            Real stories from real learners who transformed their careers with EduMaster.
          </p>
        </motion.div>

        {status === 'loading' && (
          <p className="tsection-sub" role="status">
            Loading testimonials…
          </p>
        )}

        {status === 'error' && (
          <p className="tsection-sub" role="alert">
            Unable to load testimonials right now. Please try again later.
          </p>
        )}

        {status === 'success' && testimonials.length === 0 && (
          <p className="tsection-sub">No testimonials yet. Check back soon!</p>
        )}

        {status === 'success' && pages.length > 0 && (
          <>
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
                      {group.map((t, j) => (
                        <TestimonialCard testimonial={t} index={j} key={t._id ?? t.id} />
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
          </>
        )}
      </div>
    </section>
  )
}
