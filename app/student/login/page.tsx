// app/student/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import StudentLoginUI from './StudentLoginUI';
import PageTransition from '../../PageTransition';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type] = useState('student');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, type }),
    });

    const text = await res.text(); // Get the response as text
    let data;
    try {
      data = JSON.parse(text); // Try to parse the response
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert('An error occurred while processing your request.');
      return;
    }

    if (res.ok) {
      alert(data.message);
      sessionStorage.setItem('officialEmail', email);
      router.push('/student/dashboard'); // Redirect to the dashboard on successful login
    } else {
      alert(data.message);
    }
  };

  const handleSignupRedirect = () => {
    router.push('/student/signup');
  };

  // return (
  //   <form onSubmit={handleLogin}>
  //     <h1>Student Login</h1>
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
  //     <input type="hidden" value={type} />
  //     <button type="submit">Login</button>
  //     <button type="button" onClick={handleSignupRedirect} style={{ marginTop: '10px' }}>
  //       Signup
  //     </button>
  //   </form>
  // );
  return (
    <PageTransition>
    <StudentLoginUI
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