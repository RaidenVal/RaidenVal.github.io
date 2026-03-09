function Footer() {
  return (
    <footer className="border-t border-(--color-border) px-8 md:px-16 py-8 mt-24">
      <div className="flex items-center justify-between">
        <p className="text-sm text-(--color-text-muted)">
          © {new Date().getFullYear()} James Li. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer