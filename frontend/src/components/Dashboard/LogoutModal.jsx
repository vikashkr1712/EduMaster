import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import './LogoutModal.css'

// One shared logout confirmation used by every logout entry point
// (dashboard sidebar, profile dropdown, mobile nav drawer).
// It only wraps the EXISTING auth logout() with a confirm step — no auth changes.

const LogoutConfirmContext = createContext(null)

function LogoutIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4.5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7" />
      <path d="M16 8.5l3.5 3.5-3.5 3.5M19.5 12H9.5" />
    </svg>
  )
}

export function LogoutConfirmProvider({ children }) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const cancelRef = useRef(null)

  const requestLogout = useCallback(() => setOpen(true), [])
  const close = useCallback(() => {
    if (!busy) setOpen(false)
  }, [busy])

  const confirm = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      await logout()
    } finally {
      setBusy(false)
      setOpen(false)
    }
  }, [busy, logout])

  // focus Cancel when opened
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  // escape closes
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  // lock page scroll while open, always restore on close/unmount
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <LogoutConfirmContext.Provider value={requestLogout}>
      {children}
      {open && (
        <div className="logout-modal-overlay" onClick={close}>
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="logout-modal-icon"><LogoutIcon /></span>
            <h3 id="logout-modal-title" className="logout-modal-title">Log out of EduMaster?</h3>
            <p id="logout-modal-desc" className="logout-modal-text">
              Are you sure you want to logout? You will need to sign in again to access your courses.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-modal-cancel"
                ref={cancelRef}
                onClick={close}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-modal-confirm"
                onClick={confirm}
                disabled={busy}
              >
                {busy ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LogoutConfirmContext.Provider>
  )
}

export function useLogoutConfirm() {
  const requestLogout = useContext(LogoutConfirmContext)
  if (!requestLogout) {
    throw new Error('useLogoutConfirm must be used within a LogoutConfirmProvider')
  }
  return requestLogout
}
