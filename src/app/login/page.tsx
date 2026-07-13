'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (!result || result.error) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }
      // Hard navigation so the server re-renders the home page with the new
      // session. Avoids the router.push()+router.refresh() race that could
      // cancel the navigation and leave the user stuck on /login.
      window.location.href = '/'
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
            <div className="icon-badge mx-auto mb-4 flex h-16 w-16 text-3xl">🔑</div>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-(--text-muted)">Sign in to continue to your gallery.</p>
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
                placeholder="••••••••"
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
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-(--text-muted)">
              Don&apos;t have an account?{' '}
              <a href="/register" className="font-semibold gradient-text">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}