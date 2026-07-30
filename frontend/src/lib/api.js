const API_BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/v1`

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // non-JSON response (e.g. network proxy error page)
  }

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.message || data?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}
