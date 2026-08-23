import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getSession, googleLogin as googleLoginRequest, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../../api/auth.js'
import { AUTH_SESSION_MISMATCH_EVENT } from '../../api/client.js'

const AuthContext = createContext(null)
const SESSION_HINT_KEY = 'edumaster:session-active'
const AUTH_SYNC_KEY = 'edumaster:auth-sync'

const getUserFromResponse = (response) => response?.data?.user ?? response?.user ?? null
let firebaseClientPromise

const getFirebaseClient = () => {
  if (!firebaseClientPromise) {
    firebaseClientPromise = import('./firebaseClient.js')
  }

  return firebaseClientPromise
}

const googleAuthMessages = {
  'auth/popup-closed-by-user': 'Google sign-in was canceled.',
  'auth/popup-blocked': 'The Google sign-in popup was blocked. Allow popups and try again.',
  'auth/cancelled-popup-request': 'Google sign-in was canceled. Please try again.',
  'auth/account-exists-with-different-credential': 'This email is already linked to another sign-in method.',
  'auth/network-request-failed': 'Unable to reach Google. Check your connection and try again.',
}

const normalizeGoogleAuthError = (error) => {
  const message = googleAuthMessages[error?.code]
  if (message) return new Error(message)
  if (error instanceof Error && !String(error.code || '').startsWith('auth/')) return error
  return new Error('Google sign-in could not be completed. Please try again.')
}

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

  const googleLogin = useCallback(async () => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId
    let firebaseClient

    try {
      firebaseClient = await getFirebaseClient()
      const result = await firebaseClient.signInWithPopup(firebaseClient.firebaseAuth, firebaseClient.googleProvider)
      const idToken = await result.user.getIdToken()
      await googleLoginRequest({ idToken })
    } catch (error) {
      if (firebaseClient?.firebaseAuth.currentUser) {
        await firebaseClient.signOutFromFirebase(firebaseClient.firebaseAuth).catch(() => {})
      }
      if (canCommitAuthState(requestId)) setIsLoading(false)
      throw normalizeGoogleAuthError(error)
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
      try {
        const firebaseClient = await getFirebaseClient()
        if (firebaseClient.firebaseAuth.currentUser) {
          await firebaseClient.signOutFromFirebase(firebaseClient.firebaseAuth)
        }
      } catch {
        // The EduMaster cookie session is still cleared even if Firebase is
        // temporarily unreachable during sign-out.
      } finally {
        authRequestId.current += 1
        if (isMounted.current) {
          setUser(null)
          setSessionHint(false)
          navigate(redirectTo, { replace: true })
        }
        notifyOtherTabs()
      }
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
    googleLogin,
    signup,
    logout,
    refreshUser: loadCurrentUser,
    updateUser,
  }), [googleLogin, hasSessionHint, isLoading, loadCurrentUser, login, logout, signup, updateUser, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
