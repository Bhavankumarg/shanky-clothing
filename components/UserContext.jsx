'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const UserCtx = createContext(null)

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from /api/auth/me on first mount so client routes always know
  // the current user (initialUser is only set when SSR ran with a cookie).
  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data?.ok) setUser(data.user || null)
      })
      .catch(() => {})
      .finally(() => !cancelled && setHydrated(true))
    return () => { cancelled = true }
  }, [])

  const refresh = useCallback(async () => {
    const r = await fetch('/api/auth/me', { cache: 'no-store' })
    const data = await r.json()
    if (data?.ok) setUser(data.user || null)
    return data?.user || null
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <UserCtx.Provider value={{ user, setUser, refresh, logout, hydrated }}>
      {children}
    </UserCtx.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
