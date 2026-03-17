import { motion } from 'framer-motion'

function ProjectCard({ project, index }) {
  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
    >
      <div className="overflow-hidden mb-4">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-(family-name:--font-display) text-lg text-(--color-text-primary) mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-(--color-text-muted)">
            {project.description}
          </p>
        </div>
        <span className="text-xs tracking-widest uppercase text-(--color-accent) mt-1 ml-4 shrink-0">
          {project.category}
        </span>
      </div>
    </motion.div>
  )
}

export default ProjectCard