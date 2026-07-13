import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  await connectDB()
  const existingUser = await User.findOne({ email })
  if (existingUser) return NextResponse.json({ error: 'User exists' }, { status: 400 })

  const hashedPassword = bcrypt.hashSync(password, 10)
  const user = new User({ email, password: hashedPassword })
  await user.save()
  return NextResponse.json({ message: 'User created' })
}