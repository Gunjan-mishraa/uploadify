import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="aurora">
      <div className="aurora-grid" />
      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-16 sm:py-20">
        {/* Hero */}
        <div className="fade-up text-center">
          <span className="eyebrow mb-6">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
            Media, beautifully stored
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
            Upload &amp; showcase your{' '}
            <span className="gradient-text">images and videos</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-(--text-muted) sm:text-lg">
            A simple, secure media platform. Store your files in the cloud and view
            them anywhere, on any device.
          </p>
        </div>

        {/* Card */}
        {session ? (
          <div className="fade-up glass mt-12 w-full max-w-2xl p-6 sm:p-8" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center text-center">
              <div className="icon-badge h-16 w-16 text-3xl">👤</div>
              <p className="mt-4 text-lg font-semibold">Welcome back</p>
              <p className="mt-1 text-sm text-(--text-muted)">{session.user?.email}</p>
            </div>

            <div className="divider my-7" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/upload" className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-5 text-center">
                <span className="text-3xl">📤</span>
                <span className="font-semibold">Upload</span>
                <span className="text-xs text-(--text-muted)">Add new media</span>
              </Link>
              <Link href="/gallery" className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-5 text-center">
                <span className="text-3xl">🖼️</span>
                <span className="font-semibold">Gallery</span>
                <span className="text-xs text-(--text-muted)">Browse files</span>
              </Link>
              <form action="/api/auth/signout" method="POST" className="contents">
                <button type="submit" className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-5 text-center">
                  <span className="text-3xl">🚪</span>
                  <span className="font-semibold">Logout</span>
                  <span className="text-xs text-(--text-muted)">End session</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="fade-up glass mt-12 w-full max-w-md p-8" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center text-center">
              <div className="icon-badge h-16 w-16 text-3xl">🔐</div>
              <h2 className="mt-4 text-2xl font-bold">Get started</h2>
              <p className="mt-2 text-sm text-(--text-muted)">
                Sign in or create an account to upload your media.
              </p>
            </div>
            <div className="mt-7 space-y-3">
              <Link href="/login" className="btn btn-primary btn-block">Login</Link>
              <Link href="/register" className="btn btn-ghost btn-block">Create account</Link>
            </div>
          </div>
        )}

        {/* Feature strip */}
        <div className="fade-up mt-14 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: '⚡', title: 'Fast uploads', desc: 'Drag, drop, done.' },
            { icon: '🔒', title: 'Private & secure', desc: 'Only you see your files.' },
            { icon: '📱', title: 'Responsive', desc: 'Looks great everywhere.' },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl">{f.icon}</div>
              <p className="mt-2 font-semibold">{f.title}</p>
              <p className="mt-1 text-xs text-(--text-muted)">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
