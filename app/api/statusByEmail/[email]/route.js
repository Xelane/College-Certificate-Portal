// pages/api/statusByEmail/[email].js

import FormData from "../../../../models/FormData"; // Import FormData model
import dbConnect from "../../dbConnect"; // Import database connection utility

// This handler will fetch the student's status by their official email
export async function GET(req, { params }) {
  const { email } = params; // Extract email from params in Next.js 13+

  try {
    // Connect to the database
    await dbConnect();

    // Find the form data based on the official email
    const student = await FormData.findOne({ officialEmail: decodeURIComponent(email) });

    // If no student is found, return an error
    if (!student) {
      return new Response(JSON.stringify({ message: "Student not found" }), { status: 404 });
    }

    // Extract the verification status and application status
    const verificationStatus = student.verificationStatus;
    const applicationStatus = Object.values(verificationStatus).every(status => status === true)
      ? "Approved"
      : "Pending";

    // Return the student's status as JSON
    return new Response(JSON.stringify({
      verificationStatus,
      applicationStatus,
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error fetching student status:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
