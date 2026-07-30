import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '../../api/auth.js'

const AuthContext = createContext(null)

const getUserFromResponse = (response) => response?.data?.user ?? response?.user ?? null

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const authRequestId = useRef(0)
  const isMounted = useRef(false)

  const canCommitAuthState = useCallback((requestId) => (
    isMounted.current && authRequestId.current === requestId
  ), [])

  const loadCurrentUser = useCallback(async () => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    let currentUser = null

    try {
      const response = await getCurrentUser()
      currentUser = getUserFromResponse(response)
    } catch (error) {
      if (canCommitAuthState(requestId)) setUser(null)
      throw error
    } finally {
      if (canCommitAuthState(requestId)) setIsLoading(false)
    }

    if (canCommitAuthState(requestId)) setUser(currentUser)
    return currentUser
  }, [canCommitAuthState])

  useEffect(() => {
    isMounted.current = true
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId

    const restoreSession = async () => {
      try {
        const response = await getCurrentUser()
        if (canCommitAuthState(requestId)) {
          setUser(getUserFromResponse(response))
        }
      } catch {
        if (canCommitAuthState(requestId)) setUser(null)
      } finally {
        if (canCommitAuthState(requestId)) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      isMounted.current = false
    }
  }, [canCommitAuthState])

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
    return loadCurrentUser()
  }, [canCommitAuthState, loadCurrentUser])

  const logout = useCallback(async () => {
    authRequestId.current += 1
    try {
      await logoutRequest()
    } finally {
      authRequestId.current += 1
      if (isMounted.current) {
        setUser(null)
        navigate('/login', { replace: true })
      }
    }
  }, [navigate])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    refreshUser: loadCurrentUser,
  }), [isLoading, loadCurrentUser, login, logout, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
