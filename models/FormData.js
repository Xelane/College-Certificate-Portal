import mongoose from 'mongoose'; // Use ES6 import

const FormDataSchema = new mongoose.Schema({
  // Define schema fields here...
  name: String,
  mrOrMrs: String,
  facultySchool: String,
  className: String,
  program: String,
  prnNo: { type: String, unique: true, required: true },
  result: String,
  yearOfPassing: String,
  reasonForApplying: String,
  previousSchool: String,
  previousCourse: String,
  previousCollegePassingYear: String,
  dateOfAdmission: String,
  dateOfLastAttendance: String,
  dateOfBirth: String,
  statePlaceOfBirth: String,
  nationality: String,
  religion: String,
  casteSubCaste: String,
  permanentAddress: String,
  email: String,
  mobileNumber: String,
  mothersName: String,
  alternateMobileNumber: String,
  Prov_Cert: String,
  Marksheet: String,
  Fee_Receipt: String,
  Prev_LC: String,
  ID_Card: String,
  verificationStatus: {
    HoS: { type: Boolean, default: false },
    Librarian: { type: Boolean, default: false },
    Accounts: { type: Boolean, default: false },
    Gymkhana: { type: Boolean, default: false },
    ProgramOffice: { type: Boolean, default: false },
    Dean: { type: Boolean, default: false },
  },
  applicationStatus: { type: String, default: "Pending" },
  officialEmail: String
});

const FormData = mongoose.models.FormData || mongoose.model('FormData', FormDataSchema);

export default FormData;  // Use default export
