// app/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');  // Import PDFKit for PDF creation

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory for uploads
  },
  filename: (req, file, cb) => {
    const prnNo = req.body.prnNo;
    const fileType = file.fieldname;
    const uniqueName = `${prnNo}_${fileType}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a schema and model for form data including file paths and verification statuses
const FormDataSchema = new mongoose.Schema({
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

const FormData = mongoose.model('FormData', FormDataSchema);

// Endpoint to handle form submission and file uploads
app.post('/submit', upload.fields([
  { name: 'Prov_Cert', maxCount: 1 },
  { name: 'Marksheet', maxCount: 1 },
  { name: 'Fee_Receipt', maxCount: 1 },
  { name: 'Prev_LC', maxCount: 1 },
  { name: 'ID_Card', maxCount: 1 }
]), async (req, res) => {
  try {
    // Create new form data including file paths
    const formData = new FormData({
      ...req.body,
      Prov_Cert: req.files['Prov_Cert'] ? req.files['Prov_Cert'][0].path : '',
      Marksheet: req.files['Marksheet'] ? req.files['Marksheet'][0].path : '',
      Fee_Receipt: req.files['Fee_Receipt'] ? req.files['Fee_Receipt'][0].path : '',
      Prev_LC: req.files['Prev_LC'] ? req.files['Prev_LC'][0].path : '',
      ID_Card: req.files['ID_Card'] ? req.files['ID_Card'][0].path : '',
    });

    // Save the form data to the database
    await formData.save();
    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Endpoint to fetch all applications
app.get('/applications', async (req, res) => {
  try {
    const applications = await FormData.find();
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Endpoint to update verification status for a specific PRN
app.patch('/applications/:prnNo/verify', async (req, res) => {
  const { prnNo } = req.params;
  const { role } = req.body;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.verificationStatus[role] !== undefined) {
      // Toggle the verification status for the specified role
      application.verificationStatus[role] = !application.verificationStatus[role];

      // Check if all verification statuses are true
      const allVerified = Object.values(application.verificationStatus).every(status => status === true);

      // If all verifications are complete, update the application status to "Accepted"
      if (allVerified) {
        application.applicationStatus = "Accepted";
      }

      // Save the updated application
      await application.save();
      res.status(200).json(application);
    } else {
      res.status(400).json({ error: 'Invalid role specified' });
    }
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Endpoint to update application status for a specific PRN
app.patch('/applications/:prnNo/status', async (req, res) => {
  const { prnNo } = req.params;
  const { status } = req.body;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.applicationStatus = status;
    await application.save();
    res.status(200).json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Endpoint to fetch application status for a specific student by PRN number
app.get('/api/status/:prnNo', async (req, res) => {
  const { prnNo } = req.params;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Extract relevant data for the response
    const statusData = {
      verificationStatus: application.verificationStatus,
      applicationStatus: application.applicationStatus
    };
    res.status(200).json(statusData);
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
});


// Endpoint to fetch application status for a student by officialEmail
app.get('/api/status/email/:officialEmail', async (req, res) => {
  const { officialEmail } = req.params;

  try {
    const application = await FormData.findOne({ officialEmail });
    if (!application) {
      return res.status(404).json({ error: 'Application not found for the provided email' });
    }

    // Extract relevant data for the response
    const statusData = {
      verificationStatus: application.verificationStatus,
      applicationStatus: application.applicationStatus
    };
    res.status(200).json(statusData);
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
});

// New endpoint to generate PDF for a specific PRN
app.get('/applications/:prnNo/pdf', async (req, res) => {
  const { prnNo } = req.params;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${prnNo}_application.pdf`);

    // Pipe the document to the response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(16).text(`Application Details for PRN: ${application.prnNo}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${application.name}`);
    doc.text(`Gender: ${application.mrOrMrs}`);
    doc.text(`Faculty/School: ${application.facultySchool}`);
    doc.text(`Class: ${application.className}`);
    doc.text(`Program: ${application.program}`);
    doc.text(`Year of Passing: ${application.yearOfPassing}`);
    doc.text(`Result: ${application.result}`);
    doc.text(`Reason for Applying: ${application.reasonForApplying}`);
    doc.text(`Previous School: ${application.previousSchool}`);
    doc.text(`Previous Course: ${application.previousCourse}`);
    doc.text(`Previous College Passing Year: ${application.previousCollegePassingYear}`);
    doc.text(`Date of Admission: ${application.dateOfAdmission}`);
    doc.text(`Date of Last Attendance: ${application.dateOfLastAttendance}`);
    doc.text(`Date of Birth: ${application.dateOfBirth}`);
    doc.text(`Place of Birth (State): ${application.statePlaceOfBirth}`);
    doc.text(`Nationality: ${application.nationality}`);
    doc.text(`Religion: ${application.religion}`);
    doc.text(`Caste/Sub-Caste: ${application.casteSubCaste}`);
    doc.text(`Permanent Address: ${application.permanentAddress}`);
    doc.text(`Email: ${application.email}`);
    doc.text(`Mobile Number: ${application.mobileNumber}`);
    doc.text(`Mother's Name: ${application.mothersName}`);
    doc.text(`Alternate Mobile Number: ${application.alternateMobileNumber}`);
    doc.moveDown();

    // Verification Status
    doc.fontSize(14).text('Verification Status:', { underline: true });
    for (const [key, value] of Object.entries(application.verificationStatus)) {
      doc.fontSize(12).text(`${key}: ${value ? 'Verified' : 'Not Verified'}`);
    }

    // Application Status
    doc.moveDown();
    doc.fontSize(12).text(`Application Status: ${application.applicationStatus}`);

    // End and send the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});


// Serve the uploads folder to access uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
