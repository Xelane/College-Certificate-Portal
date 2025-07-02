'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
     
      // Redirect based on role
      if (data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-sm border w-full max-w-sm"
          >
            <h1 className="text-2xl font-bold mb-6">Login</h1>
           
            <div className="mb-4">
              <label className="text-sm block mb-1">Email</label>
              <input
                type="email"
                className="border rounded px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm block mb-1">Password</label>
              <input
                type="password"
                className="border rounded px-3 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-4 text-center">
            Check{' '}
            <a
              href="https://github.com/Xelane/College-Certificate-Portal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            {' '}for demo accounts
          </p>
        </div>
      </div>
    </div>
  )
}