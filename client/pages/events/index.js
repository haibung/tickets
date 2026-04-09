import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EventCard from "../../components/EventCard";
import { getEvents } from "../../lib/api";

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
    price: 35.0,
    category: "Jazz",
    availableTickets: 0,
  },
  {
    id: "4",
    title: "Electronic Nights",
    artist: "DJ Tiësto",
    date: "2025-10-10T22:00:00Z",
    venue: "XS Nightclub",
    city: "Las Vegas",
    price: 75.0,
    category: "Electronic",
    availableTickets: 100,
  },
  {
    id: "5",
    title: "Classical Gala",
    artist: "Vienna Philharmonic",
    date: "2025-11-01T19:00:00Z",
    venue: "Carnegie Hall",
    city: "New York",
    price: 120.0,
    category: "Classical",
    availableTickets: 30,
  },
  {
    id: "6",
    title: "Pop Spectacular",
    artist: "Taylor Swift",
    date: "2025-12-05T20:00:00Z",
    venue: "Staples Center",
    city: "Los Angeles",
    price: 150.0,
    category: "Pop",
    availableTickets: 500,
  },
];

const CATEGORIES = ["All", "Concert", "Festival", "Jazz", "Electronic", "Classical", "Pop"];

export default function EventsPage() {
  const [events, setEvents] = useState(PLACEHOLDER_EVENTS);
  const [filtered, setFiltered] = useState(PLACEHOLDER_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
          setFiltered(data);
        }
      })
      .catch(() => {
        setError("Could not load live events. Showing sample data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply search + category filters client-side
  useEffect(() => {
    let result = events;
    if (category !== "All") {
      result = result.filter((e) => e.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.artist.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, category, events]);

  return (
    <>
      <Head>
        <title>Browse Events – TicketHub</title>
        <meta
          name="description"
          content="Browse all upcoming concerts and events. Filter by category or search by name."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          {/* Header */}
          <section className="bg-gradient-to-r from-primary-600 to-purple-700 text-white py-12">
            <div className="container-main text-center">
              <h1 className="text-4xl font-bold mb-3">Browse Events</h1>
              <p className="text-primary-100">
                Find your next unforgettable live experience
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
            <div className="container-main flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search events, artists, cities…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      category === cat
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Events grid */}
          <section className="py-12 bg-gray-50">
            <div className="container-main">
              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
