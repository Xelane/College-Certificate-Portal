// app/student/dashboard/StudentDashboardUI.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function StudentDashboardUI() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className={`dashboard-container ${isVisible ? 'fade-in' : ''}`}>
      <img src="../../mitlogo.png" alt="MIT-WPU Logo" className="dashboard-logo" />
      <h1 className="dashboard-title">Student Dashboard</h1>
      <div className="button-container">
        <Link href="/student/dashboard/form">
          <button className="dashboard-button">Fill Form</button>
        </Link>
        <Link href="/student/check-status">
          <button className="dashboard-button">Check Status</button>
        </Link>
      </div>
    </div>
  );
}
