import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import Application from '@/models/Application'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = verifyToken(token || '')

  if (!decoded || decoded.role !== 'faculty') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const facultyDept = decoded.facultyDept
  const appId = params.id

  const app = await Application.findById(appId)
  if (!app) {
    return NextResponse.json({ message: 'Application not found' }, { status: 404 })
  }

  const approvalEntry = app.approvals.find((a: any) => a.department === facultyDept)
  if (!approvalEntry) {
    return NextResponse.json({ message: 'You cannot reject this application' }, { status: 403 })
  }

  if (approvalEntry.approved !== false || app.status === 'rejected') {
    return NextResponse.json({ message: 'Already processed' }, { status: 400 })
  }

  // Mark app as rejected
  app.status = 'rejected'
  approvalEntry.approved = false
  approvalEntry.verifiedAt = new Date()

  await app.save()

  return NextResponse.json({ message: 'Application rejected', application: app }, { status: 200 })
}
