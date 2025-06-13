// app/faculty/signup/FacultySignupUI.tsx
"use client";

import React from 'react';


interface FacultySignupUIProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSignup: (event: React.FormEvent) => Promise<void>;
}

export default function FacultySignupUI({
  email,
  setEmail,
  password,
  setPassword,
  handleSignup,
}: FacultySignupUIProps) {
  return (
    <div className="signup-container">
      <img src="../../mitlogo.png" alt="MIT-WPU Logo" className="logo" />
      <h1 className="signup-title">Faculty Signup</h1>
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
