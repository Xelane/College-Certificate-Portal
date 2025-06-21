import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token' }, { status: 401 })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 403 })
  }

  // You now have: decoded.userId, decoded.role
  return NextResponse.json({
    message: `Welcome ${decoded.role}`,
    userId: decoded.userId
  })
}
