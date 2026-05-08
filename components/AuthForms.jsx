'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from './UserContext'
import { events } from '@/lib/analytics'

export default function AuthForms({ defaultMode = 'login' }) {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get('next') || '/account'
  const { refresh } = useUser()
  const [mode, setMode] = useState(defaultMode === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const url = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
      const body = mode === 'signup' ? { email, name, password } : { email, password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErr(data.error || 'Something went wrong.')
        setBusy(false)
        return
      }
      if (mode === 'signup') events.signUp('password')
      else events.signIn('password')
      await refresh()
      router.replace(next)
      router.refresh()
    } catch {
      setErr('Network error. Try again.')
      setBusy(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setErr('')
  }

  const isSignup = mode === 'signup'

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          SHAN<span style={{ color: '#c94f2a' }}>KY</span>
        </Link>
        <p className="section-label" style={{ marginTop: 4 }}>
          {isSignup ? 'Create account' : 'Sign in'}
        </p>
        <h1 className="italiana auth-title">
          {isSignup ? 'Welcome.' : 'Welcome back.'}
        </h1>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isSignup ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isSignup ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {isSignup && (
            <div className={`field ${name ? 'filled' : ''}`}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                autoFocus
              />
              <label>Your name</label>
            </div>
          )}

          <div className={`field ${email ? 'filled' : ''}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              autoFocus={!isSignup}
              required
            />
            <label>Email</label>
          </div>

          <div className={`field ${password ? 'filled' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={isSignup ? 8 : undefined}
            />
            <label>Password{isSignup ? ' · 8+ characters' : ''}</label>
          </div>

          {err && <p className="auth-error">{err}</p>}

          <button type="submit" className="btn-dark auth-submit" disabled={busy}>
            <span>
              {busy
                ? isSignup ? 'Creating account…' : 'Signing in…'
                : isSignup ? 'Create account' : 'Sign in'}
            </span>
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : 'New to Shanky?'}{' '}
          <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
            {isSignup ? 'Sign in instead' : 'Create one'}
          </button>
        </p>

        <Link href="/" className="auth-back">← Back to store</Link>
      </div>
    </div>
  )
}
