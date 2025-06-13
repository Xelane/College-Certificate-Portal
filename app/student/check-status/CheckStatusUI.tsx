// app/student/checkStatus/CheckStatusUI.tsx
"use client";

import React from 'react';
import styles from './checkStatus.module.css';

interface VerificationStatus {
  HoS: boolean;
  Librarian: boolean;
  Accounts: boolean;
  Gymkhana: boolean;
  ProgramOffice: boolean;
  Dean: boolean;
}

interface Status {
  verificationStatus: VerificationStatus;
  applicationStatus: string;
}

interface CheckStatusUIProps {
  status: Status | null;
  error: string | null;
}

export default function CheckStatusUI({ status, error }: CheckStatusUIProps) {
  return (
    <div className={styles.statusContainer}>
      <h1 className={styles.title}>Check Application Status</h1>

      {error && <p className={styles.error}>{error}</p>}

      {status ? (
        <>
          <table className={styles.statusTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Department</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(status.verificationStatus).map((department, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableData}>{department}</td>
                  <td className={styles.tableData}>
                    {status.verificationStatus[department as keyof VerificationStatus] ? (
                      <span className={styles.statusIcon} style={{ color: 'green' }}>✔</span>
                    ) : (
                      <span className={styles.statusIcon} style={{ color: 'red' }}>❌</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className={styles.tableRow}>
                <td className={styles.tableData}>Application Status</td>
                <td className={styles.tableData}>{status.applicationStatus}</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.reminder}>
            If your application shows pending for 7 days or more, please contact or visit the student section.
          </p>
        </>
      ) : (
        <p className={styles.noStatus}>No status available.</p>
      )}
    </div>
  );
}
