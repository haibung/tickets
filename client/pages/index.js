import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchEvents } from "@/lib/api";

// Placeholder events shown when the API is unavailable
const PLACEHOLDER_EVENTS = [
  {
    id: "1",
    title: "Coldplay Music of the Spheres World Tour",
    date: "2025-05-15T19:00:00Z",
    location: "Gelora Bung Karno, Jakarta",
    price: 850000,
    category: "music",
    organizer: "Live Nation Indonesia",
  },
  {
    id: "2",
    title: "Java Jazz Festival 2025",
    date: "2025-06-01T10:00:00Z",
    location: "JIExpo Kemayoran, Jakarta",
    price: 500000,
    category: "music",
    organizer: "Java Festival Production",
  },
  {
    id: "3",
    title: "BRI Liga 1: Persija vs Persib",
    date: "2025-05-20T19:30:00Z",
    location: "Stadion GBK, Jakarta",
    price: 125000,
    category: "sports",
    organizer: "PT Liga Indonesia Baru",
  },
  {
    id: "4",
    title: "Jakarta Food & Music Festival",
    date: "2025-07-04T12:00:00Z",
    location: "Senayan City, Jakarta",
    price: 0,
    category: "festival",
    organizer: "Event Nusantara",
  },
  {
    id: "5",
    title: "Stand Up Comedy: Raditya Dika Live",
    date: "2025-05-30T20:00:00Z",
    location: "Balai Kartini, Jakarta",
    price: 350000,
    category: "comedy",
    organizer: "Majelis Lucu Indonesia",
  },
  {
    id: "6",
    title: "Bali Arts Festival",
    date: "2025-06-14T09:00:00Z",
    location: "Ardha Candra, Bali",
    price: 75000,
    category: "festival",
    organizer: "Pemerintah Provinsi Bali",
  },
];

const CATEGORIES = [
  { id: "music",   label: "Music",       icon: "♪" },
  { id: "sports",  label: "Sports",      icon: "⚡" },
  { id: "festival",label: "Festival",    icon: "✦" },
  { id: "theatre", label: "Theatre",     icon: "◈" },
  { id: "comedy",  label: "Comedy",      icon: "◉" },
  { id: "food",    label: "Food & Drink",icon: "◆" },
];

const WHY_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623C17.176 19.29 21 14.591 21 9c0-1.099-.14-2.165-.404-3.18" />
      </svg>
    ),
    title: "100% Verified Tickets",
    desc: "Every ticket is cryptographically signed and linked to your ID. Counterfeits are impossible.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant E-Ticket",
    desc: "Your ticket lands in your inbox in under 10 seconds after payment. No collection queues.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "No Hidden Fees",
    desc: "The price you see is the price you pay. Service fees shown upfront — always.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Hassle-Free Refunds",
    desc: "Event cancelled? Full refund in 24 hours — automatically, no forms needed.",
  },
];

const TESTIMONIALS = [
  {
    name: "Anisa R.",
    city: "Jakarta",
    quote: "Got my Coldplay tickets in literally 8 seconds. No queue, no stress. TiketKu is on another level.",
    initials: "AR",
  },
  {
    name: "Dimas P.",
    city: "Surabaya",
    quote: "Bought 4 tickets for different people — the attendee form made sure every name matched their ID. Super smooth.",
    initials: "DP",
  },
  {
    name: "Siti N.",
    city: "Bandung",
    quote: "Event was postponed. Refund hit my account the next day without me doing anything. Incredible.",
    initials: "SN",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Find your event",
    desc: "Browse thousands of concerts, sports matches, festivals, and more.",
  },
  {
    step: "02",
    title: "Book in seconds",
    desc: "Select seats, fill in attendee details, and pay securely with your preferred method.",
  },
  {
    step: "03",
    title: "Show up & enjoy",
    desc: "Your e-ticket arrives instantly. Scan at the gate and walk straight in.",
  },
];

export default function Home() {
  const [events, setEvents] = useState(PLACEHOLDER_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = selectedCategory !== "all" ? { category: selectedCategory } : {};
    setLoading(true);
    setError(null);
    fetchEvents(params)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.events ?? data?.data ?? [];
        if (list.length > 0) setEvents(list);
      })
      .catch(() => {
        setError("Unable to load live events. Showing sample events.");
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const displayedEvents =
    selectedCategory === "all"
      ? events
      : events.filter(
          (e) => e.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <>
      <Head>
        <title>TiketKu – Book Tickets for Live Events in Indonesia</title>
        <meta
          name="description"
          content="Find and book tickets for concerts, sports, festivals and more across Indonesia. Instant delivery, zero hidden fees."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Category pills ───────────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/events?category=${cat.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                <span className="text-base leading-none">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
            <Link
              href="/events"
              className="flex-shrink-0 ml-1 text-sm font-medium text-primary hover:underline whitespace-nowrap"
            >
              All events →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">On Sale Now</p>
              <h2 className="text-2xl font-extrabold text-neutral-900">
                {selectedCategory === "all"
                  ? "Upcoming Events"
                  : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`}
              </h2>
            </div>
            <Link
              href={selectedCategory === "all" ? "/events" : `/events?category=${selectedCategory}`}
              className="text-sm font-semibold text-primary hover:underline flex-shrink-0"
            >
              View all →
            </Link>
          </div>

          {/* Filter tabs */}
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 animate-pulse">
                  <div className="w-full aspect-[16/9] bg-neutral-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-100 rounded-full w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded-full w-1/2" />
                    <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
              </svg>
              <p className="font-medium text-neutral-500">No events found</p>
              <p className="text-sm mt-1">Try a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Simple by design</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-12">
            From browse to door in three steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {HOW_STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-neutral-100 -translate-x-1/2" />
                )}
                <span className="text-4xl font-black text-neutral-100 block mb-3">{s.step}</span>
                <h3 className="text-base font-bold text-neutral-800 mb-1">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why TiketKu ──────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-16 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The TiketKu difference</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Built for fans who deserve better
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary bg-opacity-10 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-neutral-800 mb-1.5">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof + Organizer CTA ─────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Testimonials */}
            <div className="rounded-2xl border border-neutral-100 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Real people</p>
              <h3 className="text-xl font-extrabold text-neutral-900 mb-7">What fans say</h3>
              <div className="space-y-6">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="flex gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-800">{t.name}</span>
                        <span className="text-xs text-neutral-400">{t.city}</span>
                        <span className="text-xs text-yellow-400 tracking-tighter">★★★★★</span>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer CTA */}
            <div className="bg-neutral-900 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">For organizers</p>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  Sell out your event —<br />not your soul
                </h3>
                <p className="text-neutral-400 text-sm mb-7 leading-relaxed">
                  Real-time sales dashboard, per-ticket attendee validation, configurable purchase limits, and same-day payouts.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Real-time sales & revenue dashboard",
                    "Configurable ticket limits per buyer",
                    "Automated attendee ID verification",
                    "Same-day payout to your bank account",
                    "Branded e-ticket with QR code",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-neutral-300">
                      <span className="text-primary font-bold text-base leading-none">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/organizer/create"
                  className="flex-1 text-center bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors text-sm"
                >
                  Create an Event →
                </Link>
                <Link
                  href="/about"
                  className="flex-1 text-center border border-neutral-700 text-neutral-300 font-medium px-6 py-3 rounded-full hover:border-neutral-500 hover:text-white transition-colors text-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter / CTA strip ───────────────────────────────────────── */}
      <section className="bg-neutral-900 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Never miss a show.</h2>
          <p className="text-neutral-400 text-sm mb-7">Get early access to the hottest events, exclusive pre-sales, and flash deals — straight to your inbox.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-neutral-600">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
