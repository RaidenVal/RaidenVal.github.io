function About() {
  const skills = [
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Adobe InDesign",
    "Adobe Animate",
    "Adobe XD",
    "Easy Paint Tool SAI",
    "Brand Identity",
    "Digital Illustration",
    "Animation",
    "Web UI Concept",
  ]

  return (
    <div className="px-8 md:px-16 py-24">

      {/* Header */}
      <h1 className="font-(family-name:--font-display) text-[clamp(2.5rem,6vw,6rem)] leading-none text-(--color-text-primary) mb-24">
        About
      </h1>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">

        {/* Photo */}
        <div className="aspect-[3/4] bg-(--color-bg-secondary) overflow-hidden">
          <img
            src="https://placehold.co/600x800/292524/C9A96E?text=James"
            alt="James Li"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col justify-center">
          <p className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-6">
            Graphic Designer & Illustrator — Sittingbourne, Kent
          </p>
          <p className="font-(family-name:--font-display) text-2xl text-(--color-text-primary) leading-relaxed mb-8">
            Creating visual work that communicates with clarity, purpose, and craft.
          </p>
          <p className="text-(--color-text-muted) leading-relaxed mb-6">
            James Li is a graphic designer and illustrator with over seven years of experience
            across branding, editorial, animation, and web UI. Currently part of the marketing
            team at Leigh Academy Trust, he works on brand projects, animated advertisements,
            and a wide range of visual communication design.
          </p>
          <p className="text-(--color-text-muted) leading-relaxed mb-6">
            He graduated from the University of Kent and has experience working with
            Lightmaker on promotional content for social platforms.
          </p>
          <p className="text-(--color-text-muted) leading-relaxed">
            Alongside his professional work, James creates original character illustrations
            and digital art — a personal practice that sharpens the detail and precision
            he brings to every project.
          </p>
        </div>
      </div>

      {/* Experience */}
      <div className="border-t border-(--color-border) pt-16 mb-16">
        <p className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-10">
          Experience
        </p>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <p className="text-(--color-text-muted) text-sm">2018 — Present</p>
            <div>
              <p className="text-(--color-text-primary) mb-1">Graphic Designer & Illustrator</p>
              <p className="text-(--color-text-muted) text-sm">Leigh Academy Trust</p>
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <p className="text-(--color-text-muted) text-sm">2017</p>
            <div>
              <p className="text-(--color-text-primary) mb-1">Design Intern</p>
              <p className="text-(--color-text-muted) text-sm">Lightmaker</p>
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <p className="text-(--color-text-muted) text-sm">2017</p>
            <div>
              <p className="text-(--color-text-primary) mb-1">BA Graphic Design</p>
              <p className="text-(--color-text-muted) text-sm">University of Kent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="border-t border-(--color-border) pt-16">
        <p className="text-sm tracking-widest uppercase text-(--color-text-muted) mb-8">
          Skills & Tools
        </p>
        <div className="flex flex-wrap gap-3">
          {skills.map(skill => (
            <span
              key={skill}
              className="text-sm text-(--color-text-primary) border border-(--color-border) px-4 py-2"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default About