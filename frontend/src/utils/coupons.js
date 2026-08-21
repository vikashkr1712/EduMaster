export const COURSE_COUPONS = Object.freeze({
  WELCOME20: 20,
  EDU10: 10,
  FIRST50: 50,
})

export function calculateCoupon(subtotal, code) {
  const normalizedCode = String(code || '').trim().toUpperCase()
  const percent = COURSE_COUPONS[normalizedCode]
  if (!percent) return null
  return {
    code: normalizedCode,
    discount: Math.round((Number(subtotal) || 0) * percent / 100),
    percent,
  }
}
