import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            <span className="text-xl font-bold text-primary-600">
              TicketHub
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Events
            </Link>
            <Link
              href="/checkout"
              className="btn-primary text-sm px-4 py-2"
            >
              Buy Tickets
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/checkout"
              className="block px-4 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Buy Tickets
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
