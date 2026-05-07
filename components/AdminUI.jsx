'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

export function AdminUIProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null) // {title, message, productThumb, resolve, danger}

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2800)
  }, [])

  const confirm = useCallback(
    ({ title = 'Are you sure?', message = '', productThumb = null, danger = false, confirmText = 'Confirm', cancelText = 'Cancel' } = {}) =>
      new Promise((resolve) => {
        setConfirmState({ title, message, productThumb, danger, confirmText, cancelText, resolve })
      }),
    []
  )

  const handleConfirm = (value) => {
    confirmState?.resolve(value)
    setConfirmState(null)
  }

  return (
    <Ctx.Provider value={{ toast, confirm }}>
      {children}

      {/* Toasts */}
      <div className="admin-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            <span className="admin-toast-mark">{t.type === 'error' ? '!' : t.type === 'success' ? '✓' : '✦'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmState && (
        <div className="admin-modal-backdrop" onClick={() => handleConfirm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            {confirmState.productThumb && (
              <img src={confirmState.productThumb} alt="" className="admin-modal-thumb" />
            )}
            <h3 className="italiana admin-modal-title">{confirmState.title}</h3>
            {confirmState.message && (
              <p className="admin-modal-message">{confirmState.message}</p>
            )}
            <div className="admin-modal-actions">
              <button className="admin-btn-ghost" onClick={() => handleConfirm(false)}>
                {confirmState.cancelText}
              </button>
              <button
                className={confirmState.danger ? 'admin-btn-danger' : 'btn-dark'}
                onClick={() => handleConfirm(true)}
                autoFocus
              >
                <span>{confirmState.confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export const useAdminUI = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdminUI must be inside AdminUIProvider')
  return ctx
}
