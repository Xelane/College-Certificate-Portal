// app/student/dashboard/form/page.tsx
"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import Image from "next/image";
import "./form.css"; 
import PageTransition from '../../../PageTransition';
export default function Home() {
  // State variables for form fields
  const [name, setName] = useState("");
  const [mrOrMrs, setMrOrMrs] = useState("");
  const [facultySchool, setFacultySchool] = useState("");
  const [className, setClassName] = useState("");
  const [program, setProgram] = useState("");
  const [prnNo, setPrnNo] = useState("");
  const [result, setResult] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [reasonForApplying, setReasonForApplying] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [previousCourse, setPreviousCourse] = useState("");
  const [previousCollegePassingYear, setPreviousCollegePassingYear] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfLastAttendance, setDateOfLastAttendance] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [statePlaceOfBirth, setStatePlaceOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [casteSubCaste, setCasteSubCaste] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [alternateMobileNumber, setAlternateMobileNumber] = useState("");

  // State for uploaded files
  const [Prov_Cert, setProv_Cert] = useState<File | null>(null);
  const [Marksheet, setMarksheet] = useState<File | null>(null);
  const [Fee_Receipt, setFee_Receipt] = useState<File | null>(null);
  const [Prev_LC, setPrev_LC] = useState<File | null>(null);
  const [ID_Card, setID_Card] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new PDF document
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Leaving Certificate Form", 20, 20);
    const startY = 50;
    const lineHeight = 8;
    const fields = [
      { label: "Name of Student", value: name },
      { label: "Mr./Mrs.", value: mrOrMrs },
      { label: "Faculty/School Name", value: facultySchool },
      { label: "Class", value: className },
      { label: "Program", value: program },
      { label: "PRN No", value: prnNo },
      { label: "Result", value: result },
      { label: "Year of Passing", value: yearOfPassing },
      { label: "Reason for applying T.C./L.C", value: reasonForApplying },
      { label: "Previous School/College name", value: previousSchool },
      { label: "Previous Course", value: previousCourse },
      { label: "Previous College Passing Year", value: previousCollegePassingYear },
      { label: "Date of admission at MIT-WPU", value: dateOfAdmission },
      { label: "Date of Last attendance in MIT-WPU", value: dateOfLastAttendance },
      { label: "Date of Birth", value: dateOfBirth },
      { label: "State, Place of Birth", value: statePlaceOfBirth },
      { label: "Nationality", value: nationality },
      { label: "Religion", value: religion },
      { label: "Caste and Sub Caste", value: casteSubCaste },
      { label: "Permanent Address", value: permanentAddress },
      { label: "Email id", value: email },
      { label: "Mobile number", value: mobileNumber },
      { label: "Mother's Name", value: mothersName },
      { label: "Alternate Mobile number", value: alternateMobileNumber },
    ];

    fields.forEach((field, index) => {
      doc.text(field.label, 20, startY + index * lineHeight);
      doc.text(field.value, 100, startY + index * lineHeight);
    });

    // Save the PDF
    doc.save("Leaving_Certificate_Application.pdf");

    // Prepare form data for submission (including file uploads)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mrOrMrs", mrOrMrs);
    formData.append("facultySchool", facultySchool);
    formData.append("className", className);
    formData.append("program", program);
    formData.append("prnNo", prnNo);
    formData.append("result", result);
    formData.append("yearOfPassing", yearOfPassing);
    formData.append("reasonForApplying", reasonForApplying);
    formData.append("previousSchool", previousSchool);
    formData.append("previousCourse", previousCourse);
    formData.append("previousCollegePassingYear", previousCollegePassingYear);
    formData.append("dateOfAdmission", dateOfAdmission);
    formData.append("dateOfLastAttendance", dateOfLastAttendance);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("statePlaceOfBirth", statePlaceOfBirth);
    formData.append("nationality", nationality);
    formData.append("religion", religion);
    formData.append("casteSubCaste", casteSubCaste);
    formData.append("permanentAddress", permanentAddress);
    formData.append("email", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("mothersName", mothersName);
    formData.append("alternateMobileNumber", alternateMobileNumber);

    // Add the official email to the form data
    const officialEmail = sessionStorage.getItem('officialEmail') || ""; // Default to an empty string if null
    formData.append("officialEmail", officialEmail); // Append the email

    if (Prov_Cert) formData.append("Prov_Cert", Prov_Cert);
    if (Marksheet) formData.append("Marksheet", Marksheet);
    if (Fee_Receipt) formData.append("Fee_Receipt", Fee_Receipt);
    if (Prev_LC) formData.append("Prev_LC", Prev_LC);
    if (ID_Card) formData.append("ID_Card", ID_Card);

    // Send form data to the backend server
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Form data saved:", data);
      } else {
        console.error("Failed to save form data:", data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
  <PageTransition>
    <div className="form-container">
      <div className="logo-container">
        {/* Include the logo here */}
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <h1>Leaving Certificate Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="name">Name of Student:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            pattern="^[a-zA-Z\s]+$"
            title="Name should only contain letters and spaces."
          />

          <label htmlFor="mrOrMrs">Mr./Mrs.:</label>
          <input
            id="mrOrMrs"
            type="text"
            value={mrOrMrs}
            onChange={(e) => setMrOrMrs(e.target.value)}
            required
          />

          <label htmlFor="facultySchool">Faculty/School Name:</label>
          <input
            id="facultySchool"
            type="text"
            value={facultySchool}
            onChange={(e) => setFacultySchool(e.target.value)}
            required
          />

          <label htmlFor="className">Class:</label>
          <input
            id="className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <label htmlFor="program">Program:</label>
          <input
            id="program"
            type="text"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            required
          />

          <label htmlFor="prnNo">PRN No:</label>
          <input
            id="prnNo"
            type="text"
            value={prnNo}
            onChange={(e) => setPrnNo(e.target.value)}
            required
            pattern="\d{10}"
            title="PRN number should be a 10-digit number."
          />

          <label htmlFor="result">Result:</label>
          <input
            id="result"
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
          />

          <label htmlFor="yearOfPassing">Year of Passing:</label>
          <input
            id="yearOfPassing"
            type="number"
            value={yearOfPassing}
            onChange={(e) => setYearOfPassing(e.target.value)}
            required
          />

          <label htmlFor="reasonForApplying">
            Reason for applying T.C./L.C & Migration Certificate:
          </label>
          <input
            id="reasonForApplying"
            type="text"
            value={reasonForApplying}
            onChange={(e) => setReasonForApplying(e.target.value)}
            required
          />

          <label htmlFor="previousSchool">
            Previous School/College name before joining MIT-WPU:
          </label>
          <input
            id="previousSchool"
            type="text"
            value={previousSchool}
            onChange={(e) => setPreviousSchool(e.target.value)}
            required
          />

          <label htmlFor="previousCourse">Previous Course:</label>
          <input
            id="previousCourse"
            type="text"
            value={previousCourse}
            onChange={(e) => setPreviousCourse(e.target.value)}
            required
          />

          <label htmlFor="previousCollegePassingYear">Previous College Passing Year:</label>
          <input
            id="previousCollegePassingYear"
            type="number"
            value={previousCollegePassingYear}
            onChange={(e) => setPreviousCollegePassingYear(e.target.value)}
            required
            min="1900"
            max={new Date().getFullYear()}
            title={`Year should be between 1900 and ${new Date().getFullYear()}.`}
          />


          <label htmlFor="dateOfAdmission">
            Date of admission at MIT-WPU:
          </label>
          <input
            id="dateOfAdmission"
            type="date"
            value={dateOfAdmission}
            onChange={(e) => setDateOfAdmission(e.target.value)}
            required
          />

          <label htmlFor="dateOfLastAttendance">
            Date of Last attendance in MIT-WPU:
          </label>
          <input
            id="dateOfLastAttendance"
            type="date"
            value={dateOfLastAttendance}
            onChange={(e) => setDateOfLastAttendance(e.target.value)}
            required
          />

          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />

          <label htmlFor="statePlaceOfBirth">
            State, Place of Birth:
          </label>
          <input
            id="statePlaceOfBirth"
            type="text"
            value={statePlaceOfBirth}
            onChange={(e) => setStatePlaceOfBirth(e.target.value)}
            required
          />

          <label htmlFor="nationality">Nationality:</label>
          <input
            id="nationality"
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          />

          <label htmlFor="religion">Religion:</label>
          <input
            id="religion"
            type="text"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            required
          />

          <label htmlFor="casteSubCaste">Caste and Sub Caste:</label>
          <input
            id="casteSubCaste"
            type="text"
            value={casteSubCaste}
            onChange={(e) => setCasteSubCaste(e.target.value)}
            required
          />

          <label htmlFor="permanentAddress">Permanent Address:</label>
          <textarea
            id="permanentAddress"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            required
            maxLength={200}
            title="Address should not exceed 200 characters."
          />


          <label htmlFor="email">Email id:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="mobileNumber">Mobile number:</label>
          <input
            id="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            pattern="\d{10}"
            title="Mobile number should be a 10-digit number."
          />


          <label htmlFor="mothersName">Mother&apos;s Name:</label>
          <input
            id="mothersName"
            type="text"
            value={mothersName}
            onChange={(e) => setMothersName(e.target.value)}
            required
          />

          <label htmlFor="alternateMobileNumber">Alternate Mobile number:</label>
          <input
            id="alternateMobileNumber"
            type="tel"
            value={alternateMobileNumber}
            onChange={(e) => setAlternateMobileNumber(e.target.value)}
            pattern="\d{10}"
            title="Alternate mobile number should be a 10-digit number."
            placeholder="Optional"
          />


<label htmlFor="Prov_Cert">Provisional Certificate</label>
          <input
            id="Prov_Cert"
            type="file"
            accept=".pdf"
            onChange={(e) => setProv_Cert(e.target.files?.[0] || null)}
          />

          <label htmlFor="Marksheet">Marksheet</label>
          <input
            id="Marksheet"
            type="file"
            accept=".pdf"
            onChange={(e) => setMarksheet(e.target.files?.[0] || null)}
          />

          <label htmlFor="Fee_Receipt">Fee Receipt</label>
          <input
            id="Fee_Receipt"
            type="file"
            accept=".pdf"
            onChange={(e) => setFee_Receipt(e.target.files?.[0] || null)}
          />

          <label htmlFor="Prev_LC">Previous Leaving Certificate</label>
          <input
            id="Prev_LC"
            type="file"
            accept=".pdf"
            onChange={(e) => setPrev_LC(e.target.files?.[0] || null)}
          />

          <label htmlFor="ID_Card">ID Card</label>
          <input
            id="ID_Card"
            type="file"
            accept=".jpg,.jpeg"
            onChange={(e) => setID_Card(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </PageTransition>
  );
}
