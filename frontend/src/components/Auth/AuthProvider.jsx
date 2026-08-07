import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, login as loginRequest, logout as logoutRequest, refreshSession } from '../../api/auth.js'

const AuthContext = createContext(null)
const SESSION_HINT_KEY = 'edumaster:session-active'

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
        let response
        try {
          response = await getCurrentUser()
        } catch {
          // A valid refresh cookie can restore a session after the short-lived
          // access cookie has expired.
          await refreshSession()
          response = await getCurrentUser()
        }
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
    return currentUser
  }, [canCommitAuthState, loadCurrentUser, setSessionHint])

  const logout = useCallback(async () => {
    authRequestId.current += 1
    try {
      await logoutRequest()
    } finally {
      authRequestId.current += 1
      if (isMounted.current) {
        setUser(null)
        setSessionHint(false)
        navigate('/login', { replace: true })
      }
    }
  }, [navigate, setSessionHint])

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
    logout,
    refreshUser: loadCurrentUser,
    updateUser,
  }), [hasSessionHint, isLoading, loadCurrentUser, login, logout, updateUser, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
