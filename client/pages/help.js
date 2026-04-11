import Head from "next/head";
import Link from "next/link";

const ARTICLES = [
  {
    category: "Getting Started",
    items: [
      { title: "How to create an account", href: "/faq#account" },
      { title: "How to search for events near you", href: "/faq#search" },
      { title: "How to buy a ticket step-by-step", href: "/faq#buy" },
      { title: "Understanding ticket types (VIP, Category 1, etc.)", href: "/faq#types" },
    ],
  },
  {
    category: "Your Tickets",
    items: [
      { title: "How to access your e-ticket", href: "/faq#eticket" },
      { title: "Transferring a ticket to another person", href: "/faq#transfer" },
      { title: "What to do if you didn't receive your ticket", href: "/faq#missing" },
      { title: "How to verify your ticket QR code at the venue", href: "/faq#qr" },
    ],
  },
  {
    category: "Payments",
    items: [
      { title: "Accepted payment methods", href: "/faq#payment" },
      { title: "Why was my payment declined?", href: "/faq#declined" },
      { title: "Understanding the service fee", href: "/faq#fees" },
      { title: "Secure payment — how your data is protected", href: "/faq#security" },
    ],
  },
  {
    category: "Refunds & Cancellations",
    items: [
      { title: "How to request a refund", href: "/refund" },
      { title: "What happens if an event is cancelled?", href: "/faq#cancelled" },
      { title: "Refund timelines", href: "/refund#timeline" },
      { title: "Non-refundable tickets — what are my options?", href: "/faq#nonrefundable" },
    ],
  },
  {
    category: "For Event Organizers",
    items: [
      { title: "How to list your event on TiketKu", href: "/organizer/create" },
      { title: "Setting per-user ticket limits", href: "/faq#limits" },
      { title: "Managing attendee check-in", href: "/faq#checkin" },
      { title: "When do I receive my payout?", href: "/faq#payout" },
    ],
  },
];

export default function HelpPage() {
  return (
    <>
      <Head>
        <title>Help Centre – TiketKu</title>
        <meta name="description" content="Find answers to your questions about TiketKu — tickets, payments, refunds, and more." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-blue-800 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Help Centre</h1>
          <p className="text-blue-100 text-base mb-8">
            Search our articles or browse by topic below.
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for help (e.g. &quot;refund&quot;, &quot;e-ticket&quot;)"
              className="w-full rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.map((section) => (
              <div key={section.category} className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                  {section.category}
                </h2>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary transition-colors group"
                      >
                        <span className="text-neutral-300 group-hover:text-primary transition-colors">›</span>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="bg-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Still need help?</h2>
          <p className="text-neutral-500 text-sm mb-6">
            Our support team is available Monday – Friday, 09:00 – 18:00 WIB.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm">
              Contact Support
            </Link>
            <Link href="/faq" className="border border-neutral-200 text-neutral-700 font-semibold px-6 py-3 rounded-full hover:bg-neutral-50 transition-colors text-sm">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
