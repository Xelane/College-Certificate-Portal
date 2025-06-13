// app/faculty/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import FacultySignupUI from './FacultySignupUI';
import PageTransition from '../../PageTransition';

export default function FacultySignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Define the static email-role mapping
  const emailRoleMapping: { [key: string]: string } = {
    'hos@mitwpu.edu.in': 'HoS',
    'librarian@mitwpu.edu.in': 'Librarian',
    'accounts@mitwpu.edu.in': 'Accounts',
    'gymkhana@mitwpu.edu.in': 'Gymkhana',
    'programoffice@mitwpu.edu.in': 'ProgramOffice',
    'dean@mitwpu.edu.in': 'Dean'
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@mitwpu\.edu\.in$/;
    if (!emailPattern.test(email)) {
      alert('Email must end with @mitwpu.edu.in');
      return;
    }

    // Check if email is in the predefined list
    const role = emailRoleMapping[email.toLowerCase()];
    if (!role) {
      alert('This email is not authorized for any faculty role.');
      return;
    }

    // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      alert('Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    // Send signup data to the API
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }), // Use role determined from the mapping
      });

      if (res.ok) {
        alert('Signup successful!');
        router.push('/faculty/login');
      } else {
        const data = await res.json();
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error in signup:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // return (
  //   <form onSubmit={handleSignup}>
  //     <h1>Faculty Signup</h1>

  //     <input
  //       type="email"
  //       placeholder="Email"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       required
  //     />

  //     <input
  //       type="password"
  //       placeholder="Password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       required
  //     />

  //     <button type="submit">Signup</button>
  //   </form>
  // );
  return (
    <PageTransition>
      <FacultySignupUI
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignup={handleSignup}
      />
    </PageTransition>
  );
}
