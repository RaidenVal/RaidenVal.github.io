import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <Link to="/" className="text-lg font-semibold tracking-wide">
        Your Name
      </Link>
      <div className="flex gap-8">
        <Link to="/" className="text-sm hover:opacity-60 transition-opacity">Work</Link>
        <Link to="/about" className="text-sm hover:opacity-60 transition-opacity">About</Link>
        <Link to="/contact" className="text-sm hover:opacity-60 transition-opacity">Contact</Link>
      </div>
    </nav>
  )
}

export default Navbar