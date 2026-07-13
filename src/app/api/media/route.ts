import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import Media from '@/lib/models/Media'
import { imagekit } from '@/lib/imagekit'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    if (!userId) {
      console.error('Session user ID missing:', session)
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large' }, { status: 400 })

    await connectDB()
    const userMediaCount = await Media.countDocuments({ userId })
    if (userMediaCount >= 10) return NextResponse.json({ error: 'Limit reached' }, { status: 400 })

    const uploadResponse = await imagekit.upload({
      file: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      folder: `/users/${userId}`,
    })

    const media = new Media({
      userId,
      fileName: file.name,
      url: uploadResponse.url,
      type: file.type,
      size: file.size,
    })
    await media.save()

    return NextResponse.json({ message: 'Uploaded', data: media })
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
    }

    await connectDB()
    const media = await Media.find({ userId }).sort({ createdAt: -1 })
    return NextResponse.json(media)
  } catch (error) {
    console.error('Get media error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}