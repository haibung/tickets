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

const FEATURED_CATEGORIES = [
  { id: "music", label: "Music", icon: "🎵", color: "from-purple-600 to-purple-800" },
  { id: "sports", label: "Sports", icon: "⚽", color: "from-green-600 to-green-800" },
  { id: "festival", label: "Festival", icon: "🎉", color: "from-yellow-500 to-yellow-700" },
  { id: "theatre", label: "Theatre", icon: "🎭", color: "from-blue-600 to-blue-800" },
  { id: "comedy", label: "Comedy", icon: "😂", color: "from-orange-500 to-orange-700" },
  { id: "food", label: "Food & Drink", icon: "🍜", color: "from-red-600 to-red-800" },
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
        <title>TiketKu – Discover &amp; Book Amazing Events</title>
        <meta
          name="description"
          content="Find and book tickets for concerts, sports, festivals and more across Indonesia."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero */}
      <HeroSection />

      {/* Category icons */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-neutral-800 mb-6">
            Explore by Category
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/events?category=${cat.id}`}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-br ${cat.color} text-white hover:opacity-90 transition-opacity`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions banner */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div>
              <h2 className="text-xl font-bold mb-1">
                🔥 Flash Sale – Up to 30% Off!
              </h2>
              <p className="text-sm opacity-90">
                Limited time offer on selected events. Grab your tickets now.
              </p>
            </div>
            <Link
              href="/events?sale=true"
              className="flex-shrink-0 bg-white text-primary font-bold px-6 py-2.5 rounded-full text-sm hover:bg-neutral-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Events listing */}
      <section className="bg-neutral-50 pb-16">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-800">
              {selectedCategory === "all"
                ? "Upcoming Events"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`}
            </h2>
            <Link
              href={
                selectedCategory === "all"
                  ? "/events"
                  : `/events?category=${selectedCategory}`
              }
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="w-full aspect-[16/9] bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                    <div className="h-3 bg-neutral-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z"
                />
              </svg>
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm mt-1">Try a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why TiketKu — differentiator section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary bg-opacity-10 px-4 py-1.5 rounded-full mb-4">
              The TiketKu Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 mb-3">
              Built for fans who deserve better
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              We rebuilt ticketing from scratch — no hidden fees, no scalpers,
              no last-minute surprises. Just real tickets, delivered instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🛡️",
                title: "100% Verified Tickets",
                desc: "Every ticket is cryptographically signed and linked to your ID. Fakes are impossible.",
                accent: "from-blue-500 to-blue-700",
              },
              {
                icon: "⚡",
                title: "Instant Delivery",
                desc: "Your e-ticket lands in your inbox in under 10 seconds after payment — no collection queues.",
                accent: "from-yellow-400 to-orange-500",
              },
              {
                icon: "💸",
                title: "Zero Hidden Fees",
                desc: "The price you see is the price you pay. Service fee shown upfront, always. No checkout surprises.",
                accent: "from-green-500 to-emerald-600",
              },
              {
                icon: "🔄",
                title: "Hassle-Free Refunds",
                desc: "Event cancelled? Get a full refund processed in 24 hours — automatically, no forms needed.",
                accent: "from-purple-500 to-purple-700",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${item.accent}`} />
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-base font-bold text-neutral-800 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof + organizer split */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Fan testimonials */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">What Fans Say</span>
              <h3 className="text-xl font-extrabold text-neutral-800 mb-6">Real stories, real people</h3>
              <div className="space-y-5">
                {[
                  {
                    name: "Anisa R.",
                    city: "Jakarta",
                    rating: 5,
                    quote: "Got my Coldplay tickets in literally 8 seconds. No queue, no stress. TiketKu is on another level.",
                    avatar: "AR",
                  },
                  {
                    name: "Dimas P.",
                    city: "Surabaya",
                    rating: 5,
                    quote: "Bought 4 tickets for different people — the attendee form made sure every name matched their ID. Super smooth.",
                    avatar: "DP",
                  },
                  {
                    name: "Siti N.",
                    city: "Bandung",
                    rating: 5,
                    quote: "Event was postponed. Refund hit my account the next day without me doing anything. Incredible.",
                    avatar: "SN",
                  },
                ].map((t) => (
                  <div key={t.name} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-800">{t.name}</span>
                        <span className="text-xs text-neutral-400">{t.city}</span>
                        <span className="text-xs text-yellow-400">{"★".repeat(t.rating)}</span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer power tools */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 shadow-sm text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">For Organizers</span>
                <h3 className="text-xl font-extrabold mb-3">
                  Sell out your event — <br />not your soul
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Everything a modern event organizer needs: real-time sales dashboard,
                  per-ticket attendee validation, configurable purchase limits, and same-day payouts.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Real-time sales & revenue dashboard",
                    "Configurable ticket limits per buyer",
                    "Automated attendee ID verification",
                    "Same-day payout to your bank",
                    "Branded ticket QR codes",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-neutral-300">
                      <span className="text-primary font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/organizer/create"
                  className="flex-1 text-center bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm"
                >
                  Create an Event →
                </Link>
                <Link
                  href="/about"
                  className="flex-1 text-center border border-neutral-600 text-neutral-300 font-semibold px-6 py-3 rounded-full hover:border-white hover:text-white transition-colors text-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
