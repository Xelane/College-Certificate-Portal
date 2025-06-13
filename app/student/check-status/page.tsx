"use client";
import React, { useEffect, useState } from 'react';
import CheckStatusUI from './CheckStatusUI';
import PageTransition from '../../PageTransition';

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

export default function CheckStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [officialEmail, setOfficialEmail] = useState<string | null>(
    typeof window !== "undefined" ? sessionStorage.getItem("officialEmail") : null
  );

  // Set officialEmail from sessionStorage when the component mounts
  useEffect(() => {
    if (!officialEmail && typeof window !== "undefined") {
      const email = sessionStorage.getItem("officialEmail");
      if (email) {
        setOfficialEmail(email); // Store the email in state
      } else {
        setError("No official email found in session storage.");
      }
    }
  }, [officialEmail]);

  // Fetch application status for the student based on officialEmail
  useEffect(() => {
    if (!officialEmail) return;

    const fetchStatus = async () => {
      try {
        console.log("Fetching status for:", officialEmail);  // Debugging log to check email value
        const response = await fetch(`/api/statusByEmail/${encodeURIComponent(officialEmail)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data: Status = await response.json();
        console.log("Fetched Data:", data);  // Debugging log to check the response

        const allVerified = Object.values(data.verificationStatus).every((value) => value === true);
        data.applicationStatus = allVerified ? "Approved" : "Pending";
        setStatus(data);
      } catch (error) {
        console.error("Error fetching status:", error);
        setError("Failed to fetch status. Please try again later.");
      }
    };

    fetchStatus();
  }, [officialEmail]);  // Dependency on officialEmail

  return (
    <PageTransition>
      {error && <p>{error}</p>}
      <CheckStatusUI status={status} error={error} />
    </PageTransition>
  );
}
