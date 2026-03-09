import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    // Placeholder — we'll wire this up to the API later
    setTimeout(() => setStatus('success'), 1000)
  }

  return (
    <div className="px-8 md:px-16 py-24">

      {/* Header */}
      <h1 className="font-(family-name:--font-display) text-[clamp(2.5rem,6vw,6rem)] leading-none text-(--color-text-primary) mb-6">
        Get in Touch
      </h1>
      <p className="text-(--color-text-muted) text-lg max-w-md leading-relaxed mb-24">
        Available for freelance projects and collaborations.
        Feel free to reach out.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-(--color-text-muted)">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-(--color-border) py-3 text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent) transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-(--color-text-muted)">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-(--color-border) py-3 text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent) transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-(--color-text-muted)">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="bg-transparent border-b border-(--color-border) py-3 text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent) transition-colors resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="self-start text-sm tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-1 hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

        </form>

        {/* Contact info */}
        <div className="flex flex-col gap-8 md:pt-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-(--color-text-muted) mb-3">
              Email
            </p>
            <a
              href="mailto:mgpanda@live.com"
              className="text-(--color-text-primary) hover:text-(--color-accent) transition-colors"
            >
              mgpanda@live.com
            </a>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-(--color-text-muted) mb-3">
              Based in
            </p>
            <p className="text-(--color-text-primary)">Kent, UK</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-(--color-text-muted) mb-3">
              Availability
            </p>
            <p className="text-(--color-text-primary)">Open to work</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact