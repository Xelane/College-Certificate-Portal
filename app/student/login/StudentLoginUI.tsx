// app/student/login/StudentLoginUI.tsx
"use client";

import React from 'react';
import styles from './login.module.css';
interface StudentLoginUIProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: (event: React.FormEvent) => Promise<void>;
  handleSignupRedirect: () => void;
}

export default function StudentLoginUI({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleSignupRedirect,
}: StudentLoginUIProps) {
  return (
    <div className="login-container">
      <img src="../../mitlogo.png" alt="MIT-WPU Logo" className="logo" />
      <h1 className="login-title">Student Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        <button type="button" onClick={handleSignupRedirect} className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
