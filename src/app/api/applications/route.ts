import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import Application from '@/models/Application'

const REQUIRED_DEPARTMENTS = ['library', 'gym', 'dean', 'program_office', 'hostel']

// Handle student application submission
export async function POST(req: NextRequest) {
  await connectDB()
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  const decoded = verifyToken(token || '')

  if (!decoded || decoded.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { studentName, department, certificateType } = await req.json()

  try {
    const application = await Application.create({
        studentId: decoded.userId,
        studentName,
        department,
        certificateType,
        status: 'pending',
        approvals: REQUIRED_DEPARTMENTS.map((dept) => ({
        department: dept,
        approved: false,
        verifiedAt: null
        }))
    })

    return NextResponse.json({ message: 'Application submitted', application }, { status: 201 })
    } catch (err: any) {
    console.error('[APPLICATION CREATE ERROR]', err)
    return NextResponse.json({ message: 'Failed to create application', error: err.message }, { status: 500 })
    }

}

// Handle GET: student → own apps | faculty → dept-specific pending
export async function GET(req: NextRequest) {
  await connectDB()
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  const decoded = verifyToken(token || '')

  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let apps

  if (decoded.role === 'student') {
    apps = await Application.find({ studentId: decoded.userId }).sort({ submittedAt: -1 })
  } else if (decoded.role === 'faculty') {
    const facultyDept = decoded.facultyDept
    apps = await Application.find({
      approvals: {
        $elemMatch: {
          department: facultyDept,
          approved: false
        }
      }
    }).sort({ submittedAt: -1 })
  } else {
    apps = [] // for now: admins get nothing
  }

  return NextResponse.json({ applications: apps }, { status: 200 })
}
