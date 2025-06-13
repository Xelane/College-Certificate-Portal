// app/faculty/dashboard/FacultyDashboardUI.tsx
"use client";

import React from 'react';
import styles from './facultyDashboard.module.css';

interface VerificationStatus {
  HoS: boolean;
  Librarian: boolean;
  Accounts: boolean;
  Gymkhana: boolean;
  ProgramOffice: boolean;
  Dean: boolean;
}

interface Application {
  prnNo: string;
  verificationStatus: VerificationStatus;
  applicationStatus?: string;
}

interface FacultyDashboardUIProps {
  applications: Application[];
  facultyRole: string;
  onAccept: (prnNo: string) => void;
  onReject: (prnNo: string) => void;
}

export default function FacultyDashboardUI({
  applications,
  facultyRole,
  onAccept,
  onReject,
}: FacultyDashboardUIProps) {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Faculty Dashboard</h1>
      <table className={styles.dashboardTable}>
        <thead>
          <tr>
            <th>PRN</th>
            <th>HoS</th>
            <th>Librarian</th>
            <th>Accounts</th>
            <th>Gymkhana</th>
            <th>Program Office</th>
            <th>Dean</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.noData}>No data currently available</td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.prnNo}>
                <td className={styles.prnCell}>
                  <a href={`/application/${app.prnNo}`} target="_blank" rel="noopener noreferrer">
                    {app.prnNo}
                  </a>
                </td>
                {Object.keys(app.verificationStatus).map((role) => (
                  <td key={role} className={styles.statusCell}>
                    {app.verificationStatus[role as keyof VerificationStatus] ? (
                      <span className={styles.checkMark}>✔</span>
                    ) : (
                      <span className={styles.crossMark}>✘</span>
                    )}
                  </td>
                ))}
                <td className={styles.actionCell}>
                  {facultyRole in app.verificationStatus && (
                    <>
                      <button
                        onClick={() => onAccept(app.prnNo)}
                        className={styles.acceptButton}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onReject(app.prnNo)}
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
