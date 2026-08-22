import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getSession, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../../api/auth.js'
import { AUTH_SESSION_MISMATCH_EVENT } from '../../api/client.js'

const AuthContext = createContext(null)
const SESSION_HINT_KEY = 'edumaster:session-active'
const AUTH_SYNC_KEY = 'edumaster:auth-sync'

const getUserFromResponse = (response) => response?.data?.user ?? response?.user ?? null

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSessionHint, setHasSessionHint] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_HINT_KEY) === 'true'
    } catch {
      return false
    }
  })
  const authRequestId = useRef(0)
  const isMounted = useRef(false)

  const canCommitAuthState = useCallback((requestId) => (
    isMounted.current && authRequestId.current === requestId
  ), [])

  const setSessionHint = useCallback((active) => {
    setHasSessionHint(active)
    try {
      if (active) sessionStorage.setItem(SESSION_HINT_KEY, 'true')
      else sessionStorage.removeItem(SESSION_HINT_KEY)
    } catch {
      // Private browsing can deny storage; authentication still works.
    }
  }, [])

  const notifyOtherTabs = useCallback(() => {
    try {
      localStorage.setItem(AUTH_SYNC_KEY, `${Date.now()}:${Math.random().toString(36).slice(2)}`)
    } catch {
      // API permission failures and focus reconciliation remain available when
      // cross-tab storage is unavailable.
    }
  }, [])

  const loadCurrentUser = useCallback(async () => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    let currentUser = null

    try {
      const response = await getCurrentUser()
      currentUser = getUserFromResponse(response)
    } catch (error) {
      if (canCommitAuthState(requestId)) {
        setUser(null)
        setSessionHint(false)
      }
      throw error
    } finally {
      if (canCommitAuthState(requestId)) setIsLoading(false)
    }

    if (canCommitAuthState(requestId)) {
      setUser(currentUser)
      setSessionHint(Boolean(currentUser))
    }
    return currentUser
  }, [canCommitAuthState, setSessionHint])

  useEffect(() => {
    isMounted.current = true
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    const restoreSession = async () => {
      try {
        const response = await getSession()
        if (canCommitAuthState(requestId)) {
          const currentUser = getUserFromResponse(response)
          setUser(currentUser)
          setSessionHint(Boolean(currentUser))
        }
      } catch {
        if (canCommitAuthState(requestId)) {
          setUser(null)
          setSessionHint(false)
        }
      } finally {
        if (canCommitAuthState(requestId)) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      isMounted.current = false
    }
  }, [canCommitAuthState, setSessionHint])

  useEffect(() => {
    const reconcileSession = () => {
      loadCurrentUser().catch(() => {})
    }
    const onStorage = (event) => {
      if (event.key === AUTH_SYNC_KEY) reconcileSession()
    }
    const onFocus = () => {
      if (hasSessionHint) reconcileSession()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    window.addEventListener(AUTH_SESSION_MISMATCH_EVENT, reconcileSession)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener(AUTH_SESSION_MISMATCH_EVENT, reconcileSession)
    }
  }, [hasSessionHint, loadCurrentUser])

  const login = useCallback(async (credentials) => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    try {
      await loginRequest(credentials)
    } catch (error) {
      if (canCommitAuthState(requestId)) setIsLoading(false)
      throw error
    }

    if (!canCommitAuthState(requestId)) return null
    const currentUser = await loadCurrentUser()
    setSessionHint(Boolean(currentUser))
    notifyOtherTabs()
    return currentUser
  }, [canCommitAuthState, loadCurrentUser, notifyOtherTabs, setSessionHint])

  const signup = useCallback(async (details) => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    try {
      const response = await registerRequest(details)
      const currentUser = getUserFromResponse(response)
      if (canCommitAuthState(requestId)) {
        setUser(currentUser)
        setSessionHint(Boolean(currentUser))
        setIsLoading(false)
      }
      notifyOtherTabs()
      return currentUser
    } catch (error) {
      if (canCommitAuthState(requestId)) setIsLoading(false)
      throw error
    }
  }, [canCommitAuthState, notifyOtherTabs, setSessionHint])

  const logout = useCallback(async (options = {}) => {
    const redirectTo = typeof options?.redirectTo === 'string' ? options.redirectTo : '/login'
    authRequestId.current += 1
    try {
      await logoutRequest()
    } finally {
      authRequestId.current += 1
      if (isMounted.current) {
        setUser(null)
        setSessionHint(false)
        navigate(redirectTo, { replace: true })
      }
      notifyOtherTabs()
    }
  }, [navigate, notifyOtherTabs, setSessionHint])

  // Lets authenticated features update the canonical user record immediately
  // after a successful API mutation (for example, an avatar upload).
  const updateUser = useCallback((nextUser) => {
    if (!isMounted.current) return
    setUser((currentUser) => ({ ...currentUser, ...nextUser }))
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    hasSessionHint,
    login,
    signup,
    logout,
    refreshUser: loadCurrentUser,
    updateUser,
  }), [hasSessionHint, isLoading, loadCurrentUser, login, logout, signup, updateUser, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
