"use client";
import React, { useEffect, useState } from "react";
import FacultyDashboardUI from "./FacultyDashboardUI";

// Define the structure of each application
interface Application {
  prnNo: string;
  verificationStatus: {
    HoS: boolean;
    Librarian: boolean;
    Accounts: boolean;
    Gymkhana: boolean;
    ProgramOffice: boolean;
    Dean: boolean;
  };
  applicationStatus?: string; // Optional field to track Accept/Reject status
}

export default function FacultyDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [facultyRole, setFacultyRole] = useState<string>('HoS'); // Default role
  const [error, setError] = useState<string | null>(null); // Error state for handling fetch errors

  // Run this effect only on the client side
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      setFacultyRole(storedRole);
    }
  }, []); // Empty dependency array means it runs once after mount

  // Fetch applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applications from API...");
        const response = await fetch("/api/applications");

        // Check if the response is okay
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        // Parse the response JSON
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to fetch applications. Please try again later.");
      }
    };

    fetchApplications();
  }, []); // Empty dependency array means this will only run once when the component mounts

  // Accept application - Update verification status for the current faculty role
  const handleAccept = async (prnNo: string) => {
    try {
      const response = await fetch(`/api/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: facultyRole, status: "Accepted" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        setError("Failed to update application.");
        return;
      }

      const updatedApplication = await response.json();

      // Check if updatedApplication is null or undefined before updating state
      if (updatedApplication) {
        setApplications((prev) =>
          prev.map((app) =>
            app.prnNo === prnNo
              ? {
                  ...app,
                  verificationStatus: updatedApplication.verificationStatus, // Update verification status
                  applicationStatus: updatedApplication.applicationStatus,   // Update the application status
                }
              : app
          )
        );
      } else {
        setError("Failed to update application. Data is missing.");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      setError("An error occurred. Please try again.");
    }
  };

  // Reject application - Set verification status to false and mark as rejected
  const handleReject = async (prnNo: string) => {
    try {
      const response = await fetch(`/api/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: facultyRole, status: "Rejected" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        setError("Failed to update application.");
        return;
      }

      const updatedApplication = await response.json();

      // Check if updatedApplication is null or undefined before updating state
      if (updatedApplication) {
        setApplications((prev) =>
          prev.map((app) =>
            app.prnNo === prnNo
              ? {
                  ...app,
                  verificationStatus: updatedApplication.verificationStatus,
                  applicationStatus: updatedApplication.applicationStatus,
                }
              : app
          )
        );
      } else {
        setError("Failed to update application. Data is missing.");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* Display error if fetching applications failed */}
      {error && <p>{error}</p>}

      {/* Render applications in the UI */}
      <FacultyDashboardUI
        applications={applications}
        facultyRole={facultyRole}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
