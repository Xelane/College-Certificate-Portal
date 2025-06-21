import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import Application from '@/models/Application'

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params
  
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = verifyToken(token || '')
  
  if (!decoded || decoded.role !== 'faculty') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  
  const facultyDept = decoded.facultyDept
  const applicationId = id
  const app = await Application.findById(applicationId)
  
  if (!app) {
    return NextResponse.json({ message: 'Application not found' }, { status: 404 })
  }
  
  // Find department entry
  const approvalEntry = app.approvals.find((a: any) => a.department === facultyDept)
  
  if (!approvalEntry) {
    return NextResponse.json({ message: 'You are not allowed to verify this application' }, { status: 403 })
  }
  
  if (approvalEntry.approved === true) {
    return NextResponse.json({ message: 'Already verified' }, { status: 400 })
  }
  
  // Mark this department as approved
  approvalEntry.approved = true
  approvalEntry.verifiedAt = new Date()
  
  // Check if all departments approved
  const allApproved = app.approvals.every((entry: any) => entry.approved === true)
  app.status = allApproved ? 'completed' : 'in_progress'
  
  await app.save()
  
  return NextResponse.json({
    message: `Application ${allApproved ? 'completed' : 'updated'}`,
    status: app.status,
    application: app
  })
}