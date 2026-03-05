import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-(--color-border)">
      <Link
        to="/"
        className="font-(family-name:--font-display) text-xl text-(--color-text-primary) tracking-wide italic"
      >
        James Li
      </Link>
      <div className="flex gap-10">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm tracking-widest uppercase transition-colors duration-200 ${
              location.pathname === link.to
                ? 'text-(--color-accent)'
                : 'text-(--color-text-muted) hover:text-(--color-text-primary)'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar