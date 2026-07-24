import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export { motion, useReducedMotion }

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

export const stagger = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
})

export function Reveal({ children, className, delay = 0, amount = 0.2 }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const reducedMotion = useReducedMotion()
  const match = value.match(/[\d,]+/)
  const initial = match ? `${value.slice(0, match.index)}0${value.slice((match.index ?? 0) + match[0].length)}` : value
  const [display, setDisplay] = useState(initial)

  useEffect(() => {
    if (!isInView || reducedMotion || !match) {
      if (reducedMotion) setDisplay(value)
      return
    }
    const target = Number(match[0].replaceAll(',', ''))
    const prefix = value.slice(0, match.index)
    const suffix = value.slice((match.index ?? 0) + match[0].length)
    const start = performance.now()
    const duration = 900
    let frame

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(`${prefix}${Math.round(target * eased).toLocaleString('en-IN')}${suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, reducedMotion, value])

  return <span ref={ref}>{display}</span>
}

export function MagneticButton({ children, className }) {
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.25 })
  const [ripple, setRipple] = useState(null)

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      className={className}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={(event) => {
        if (reducedMotion) return
        const bounds = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12)
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12)
      }}
      onMouseLeave={reset}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        setRipple({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, key: Date.now() })
      }}
    >
      {children}
      {ripple && <span className="home-button-ripple" key={ripple.key} style={{ left: ripple.x, top: ripple.y }} />}
    </motion.button>
  )
}
