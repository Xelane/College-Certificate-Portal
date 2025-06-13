// app/student/dashboard/page.tsx
"use client"; // Mark this component as a Client Component

import Link from 'next/link';
import React from 'react';

import StudentDashboardUI from './studentdashboardUI';
export default function StudentDashboard() {
  // return (
  //   <div>
  //     <h1>Student Dashboard</h1>
  //     <Link href="/student/dashboard/form">Fill Form</Link>
  //     <br />
  //     <Link href="/student/check-status">Check Status</Link>
  //   </div>
  // );
  return <StudentDashboardUI />;
}


