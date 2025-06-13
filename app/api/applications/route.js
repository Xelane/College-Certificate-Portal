import { NextResponse } from 'next/server';
import FormData from '../../../models/FormData'; // Import your FormData model
import dbConnect from '../dbConnect'; // Import the dbConnect function

export async function GET() {
  try {
    // Ensure database connection
    await dbConnect();
    
    // Fetch all applications (FormData entries)
    const applications = await FormData.find();
    
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    // Ensure database connection
    await dbConnect();

    // Parse the request body
    const { prnNo, role, status } = await req.json();

    if (!prnNo || !role || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the application by PRN number
    const application = await FormData.findOne({ prnNo });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update verification status based on role
    application.verificationStatus[role] = status === 'Accepted';

    // If all verification statuses are true, update application status to "Accepted"
    const allVerified = Object.values(application.verificationStatus).every((value) => value === true);
    application.applicationStatus = allVerified ? 'Accepted' : 'Pending';

    // Save the updated application
    await application.save();

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
