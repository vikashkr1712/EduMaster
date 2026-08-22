const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 10_000
const MAX_GET_RETRIES = 2
const inflightGets = new Map()
export const AUTH_SESSION_MISMATCH_EVENT = 'edumaster:auth-session-mismatch'

const signalAuthSessionMismatch = (status, path) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_MISMATCH_EVENT, { detail: { status, path } }))
}
const getCookie = (name) => {
  const prefix = `${name}=`
  return document.cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix))?.slice(prefix.length) || ''
}
let csrfTokenCache = ''
async function getCsrfToken() {
  const cookieToken = getCookie('csrfToken')
  if (cookieToken) return decodeURIComponent(cookieToken)
  if (csrfTokenCache) return csrfTokenCache
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, { credentials: 'include' })
  if (!response.ok) return ''
  const data = await response.json()
  csrfTokenCache = data?.data?.csrfToken || ''
  return csrfTokenCache
}

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details || []
  }
}

function getErrorMessage(status, data) {
  const responseMessage = data?.errors?.[0]?.message || data?.message

  if (status === 401) return responseMessage || 'Your session has expired. Please sign in and try again.'
  if (status === 403) return responseMessage || 'You do not have permission to perform this action.'
  if (status === 404) return responseMessage || 'The requested service could not be found.'
  if (status >= 500) return 'The server is unavailable. Please try again shortly.'

  return responseMessage || 'Unable to complete the request. Please try again.'
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

async function request(path, { method = 'GET', body, headers, signal: externalSignal, _isRetry = false, _attempt = 0, ...options } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('The API is not configured. Set VITE_API_URL and try again.', {
      code: 'CONFIGURATION',
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const abortFromCaller = () => controller.abort()
  externalSignal?.addEventListener('abort', abortFromCaller, { once: true })

  let response
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(method)
  const csrfToken = unsafe && !['/auth/login', '/auth/register', '/auth/refresh'].includes(path) ? await getCsrfToken() : ''
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...headers,
      },
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
      ...options,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      if (externalSignal?.aborted) throw new ApiError('Request canceled.', { code: 'CANCELED' })
      throw new ApiError('The server took too long to respond. Please try again.', { code: 'TIMEOUT' })
    }

    if (method === 'GET' && _attempt < MAX_GET_RETRIES) {
      await new Promise((resolve) => window.setTimeout(resolve, 250 * (2 ** _attempt)))
      return request(path, { method, body, headers, signal: externalSignal, _isRetry, _attempt: _attempt + 1, ...options })
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) throw new ApiError('You are offline. Reconnect and try again.', { code: 'OFFLINE' })
    throw new ApiError('Unable to connect to the server. Please try again.', { code: 'NETWORK' })
  } finally {
    clearTimeout(timeout)
    externalSignal?.removeEventListener('abort', abortFromCaller)
  }

  // Expired access token: refresh once and retry (never for auth endpoints,
  // so a failed login/refresh can't loop).
  if (response.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      return request(path, { method, body, headers, signal: externalSignal, _isRetry: true, _attempt, ...options })
    }
  }

  const hasJsonResponse = response.headers.get('content-type')?.includes('application/json')
  const data = hasJsonResponse ? await response.json() : null

  if (!response.ok) {
    if ((response.status === 401 && !path.startsWith('/auth/')) || (response.status === 403 && path.startsWith('/admin/'))) {
      signalAuthSessionMismatch(response.status, path)
    }
    throw new ApiError(getErrorMessage(response.status, data), { status: response.status, code: 'HTTP', details: data?.errors })
  }

  return data
}

export function client(path, options = {}) {
  const method = options.method || 'GET'
  if (method !== 'GET') return request(path, options)
  const key = `${path}:${JSON.stringify(options.headers || {})}`
  if (inflightGets.has(key)) return inflightGets.get(key)
  const pending = request(path, options).finally(() => inflightGets.delete(key))
  inflightGets.set(key, pending)
  return pending
}
