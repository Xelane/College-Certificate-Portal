import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';

// Initialize MongoDB connection
let mongoConnection = null;

async function connectToMongoDB() {
  if (mongoConnection) {
    return mongoConnection;
  }

  try {
    mongoConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    return mongoConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Define the Schema
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
  Prov_Cert: String,  // File URL for provisional certificate
  Marksheet: String,   // File URL for marksheet
  Fee_Receipt: String, // File URL for fee receipt
  Prev_LC: String,     // File URL for previous LC
  ID_Card: String,     // File URL for ID card
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

// Initialize model (prevent multiple model compilation)
const FormData = mongoose.models.FormData || mongoose.model('FormData', FormDataSchema);

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

// Helper function to handle file upload
async function handleFileUpload(file, formFields) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filename = `${formFields.prnNo || 'unknown'}_${file.name}_${Date.now()}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${filename}`, // File path inside S3
    Body: fileBuffer,
    ContentType: file.type,
  };

  const uploadResult = await s3.upload(s3Params).promise();
  return uploadResult.Location; // URL of the uploaded file in S3
}

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Parse form data (no body parsing middleware needed in Next.js 14+)
    const formData = await req.formData();
    const files = {};
    const formFields = {};

    // First pass: collect all form fields (non-file fields)
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        formFields[key] = value;
      }
    }

    // Second pass: handle file uploads and upload to AWS S3
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const uploadedUrl = await handleFileUpload(value, formFields);
        files[key] = uploadedUrl; // Store the URL from S3
      }
    }

    // Create new form data document
    const formDataDoc = new FormData({
      ...formFields,
      Prov_Cert: files['Prov_Cert'] || '',
      Marksheet: files['Marksheet'] || '',
      Fee_Receipt: files['Fee_Receipt'] || '',
      Prev_LC: files['Prev_LC'] || '',
      ID_Card: files['ID_Card'] || ''
    });

    // Save to database
    await formDataDoc.save();

    return NextResponse.json(
      { 
        message: 'Data saved successfully!',
        savedFiles: files 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
