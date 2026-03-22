import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const adminToken = sessionStorage.getItem('adminToken')
  const isAdmin = Boolean(adminToken)

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setProject(data.project)
        setEditTitle(data.project.title)
        setEditDescription(data.project.description ?? '')
        setEditCategory(data.project.category)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  const handleGenerateDescription = async () => {
    if (!project?.image) return
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ imageUrl: project.image }),
      })
      const data = await res.json()
      if (res.ok) setEditDescription(data.description)
    } catch {
      // silently fail — user can try again
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: editTitle, description: editDescription, category: editCategory }),
      })
      const data = await res.json()
      if (res.ok) {
        setProject(data.project)
        setEditing(false)
      } else {
        setSaveError(data.error || 'Save failed')
      }
    } catch {
      setSaveError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (res.ok) navigate('/')
    } catch {
      // ignore — user stays on page
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(project.title)
    setEditDescription(project.description ?? '')
    setEditCategory(project.category)
    setSaveError('')
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-(--color-text-muted)">Loading...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-(--color-text-muted)">Work not found.</p>
        <Link
          to="/"
          className="text-sm tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-1 hover:opacity-70 transition-opacity"
        >
          Back to work
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 md:px-16 py-24">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs tracking-widest uppercase text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors mb-16"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-square object-cover"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <span className="text-xs tracking-widest uppercase text-(--color-accent)">
            {project.category}
          </span>

          {editing ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="font-(family-name:--font-display) text-3xl md:text-4xl text-(--color-text-primary) bg-transparent border-b border-(--color-border) focus:outline-none focus:border-(--color-accent) transition-colors pb-1"
              />
              <div className="flex gap-4">
                {['Professional', 'Illustration'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditCategory(cat)}
                    className={`text-xs tracking-widest uppercase transition-colors ${
                      editCategory === cat
                        ? 'text-(--color-accent)'
                        : 'text-(--color-text-muted) hover:text-(--color-text-primary)'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={6}
                  className="text-(--color-text-muted) leading-relaxed bg-transparent border border-(--color-border) p-3 focus:outline-none focus:border-(--color-accent) transition-colors resize-none text-sm"
                />
                <button
                  onClick={handleGenerateDescription}
                  disabled={generating || !project.image}
                  className="self-start text-xs tracking-widest uppercase text-(--color-text-muted) border-b border-(--color-border) pb-0.5 hover:text-(--color-text-primary) transition-colors disabled:opacity-40"
                >
                  {generating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              {saveError && <p className="text-sm text-red-400">{saveError}</p>}
              <div className="flex gap-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-sm tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-1 hover:opacity-70 transition-opacity disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-sm tracking-widest uppercase text-(--color-text-muted) border-b border-(--color-border) pb-1 hover:text-(--color-text-primary) transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-(family-name:--font-display) text-3xl md:text-4xl text-(--color-text-primary)">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-(--color-text-muted) leading-relaxed">
                  {project.description}
                </p>
              )}
              {isAdmin && (
                <div className="flex gap-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs tracking-widest uppercase text-(--color-text-muted) border-b border-(--color-border) pb-0.5 hover:text-(--color-text-primary) transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-xs tracking-widest uppercase text-red-400 border-b border-red-400/40 pb-0.5 hover:opacity-70 transition-opacity disabled:opacity-40"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectDetail
