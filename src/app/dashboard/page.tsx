'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function formatDept(dept: string) {
  return dept
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

interface Application {
  _id: string
  studentName: string
  department: string
  certificateType: string
  status: string
  submittedAt: string
  approvals: {
    department: string
    approved: boolean
    verifiedAt: string | null
  }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')


  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')
    setRole(userRole)

    if (!token || !userRole) {
      router.push('/login')
      return
    }

    fetch('/api/applications', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data.applications || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching applications:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4">Loading dashboard...</p>

    const filteredApps = applications.filter((app) =>
        filter === 'all' ? true : app.status === filter
    )

  return (
    <div className="min-h-screen bg-gray-100 text-black">
    <div className="p-6 max-w-4xl mx-auto">
    <div className="min-h-screen bg-gray-100 text-black p-6 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
            {role === 'student' ? 'Your Applications' : 'Pending Applications'}
        </h1>
        <button
            onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            window.location.href = '/login'
            }}
            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
            Logout
        </button>
        </div>

        {applications.length > 0 && (
        <div className="mb-4">
            <label className="mr-2 text-sm">Filter by status:</label>
            <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
            >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            </select>
        </div>
        )}

      {role === 'student' && (
        <NewApplicationForm onSubmitted={() => location.reload()} />
      )}
        
    {filteredApps.length === 0 ? (
    <p className="text-gray-500">No applications found for selected filter.</p>
    ) : (
    <div className="space-y-4">
        {filteredApps.map((app) => (
        <div key={app._id} className="bg-white p-4 rounded shadow-sm border">
            {/* Your existing rendering logic inside each application card */}
            {/* For example: */}
            <p className="font-semibold">
            {role === 'faculty' && <span>{app.studentName} – </span>}
            {app.certificateType} – {app.department}
            </p>

            <p className="text-sm text-gray-600">
            Status: {app.status} – Submitted on: {new Date(app.submittedAt).toLocaleDateString()}
            </p>

            {/* Approvals list */}
            {role === 'student' && (
            <ul className="text-sm mt-2 list-disc ml-4">
                {app.approvals.map((a, i) => (
                <li key={i} className={a.approved ? 'text-green-600' : 'text-gray-600'}>
                    {formatDept(a.department)} – {a.approved ? '✔ Verified' : '❌ Pending'}
                    {a.verifiedAt && (
                    <span className="ml-2 text-xs text-gray-500">
                        (on {new Date(a.verifiedAt).toLocaleDateString()})
                    </span>
                    )}
                </li>
                ))}
            </ul>
            )}

            {/* Certificate Download */}
            {role === 'student' && app.status === 'completed' && (
            <a
                href={`/api/applications/${app._id}/certificate`}
                target="_blank"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm"
            >
                📄 Download Certificate
            </a>
            )}

            {/* Faculty Verify Buttons */}
            {role === 'faculty' && (
            <div className="mt-2 flex gap-2">
                <VerifyButtons applicationId={app._id} />
            </div>
            )}
        </div>
        ))}
    </div>
    )}
    </div>
    </div>
    </div>
  )
}

function VerifyButtons({ applicationId }: { applicationId: string }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const verify = async () => {
    const res = await fetch(`/api/applications/${applicationId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    location.reload()
  }

  const reject = async () => {
    const res = await fetch(`/api/applications/${applicationId}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    location.reload()
  }

  return (
    <>
      <button
        onClick={verify}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
      >
        Verify
      </button>
      <button
        onClick={reject}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
      >
        Reject
      </button>
    </>
  )
}

function NewApplicationForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({
    studentName: '',
    department: '',
    certificateType: 'Bonafide'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Error')
        return
      }

      onSubmitted()
    } catch (err) {
      setError('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">New Application</h2>

      <div className="mb-2">
        <label className="text-sm block">Your Full Name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={form.studentName}
          onChange={(e) => setForm({ ...form, studentName: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="text-sm block">Your Department</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="text-sm block">Certificate Type</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={form.certificateType}
          onChange={(e) => setForm({ ...form, certificateType: e.target.value })}
        >
          <option value="Bonafide">Bonafide</option>
          <option value="Domicile">Domicile</option>
          <option value="Leaving">Leaving</option>
          <option value="Transfer">Transfer</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
