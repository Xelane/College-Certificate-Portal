// app/student/signup/StudentSignupUI.tsx
"use client";

import React from 'react';
import styles from './signup.module.css';

interface StudentSignupUIProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSignup: (event: React.FormEvent) => Promise<void>;
}

export default function StudentSignupUI({
  email,
  setEmail,
  password,
  setPassword,
  handleSignup,
}: StudentSignupUIProps) {
  return (
    <div className="signup-container">
      <img src="../../mitlogo.png" alt="MIT-WPU Logo" className="logo" />
      <h1 className="signup-title">Student Sign Up</h1>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}