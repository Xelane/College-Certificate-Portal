# 🏫 College Certificate Portal

A full-stack web app for managing student certificate requests (e.g., Bonafide, Domicile, Leaving Certificate).  
Built with **Next.js 15 App Router**, **Node.js**, **MongoDB**, and **PDF generation**.

👉 **Live Demo:** [https://college-certificate-portal-qlgf.vercel.app](https://college-certificate-portal-qlgf.vercel.app)

---

## ✨ Features

- 🎓 Student portal to submit applications for official documents
- 🧑‍🏫 Department-wise faculty verification (library, hostel, gym, dean, etc.)
- 📄 Auto-generated PDF certificate on final approval
- 🧑‍💼 Admin dashboard to view all applications
- 🔐 Role-based login: Student / Faculty / Admin
- ✅ Status tracking with approval history and dates
- ⚡ Built with modern tech (Next.js App Router, API Routes, Tailwind CSS)

---

## 🚀 Tech Stack

- **Frontend:** React + Next.js 15 (App Router)
- **Backend:** Node.js API Routes
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)
- **Styling:** Tailwind CSS
- **PDF Generation:** `pdf-lib`

---

## 🔐 Demo Logins

> These accounts are already created for demo purposes.

### 🔹 Student

- **Email:** `student@demo.com`  
- **Password:** `test123`

### 🔹 Faculty Accounts

| Department       | Email                    | Password  |
|------------------|--------------------------|-----------|
| Library          | `library@college.com`    | `test123` |
| Gym              | `gym@college.com`        | `test123` |
| Dean             | `dean@college.com`       | `test123` |
| Program Office   | `program@college.com`    | `test123` |
| Hostel           | `hostel@college.com`     | `test123` |

### 🔹 Admin

- **Email:** `admin@college.com`  
- **Password:** `test123`

---

## 🧪 Running Locally

```bash
git clone https://github.com/Xelane/College-Certificate-Portal.git
cd College-Certificate-Portal
npm install

# Create .env.local with:
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>

npm run dev
```
