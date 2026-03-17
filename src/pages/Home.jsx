import { useState } from 'react'
import { projects } from '../data/projects'
import ProjectCard from '../components/ProjectCard'

const categories = ['All', 'Professional', 'Illustration']

function Home() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category === active)

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-24 border-b border-(--color-border)">
        <p className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-6">
          Graphic Designer & Illustrator — Sittingbourne, Kent
        </p>
        <h1 className="font-(family-name:--font-display) text-[clamp(3.5rem,10vw,9rem)] leading-none tracking-tight text-(--color-text-primary) mb-8">
          James<br />Li.
        </h1>
        <p className="text-(--color-text-muted) text-lg max-w-md leading-relaxed mb-12">
          Brand identity, animation, and digital illustration.
          Currently at Leigh Academy Trust, creating work that communicates with clarity and purpose.
        </p>
        <a
          href="#work"
          className="self-start text-sm tracking-widest uppercase text-(--color-accent) border-b border-(--color-accent) pb-1 hover:opacity-70 transition-opacity"
        >
          View Work
        </a>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-8 md:px-16 py-24">
        <div className="flex flex-col gap-6 mb-16 md:flex-row md:items-center md:justify-between">
          <h2 className="font-(family-name:--font-display) text-3xl text-(--color-text-primary)">
            Selected Work
          </h2>
          <div className="flex gap-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`text-xs tracking-widest uppercase transition-colors duration-200 ${
                  active === cat
                    ? 'text-(--color-accent)'
                    : 'text-(--color-text-muted) hover:text-(--color-text-primary)'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home