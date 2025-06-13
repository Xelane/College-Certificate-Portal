// app/faculty/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import FacultyLoginUI from './FacultyLoginUI';
import PageTransition from '../../PageTransition';

export default function FacultyLogin() {
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if email is in the predefined list
    const role = emailRoleMapping[email.toLowerCase()];
    if (!role) {
      alert('This email is not authorized for any faculty role.');
      return;
    }

    // Send login data to the API
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }) // Send role based on email
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert('An error occurred while processing your request.');
      return;
    }

    if (res.ok) {
      alert(data.message);
      sessionStorage.setItem('userRole', role); // Store role in session storage
      router.push('/faculty/dashboard');
    } else {
      alert(data.message);
    }
  };

  const handleSignupRedirect = () => {
    router.push('/faculty/signup');
  };

  // return (
  //   <form onSubmit={handleLogin}>
  //     <h1>Faculty Login</h1>
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
  //     <button type="submit">Login</button>
  //     <button type="button" onClick={handleSignupRedirect} style={{ marginTop: '10px' }}>
  //       Signup
  //     </button>
  //   </form>
  // );
  return (
    <PageTransition>
      <FacultyLoginUI
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleSignupRedirect={handleSignupRedirect}
      />
    </PageTransition>
  );
}
