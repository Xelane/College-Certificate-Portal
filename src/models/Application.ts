import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  department: { type: String, required: true }, // student’s dept
  certificateType: {
    type: String,
    enum: ['Bonafide', 'Leaving', 'Transfer', 'Domicile'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'rejected', 'completed'],
    default: 'pending'
  },
  submittedAt: { type: Date, default: Date.now },
  approvals: [
    {
      department: { type: String },
      approved: { type: Boolean },
      verifiedAt: { type: Date }
    }
  ]
})

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema)
