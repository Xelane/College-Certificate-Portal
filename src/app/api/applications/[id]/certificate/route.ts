import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context
  await connectDB()

  const app = await Application.findById(params.id)

    if (!app) {
    return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    if (app.status !== 'completed') {
    return NextResponse.json({ message: 'Certificate not available until completed' }, { status: 403 })
    }


  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 400])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text: string, x: number, y: number, size = 14) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0)
    })
  }

  drawText('Certificate of Completion', 180, 350, 20)
  drawText(`Name: ${app.studentName}`, 50, 300)
  drawText(`Certificate Type: ${app.certificateType}`, 50, 270)
  drawText(`Department: ${app.department}`, 50, 240)
  drawText(`Issued on: ${new Date(app.submittedAt).toLocaleDateString()}`, 50, 210)

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${app.studentName}_certificate.pdf"`
    }
  })
}
