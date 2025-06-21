import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            facultyDept: user.facultyDept || null
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    )


    return NextResponse.json({ token, role: user.role, name: user.name }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err }, { status: 500 })
  }
}
