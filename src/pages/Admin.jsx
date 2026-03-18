import { useState, useEffect } from 'react'

function Admin() {
  const [token, setToken] = useState(null)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [generatedDesc, setGeneratedDesc] = useState(null)

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

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)
    setUploadError('')

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
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

        const data = await res.json()

        if (res.ok) {
          setUploadResult(data)
        } else {
          setUploadError(data.error)
        }
      } catch {
        setUploadError('Upload failed')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleGenerateDescription = async () => {
    if (!uploadResult) return
    setGeneratingDesc(true)
    setGeneratedDesc(null)

    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: uploadResult.url }),
      })

      const data = await res.json()
      if (res.ok) {
        setGeneratedDesc(data.description)
      }
    } catch {
      console.error('Failed to generate description')
    } finally {
      setGeneratingDesc(false)
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
          onClick={() => setToken(null)}
          className="text-sm tracking-widest uppercase text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-16">
        <h2 className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-6">
          Upload Image
        </h2>
        <div className="border border-(--color-border) p-6">
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
          {uploadResult && (
            <div className="mt-4 flex flex-col gap-3">
              <img
                src={uploadResult.url}
                alt="Uploaded"
                className="w-32 h-32 object-cover"
              />
              <p className="text-xs text-(--color-text-muted) break-all">
                URL: {uploadResult.url}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(uploadResult.url)}
                  className="self-start text-xs tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-0.5 hover:opacity-70 transition-opacity"
                >
                  Copy URL
                </button>
                <button
                  onClick={handleGenerateDescription}
                  disabled={generatingDesc}
                  className="self-start text-xs tracking-widest uppercase text-(--color-text-muted) border-b border-(--color-border) pb-0.5 hover:text-(--color-text-primary) transition-colors disabled:opacity-40"
                >
                  {generatingDesc ? 'Generating...' : 'Generate Description'}
                </button>
              </div>
              {generatedDesc && (
                <div className="border border-(--color-border) p-4 mt-2">
                  <p className="text-sm text-(--color-text-primary) leading-relaxed mb-3">
                    {generatedDesc}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedDesc)}
                    className="text-xs tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    Copy Description
                  </button>
                </div>
              )}
            </div>
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