import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { getEvents } from "../lib/api";

// Placeholder events used when the API is unreachable during development
const PLACEHOLDER_EVENTS = [
  {
    id: "1",
    title: "Summer Music Festival 2025",
    artist: "Various Artists",
    date: "2025-07-15T18:00:00Z",
    venue: "Central Park Amphitheater",
    city: "New York",
    price: 49.99,
    category: "Festival",
    availableTickets: 200,
  },
  {
    id: "2",
    title: "Rock the Night",
    artist: "The Rolling Stones",
    date: "2025-08-20T20:00:00Z",
    venue: "Madison Square Garden",
    city: "New York",
    price: 89.99,
    category: "Concert",
    availableTickets: 50,
  },
  {
    id: "3",
    title: "Jazz Under the Stars",
    artist: "Miles Davis Tribute",
    date: "2025-09-05T19:30:00Z",
    venue: "Blue Note Jazz Club",
    city: "Chicago",
    price: 35.00,
    category: "Jazz",
    availableTickets: 0,
  },
];

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState(PLACEHOLDER_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEvents({ limit: 6 })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedEvents(data);
        }
      })
      .catch(() => {
        // API unreachable – keep placeholder data, surface a soft warning
        setError("Could not load live events. Showing sample data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>TicketHub – Book Concert Tickets Online</title>
        <meta
          name="description"
          content="Discover and book tickets for the best concerts and events near you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-9xl">🎵</div>
              <div className="absolute bottom-10 right-10 text-9xl">🎤</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">
                🎸
              </div>
            </div>

            <div className="container-main relative py-20 sm:py-28 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Your Next Concert
                <br />
                <span className="text-accent-500">Starts Here</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10">
                Discover thousands of live events and book your tickets in
                seconds. From rock to jazz – we&apos;ve got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-base px-8 py-4">
                  Browse Events
                </Link>
                <a href="#featured" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/20 text-base px-8 py-4">
                  Featured Shows
                </a>
              </div>
            </div>
          </section>

          {/* ── Stats strip ───────────────────────────────────────────────── */}
          <section className="bg-white border-b border-gray-100">
            <div className="container-main py-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {[
                  { value: "10K+", label: "Events Listed" },
                  { value: "500K+", label: "Tickets Sold" },
                  { value: "200+", label: "Cities" },
                  { value: "4.9★", label: "Customer Rating" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-extrabold text-primary-600">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Featured Events ───────────────────────────────────────────── */}
          <section id="featured" className="py-16 bg-gray-50">
            <div className="container-main">
              <div className="flex items-center justify-between mb-8">
                <h2 className="section-title">Featured Events</h2>
                <Link href="/events" className="text-primary-600 font-semibold hover:underline text-sm">
                  View all →
                </Link>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <section className="bg-primary-600 text-white py-16">
            <div className="container-main text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Never Miss a Show
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Sign up to get personalized event recommendations and
                exclusive early-bird deals delivered straight to your inbox.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button type="submit" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 px-6 py-3">
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
