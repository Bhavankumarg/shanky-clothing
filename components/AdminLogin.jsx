'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!password) return
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErr(data.error || 'Login failed')
        setBusy(false)
        return
      }
      router.replace('/admin/dashboard')
      router.refresh()
    } catch {
      setErr('Network error. Try again.')
      setBusy(false)
    }
  }

  return (
    <main className="admin-auth-page">
      <form onSubmit={submit} className="admin-auth-card">
        <div className="admin-auth-brand">
          SHAN<span style={{ color: '#c94f2a' }}>KY</span>
        </div>
        <p className="admin-auth-kicker">Admin · Sign in</p>
        <h1 className="italiana admin-auth-title">Welcome back.</h1>
        <p className="admin-auth-sub">
          Enter the admin password to manage the catalog. Default in dev: <code>shanky2025</code>.
        </p>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </label>

        {err && <p className="admin-auth-err">{err}</p>}

        <button type="submit" disabled={busy || !password} className="btn-dark admin-auth-btn">
          <span>{busy ? 'Signing in…' : 'Sign in'}</span>
        </button>

        <a href="/" className="admin-auth-back">← Back to store</a>
      </form>
    </main>
  )
}
