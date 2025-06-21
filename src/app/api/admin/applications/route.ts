import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await connectDB()

  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const apps = await Application.find().sort({ submittedAt: -1 })
  return NextResponse.json({ applications: apps })
}
