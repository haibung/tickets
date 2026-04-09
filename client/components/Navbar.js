import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/events", label: "Browse Events" },
    { href: "/events?category=music", label: "Music" },
    { href: "/events?category=sports", label: "Sports" },
    { href: "/events?category=festival", label: "Festival" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-primary">
                Tiket<span className="text-secondary">Ku</span>
              </span>
            </Link>
          </div>

          {/* Desktop search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-8 max-w-xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, concerts, sports..."
                className="w-full pl-4 pr-12 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-primary"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  router.pathname === link.href
                    ? "text-primary"
                    : "text-neutral-700 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 space-y-3">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-4 pr-12 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary rounded-md"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 px-4 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm font-medium border border-primary text-primary py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
