import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    })

    return NextResponse.json({ message: 'User registered', user: newUser }, { status: 201 })
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err)
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}
