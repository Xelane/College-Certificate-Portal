'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function AdminPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')


  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    fetch('/api/admin/applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.applications) {
          setError('Unauthorized or no data')
          return
        }
        setApplications(data.applications)
      })
      .catch((err) => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading admin panel...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  const filteredApps = applications.filter((app) =>
    filter === 'all' ? true : app.status === filter
  )

  return (
    <div className="min-h-screen bg-gray-100 text-black">
    <div className="p-6 max-w-6xl mx-auto">
    <div className="min-h-screen bg-gray-100 text-black p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear()
            router.push('/login')
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

      {filteredApps.length === 0 ? (
        <p>No applications found for selected filter.</p>
        ) : (
        <div className="grid gap-4">
            {filteredApps.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded shadow-sm border">
                <p className="font-semibold text-sm">
                {app.studentName} – {app.certificateType} – {app.department}
                </p>
                <p className="text-sm text-gray-600">
                Status: <span className="font-mono">{app.status}</span> – Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">Approvals:</p>
                <ul className="text-sm list-disc ml-5">
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

                {app.status === 'completed' && (
                <a
                    href={`/api/applications/${app._id}/certificate`}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                    📄 Download Certificate
                </a>
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

function formatDept(dept: string) {
  return dept
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
