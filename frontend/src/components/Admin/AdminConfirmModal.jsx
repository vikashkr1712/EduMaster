import { useEffect, useRef } from 'react'
import AdminIcon from './AdminIcons.jsx'

export default function AdminConfirmModal({
  open,
  title,
  children,
  confirmLabel,
  pending,
  pendingLabel = 'Deleting…',
  icon = 'trash',
  tone = 'danger',
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const cancelHandlerRef = useRef(onCancel)
  const pendingRef = useRef(pending)

  useEffect(() => { cancelHandlerRef.current = onCancel }, [onCancel])
  useEffect(() => { pendingRef.current = pending }, [pending])

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    cancelRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !pendingRef.current) cancelHandlerRef.current()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled)') ?? []
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !pending && onCancel()}>
      <section className="admin-confirm-modal" ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title">
        <div className={`admin-confirm-modal__icon admin-confirm-modal__icon--${tone}`}><AdminIcon name={icon} size={23} /></div>
        <h2 id="admin-confirm-title">{title}</h2>
        <div className="admin-confirm-modal__copy">{children}</div>
        <div className="admin-confirm-modal__actions">
          <button ref={cancelRef} type="button" className="admin-button admin-button--secondary" onClick={onCancel} disabled={pending}>Cancel</button>
          <button type="button" className={`admin-button admin-button--${tone === 'danger' ? 'danger' : 'primary'}`} onClick={onConfirm} disabled={pending}>
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
