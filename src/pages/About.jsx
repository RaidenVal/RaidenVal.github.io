function About() {
  const skills = [
    "Brand Identity", "Editorial Design", "Typography",
    "Illustration", "Procreate", "Adobe Illustrator",
    "Adobe Photoshop", "InDesign",
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
            Graphic Designer — Kent, UK
          </p>
          <p className="font-(family-name:--font-display) text-2xl text-(--color-text-primary) leading-relaxed mb-8">
            "Design is not just what it looks like. Design is how it works."
          </p>
          <p className="text-(--color-text-muted) leading-relaxed mb-6">
            James Li is a London-based graphic designer with a focus on brand identity
            and editorial design. He works with educational institutions, cultural
            organisations, and independent businesses to create visual identities
            that are considered, lasting, and distinct.
          </p>
          <p className="text-(--color-text-muted) leading-relaxed">
            Alongside his professional practice, James creates original character
            illustrations inspired by games and animation — a personal pursuit that
            informs the detail and craft he brings to all his work.
          </p>
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