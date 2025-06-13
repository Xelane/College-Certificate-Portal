import { NextResponse } from 'next/server';
import FormData from '../../../../../models/FormData'; // Adjust path to your FormData model
import dbConnect from '../../../dbConnect'; // Adjust path to dbConnect function

export async function PATCH(req, { params }) {
  try {
    // Ensure database connection
    await dbConnect();

    // Retrieve the prnNo from URL parameters
    const { prnNo } = params;
    const { role, status } = await req.json();

    if (!role || !status) {
      return NextResponse.json({ error: 'Missing required fields: role or status' }, { status: 400 });
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
