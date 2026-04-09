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

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            How It Works
          </h2>
          <p className="text-neutral-500 mb-12">
            Book your tickets in three simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Find an Event", desc: "Browse thousands of concerts, sports, and festivals near you.", icon: "🔍" },
              { step: "02", title: "Choose Your Tickets", desc: "Select the ticket type and quantity that suits you.", icon: "🎟️" },
              { step: "03", title: "Secure Payment", desc: "Pay safely and receive your e-ticket instantly via email.", icon: "✅" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-neutral-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Are you an event organizer?
          </h2>
          <p className="text-neutral-400 mb-8">
            List your event on TiketKu and reach thousands of potential
            attendees across Indonesia.
          </p>
          <Link
            href="/organizer/create"
            className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            Create an Event →
          </Link>
        </div>
      </section>
    </>
  );
}
