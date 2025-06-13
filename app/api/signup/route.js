import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    // Map specific emails to their roles for faculty
    const emailRoleMapping = {
      'hos@mitwpu.edu.in': 'HoS',
      'librarian@mitwpu.edu.in': 'Librarian',
      'accounts@mitwpu.edu.in': 'Accounts',
      'gymkhana@mitwpu.edu.in': 'Gymkhana',
      'programoffice@mitwpu.edu.in': 'ProgramOffice',
      'dean@mitwpu.edu.in': 'Dean'
    };

    // Determine role based on email (if faculty email, assign respective role)
    let role = emailRoleMapping[email.toLowerCase()];
    
    // If no role is found, assume the user is a student
    if (!role) {
      role = 'student';
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the assigned role
    const newUser = new User({
      email,
      password: hashedPassword,
      type: role // Use the role (either faculty role or student)
    });

    const savedUser = await newUser.save();
    console.log("User successfully saved:", savedUser);
    
    return new Response(JSON.stringify(savedUser), { status: 201 });
  } catch (error) {
    console.error("Error in signup:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to sign up' }),
      { status: 500 }
    );
  }
}
