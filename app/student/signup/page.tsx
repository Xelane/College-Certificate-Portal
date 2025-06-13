// app/student/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import StudentSignupUI from './StudentSignupUI';
import PageTransition from '../../PageTransition';

export default function StudentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type] = useState('student'); // Always set type to "student" for this form
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    // Email and Password validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@mitwpu\.edu\.in$/;
    if (!emailPattern.test(email)) {
      alert('Email must end with @mitwpu.edu.in');
      return;
    }

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
        body: JSON.stringify({ email, password, type }), // Pass the type field
      });

      if (res.ok) {
        alert('Signup successful!');
        router.push('/student/login');
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
  //     <h1>Student Signup</h1>

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

  //     {/* Hidden input for type (for now it’s always "student") */}
  //     <input type="hidden" value={type} />

  //     <button type="submit">Signup</button>
  //   </form>
  // );
  return (
    <PageTransition>
      <StudentSignupUI
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignup={handleSignup}
      />
    </PageTransition>
  );
}