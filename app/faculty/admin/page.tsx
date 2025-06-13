'use client'; // Ensure this is added at the very top

import React, { useEffect, useState } from "react";

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
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  const [facultyRole, setFacultyRole] = useState<string>(''); // State to store the faculty role

  // Set facultyRole from sessionStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole') || 'HoS';
      setFacultyRole(role); // Set facultyRole state
    }
  }, []);

  // Fetch applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/applications");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  // Accept application - Update verification status for the selected role
  const handleAccept = async (prnNo: string) => {
    try {
      await fetch(`http://localhost:5000/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, status: "Accepted" }),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.prnNo === prnNo
            ? {
                ...app,
                verificationStatus: {
                  ...app.verificationStatus,
                  [selectedRole]: true,
                },
                applicationStatus: "Accepted",
              }
            : app
        )
      );
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  // Reject application - Set verification status to false and mark as rejected
  const handleReject = async (prnNo: string) => {
    try {
      await fetch(`http://localhost:5000/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, status: "Rejected" }),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.prnNo === prnNo
            ? {
                ...app,
                verificationStatus: {
                  ...app.verificationStatus,
                  [selectedRole]: false,
                },
                applicationStatus: "Rejected",
              }
            : app
        )
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>PRN</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>HoS</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Librarian</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Accounts</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Gymkhana</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Program Office</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Dean</th>
            <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                No data currently available
              </td>
            </tr>
          ) : (
            applications.map((app, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <a href={`/application/${app.prnNo}`} target="_blank" rel="noopener noreferrer">
                    {app.prnNo}
                  </a>
                </td>
                {Object.keys(app.verificationStatus).map((role) => (
                  <td
                    key={role}
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "center",
                      color: app.verificationStatus[role as keyof Application["verificationStatus"]]
                        ? "green"
                        : "red",
                    }}
                  >
                    {app.verificationStatus[role as keyof Application["verificationStatus"]]
                      ? "✓"
                      : "✘"}
                  </td>
                ))}
                <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                  {/* Show dropdown and buttons only for Admin */}
                  {facultyRole === "Admin" && (
                    <div style={{ textAlign: "center" }}>
                      <select
                        style={{ marginBottom: "10px", padding: "5px" }}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        value={selectedRole}
                      >
                        <option value="">Select Role</option>
                        <option value="HoS">HoS</option>
                        <option value="Librarian">Librarian</option>
                        <option value="Accounts">Accounts</option>
                        <option value="Gymkhana">Gymkhana</option>
                        <option value="ProgramOffice">Program Office</option>
                        <option value="Dean">Dean</option>
                      </select>
                      <br />
                      <button
                        onClick={() => handleAccept(app.prnNo)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          margin: "5px",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(app.prnNo)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          margin: "5px",
                        }}
                      >
                        Reject
                      </button>
                    </div>
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
