const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 10_000

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function getErrorMessage(status, data) {
  if (status === 401) return 'Your session has expired. Please sign in and try again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested service could not be found.'
  if (status >= 500) return 'The server is unavailable. Please try again shortly.'

  return data?.errors?.[0]?.message || data?.message || 'Unable to complete the request. Please try again.'
}

// Deduplicated silent token refresh: on a 401 from a non-auth endpoint we try
// POST /auth/refresh once (existing backend endpoint), then retry the request.
let refreshPromise = null

function refreshTokens() {
  refreshPromise ??= fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

export async function client(path, { method = 'GET', body, headers, _isRetry = false, ...options } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('The API is not configured. Set VITE_API_URL and try again.', {
      code: 'CONFIGURATION',
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...options,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Please try again.', { code: 'TIMEOUT' })
    }

    throw new ApiError('Unable to connect to the server. Please try again.', { code: 'NETWORK' })
  } finally {
    clearTimeout(timeout)
  }

  // Expired access token: refresh once and retry (never for auth endpoints,
  // so a failed login/refresh can't loop).
  if (response.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      return client(path, { method, body, headers, _isRetry: true, ...options })
    }
  }

  const hasJsonResponse = response.headers.get('content-type')?.includes('application/json')
  const data = hasJsonResponse ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status, data), { status: response.status, code: 'HTTP' })
  }

  return data
}
