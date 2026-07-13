'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Upload() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/gallery')
      } else {
        alert(`Upload failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert('Upload failed: Network error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="aurora px-4 py-10">
      <div className="aurora-grid" />
      <div className="fade-up mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Upload media</h2>
            <p className="mt-1 text-sm text-(--text-muted)">Share your images and videos.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/gallery" className="btn btn-ghost btn-sm">🖼️ Gallery</Link>
            <Link href="/" className="btn btn-ghost btn-sm">🏠 Home</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-danger btn-sm">Logout</button>
          </div>
        </div>

        <div className="glass p-6 sm:p-8">
          {/* Dropzone */}
          <label
            htmlFor="file-upload"
            className="group flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-(--border-strong) bg-white/2 p-10 text-center transition-colors hover:border-fuchsia-400/60 hover:bg-white/4"
          >
            <div className="icon-badge mb-4 flex h-16 w-16 text-3xl transition-transform group-hover:scale-105">📁</div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <div className="mb-1 text-base">
              {file ? (
                <span className="font-semibold gradient-text">{file.name}</span>
              ) : (
                <>
                  <span className="font-semibold gradient-text">Click to select</span>{' '}
                  <span className="text-(--text-muted)">or drag &amp; drop</span>
                </>
              )}
            </div>
            <p className="text-sm text-(--text-faint)">Images and videos up to 10MB</p>
          </label>

          {file && (
            <div className="alert-info mt-4">
              <span className="font-semibold">Selected:</span> {file.name}{' '}
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn btn-primary btn-block mt-6"
          >
            {uploading ? (
              <>
                <span className="spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                Uploading…
              </>
            ) : (
              '📤 Upload media'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}