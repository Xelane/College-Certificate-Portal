import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    // Map specific emails to their roles (faculty-only mapping)
    const emailRoleMapping = {
      'hos@mitwpu.edu.in': 'HoS',
      'librarian@mitwpu.edu.in': 'Librarian',
      'accounts@mitwpu.edu.in': 'Accounts',
      'gymkhana@mitwpu.edu.in': 'Gymkhana',
      'programoffice@mitwpu.edu.in': 'ProgramOffice',
      'dean@mitwpu.edu.in': 'Dean'
    };

    // Determine the expected role based on email (for faculty members)
    let expectedRole = emailRoleMapping[email.toLowerCase()];
    
    // If no faculty role, assume the user is a student
    if (!expectedRole) {
      expectedRole = 'student';
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Check if the user's role matches the expected role
    if (user.type !== expectedRole) {
      return new Response(
        JSON.stringify({ error: `You are not authorized as a ${expectedRole}` }),
        { status: 403 }
      );
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // If everything is correct, log the user in
    console.log("User logged in:", user);
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500 }
    );
  }
}
