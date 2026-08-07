import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@harvesthold.rw')
  const [password, setPassword] = useState('admin1234')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await api.login(email.trim(), password)
      login(data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err.message === 'NETWORK_ERROR'
          ? 'Cannot reach API. Start the backend on port 8080.'
          : err.message,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-forest-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.16),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(45,154,99,0.18),transparent_45%)]" />
      <div className="relative w-full max-w-md border border-white/10 bg-forest-900/80 p-8 shadow-2xl backdrop-blur">
        <p className="font-display text-3xl font-semibold text-white">Harvest Hold</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
          Operations console
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Monitor cooling fleet health, farmer alerts, and support tickets across Rwanda in real time.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-white/50">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border border-white/15 bg-forest-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500"
              required
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-white/50">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-white/15 bg-forest-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500"
              required
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-orange-300">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gold-500 py-3 text-sm font-semibold text-forest-950 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-white/35">
          Demo: admin@harvesthold.rw / admin1234
        </p>
      </div>
    </div>
  )
}
