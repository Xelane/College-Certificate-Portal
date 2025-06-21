import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  facultyDept: {
    type: String,
    enum: ['library', 'gym', 'dean', 'program_office', 'hostel'],
    default: null
  }
})


export default mongoose.models.User || mongoose.model('User', UserSchema)
