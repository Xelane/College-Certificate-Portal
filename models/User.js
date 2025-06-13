// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['student', 'HoS', 'Librarian', 'Accounts', 'Gymkhana', 'ProgramOffice', 'Dean'],
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
