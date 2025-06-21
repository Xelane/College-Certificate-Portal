export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">404 – Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn’t exist.
        </p>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
