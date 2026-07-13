'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Media {
  _id: string
  fileName: string
  url: string
  type: string
  size: number
  createdAt: string
}

export default function Gallery() {
  const { data: session, status } = useSession()
  const [media, setMedia] = useState<Media[]>([])
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/media')
        .then((res) => res.json())
        .then(setMedia)
    }
  }, [session])

  if (status === 'loading' || !session) {
    return (
      <div className="aurora flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="spin inline-block h-8 w-8 rounded-full border-2 border-white/20 border-t-fuchsia-400" />
          <p className="text-sm text-(--text-muted)">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="aurora px-4 py-10">
      <div className="aurora-grid" />
      <div className="fade-up mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Your gallery</h2>
            <p className="mt-1 text-sm text-(--text-muted)">
              {media.length > 0
                ? `${media.length} ${media.length === 1 ? 'item' : 'items'} stored`
                : 'Nothing here yet'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/upload" className="btn btn-primary btn-sm">📤 Upload</Link>
            <Link href="/" className="btn btn-ghost btn-sm">🏠 Home</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-danger btn-sm">Logout</button>
          </div>
        </div>

        {media.length === 0 ? (
          <div className="glass flex flex-col items-center px-6 py-16 text-center">
            <div className="icon-badge mb-4 flex h-16 w-16 text-3xl">🖼️</div>
            <p className="text-lg font-semibold">No media uploaded yet</p>
            <p className="mt-1 mb-6 text-sm text-(--text-muted)">Upload your first image or video to get started.</p>
            <Link href="/upload" className="btn btn-primary">Upload your first media</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <div key={item._id} className="glass glass-hover overflow-hidden">
                <div className="flex aspect-square items-center justify-center bg-black/40">
                  {item.type.startsWith('image') ? (
                    <img src={item.url} alt={item.fileName} className="h-full w-full object-contain" />
                  ) : (
                    <video src={item.url} controls className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate text-sm font-semibold" title={item.fileName}>{item.fileName}</p>
                  <p className="mt-1 text-xs text-(--text-faint)">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}