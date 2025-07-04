import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: 'student' | 'faculty' | 'admin'
      facultyDept?: string
    }
    return decoded
  } catch (err) {
    return null
  }
}

