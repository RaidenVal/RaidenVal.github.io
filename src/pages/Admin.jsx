import { useState, useEffect } from 'react'

function Admin() {
  const [token, setToken] = useState(null)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        setToken(data.token)
      } else {
        setLoginError(data.error)
      }
    } catch {
      setLoginError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return

    const fetchSubmissions = async () => {
      const res = await fetch('/api/admin/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setSubmissions(data.submissions)
    }

    fetchSubmissions()
  }, [token])

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <h1 className="font-(family-name:--font-display) text-3xl text-(--color-text-primary) mb-8">
            Admin
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-(--color-text-muted)">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-b border-(--color-border) py-3 text-(--color-text-primary) focus:outline-none focus:border-(--color-accent) transition-colors"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="self-start text-sm tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-1 hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="px-8 md:px-16 py-24">
      <div className="flex items-center justify-between mb-16">
        <h1 className="font-(family-name:--font-display) text-3xl text-(--color-text-primary)">
          Contact Submissions
        </h1>
        <button
          onClick={() => setToken(null)}
          className="text-sm tracking-widest uppercase text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
        >
          Sign Out
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="text-(--color-text-muted)">No submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="border border-(--color-border) p-6 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-(--color-text-primary) font-medium">{s.name}</p>
                  <a
                    href={`mailto:${s.email}`}
                    className="text-sm text-(--color-accent) hover:opacity-70 transition-opacity"
                  >
                    {s.email}
                  </a>
                </div>
                <p className="text-xs text-(--color-text-muted)">
                  {new Date(s.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <p className="text-(--color-text-muted) text-sm leading-relaxed border-t border-(--color-border) pt-3">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin