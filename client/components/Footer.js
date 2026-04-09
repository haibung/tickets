import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Centre", href: "/help" },
    { label: "FAQs", href: "/faq" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  Events: [
    { label: "All Events", href: "/events" },
    { label: "Music", href: "/events?category=music" },
    { label: "Sports", href: "/events?category=sports" },
    { label: "Festival", href: "/events?category=festival" },
  ],
  "For Organizers": [
    { label: "Create Event", href: "/organizer/create" },
    { label: "Manage Events", href: "/organizer/dashboard" },
    { label: "Pricing", href: "/organizer/pricing" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-extrabold text-white">
                Tiket<span className="text-primary">Ku</span>
              </span>
            </Link>
            <p className="text-neutral-200 text-sm leading-relaxed mb-4">
              Your trusted platform for discovering and booking tickets to
              concerts, sports, and live events across Indonesia.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              {["instagram", "twitter", "facebook"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social}
                  className="w-9 h-9 rounded-full bg-neutral-700 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-200 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-neutral-200 text-sm">
            © {new Date().getFullYear()} TiketKu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-neutral-200 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-neutral-200 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
