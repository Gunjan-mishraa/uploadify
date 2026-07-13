'use client'

import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        // Hard navigation to the login page (reliable in dev; no soft-nav race).
        window.location.href = '/login'
        return
      }
      const data = await res.json().catch(() => null)
      setError(data?.error === 'User exists' ? 'An account with this email already exists' : 'Registration failed')
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="aurora flex items-center justify-center px-4 py-12">
      <div className="aurora-grid" />
      <div className="fade-up w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass p-8">
          <div className="text-center mb-7">
            <div className="icon-badge mx-auto mb-4 flex h-16 w-16 text-3xl">✨</div>
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="mt-2 text-sm text-(--text-muted)">Sign up to start uploading your media.</p>
          </div>

          {error && <div className="alert-error mb-5">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block mt-2">
              {loading ? (
                <>
                  <span className="spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-(--text-muted)">
              Already have an account?{' '}
              <a href="/login" className="font-semibold gradient-text">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}