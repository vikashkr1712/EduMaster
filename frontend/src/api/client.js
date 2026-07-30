const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1').replace(/\/$/, '')

export async function client(path, { method = 'GET', body, headers, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  })

  const hasJsonResponse = response.headers.get('content-type')?.includes('application/json')
  const data = hasJsonResponse ? await response.json() : null

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}
