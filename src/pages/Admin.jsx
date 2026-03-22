import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken'))
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [projects, setProjects] = useState([])

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
        sessionStorage.setItem('adminToken', data.token)
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
    fetchProjects()
  }, [token])

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    if (res.ok) setProjects(data.projects)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: reader.result,
            filename: file.name,
          }),
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          setUploadError(uploadData.error)
          return
        }

        const createRes = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: uploadData.url }),
        })

        if (createRes.ok) {
          await fetchProjects()
          e.target.value = ''
        }
      } catch {
        setUploadError('Upload failed')
      } finally {
        setUploading(false)
      }
    }
  }

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
          Admin
        </h1>
        <button
          onClick={() => { sessionStorage.removeItem('adminToken'); setToken(null) }}
          className="text-sm tracking-widest uppercase text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Projects */}
      <div className="mb-16">
        <h2 className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-6">
          Works
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="flex items-center gap-4 border border-(--color-border) px-6 py-4 hover:border-(--color-accent) transition-colors group"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-12 h-12 object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-(--color-text-primary) group-hover:text-(--color-accent) transition-colors">
                  {p.title}
                </p>
                <p className="text-xs text-(--color-text-muted) mt-0.5">{p.category}</p>
              </div>
              <span className="text-xs tracking-widest uppercase text-(--color-text-muted) group-hover:text-(--color-accent) transition-colors shrink-0">
                Edit →
              </span>
            </Link>
          ))}
        </div>

        {/* Upload new image to create a project */}
        <div className="border border-dashed border-(--color-border) p-6">
          <p className="text-xs tracking-widest uppercase text-(--color-text-muted) mb-4">
            Upload image to add a work
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="text-sm text-(--color-text-muted) file:mr-4 file:py-2 file:px-4 file:border file:border-(--color-border) file:bg-transparent file:text-(--color-text-muted) file:text-xs file:tracking-widest file:uppercase hover:file:text-(--color-text-primary) file:transition-colors file:cursor-pointer"
          />
          {uploading && (
            <p className="text-sm text-(--color-text-muted) mt-4">Uploading...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-400 mt-4">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Submissions */}
      <div>
        <h2 className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-6">
          Contact Submissions
        </h2>
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
    </div>
  )
}

export default Admin
