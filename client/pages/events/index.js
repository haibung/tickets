import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { fetchEvents } from "@/lib/api";

const PLACEHOLDER_EVENTS = [
  { id: "1", title: "Coldplay Music of the Spheres World Tour", date: "2025-05-15T19:00:00Z", location: "Gelora Bung Karno, Jakarta", price: 850000, category: "music", organizer: "Live Nation Indonesia" },
  { id: "2", title: "Java Jazz Festival 2025", date: "2025-06-01T10:00:00Z", location: "JIExpo Kemayoran, Jakarta", price: 500000, category: "music", organizer: "Java Festival Production" },
  { id: "3", title: "BRI Liga 1: Persija vs Persib", date: "2025-05-20T19:30:00Z", location: "Stadion GBK, Jakarta", price: 125000, category: "sports", organizer: "PT Liga Indonesia Baru" },
  { id: "4", title: "Jakarta Food & Music Festival", date: "2025-07-04T12:00:00Z", location: "Senayan City, Jakarta", price: 0, category: "festival", organizer: "Event Nusantara" },
  { id: "5", title: "Stand Up Comedy: Raditya Dika Live", date: "2025-05-30T20:00:00Z", location: "Balai Kartini, Jakarta", price: 350000, category: "comedy", organizer: "Majelis Lucu Indonesia" },
  { id: "6", title: "Bali Arts Festival", date: "2025-06-14T09:00:00Z", location: "Ardha Candra, Bali", price: 75000, category: "festival", organizer: "Pemerintah Provinsi Bali" },
  { id: "7", title: "Djakarta Warehouse Project 2025", date: "2025-12-05T20:00:00Z", location: "JIExpo Kemayoran, Jakarta", price: 600000, category: "music", organizer: "ismaya live" },
  { id: "8", title: "Indonesia Open Badminton 2025", date: "2025-06-10T09:00:00Z", location: "Istora Senayan, Jakarta", price: 200000, category: "sports", organizer: "PBSI" },
  { id: "9", title: "Prambanan Jazz Festival", date: "2025-07-25T16:00:00Z", location: "Candi Prambanan, Yogyakarta", price: 450000, category: "music", organizer: "Rajawali Indonesia" },
];

const SORT_OPTIONS = [
  { value: "date_asc", label: "Date (Soonest)" },
  { value: "date_desc", label: "Date (Latest)" },
  { value: "price_asc", label: "Price (Low to High)" },
  { value: "price_desc", label: "Price (High to Low)" },
];

export default function EventsPage() {
  const router = useRouter();
  const { category: qCategory, search: qSearch } = router.query;

  const [events, setEvents] = useState(PLACEHOLDER_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_asc");
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    if (qCategory) setSelectedCategory(qCategory);
    if (qSearch) setSearchTitle(qSearch);
  }, [qCategory, qSearch]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (searchTitle) params.search = searchTitle;

    fetchEvents(params)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.events ?? data?.data ?? [];
        if (list.length > 0) setEvents(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, searchTitle]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    router.push(
      { pathname: "/events", query: { ...(cat !== "all" && { category: cat }) } },
      undefined,
      { shallow: true }
    );
  };

  const sortedEvents = [...events]
    .filter((e) =>
      selectedCategory === "all" || e.category?.toLowerCase() === selectedCategory
    )
    .filter((e) =>
      !searchTitle || e.title?.toLowerCase().includes(searchTitle.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <>
      <Head>
        <title>Browse Events – TiketKu</title>
        <meta name="description" content="Browse upcoming concerts, sports, festivals, and more." />
      </Head>

      <div className="bg-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-4">Browse Events</h1>
          <SearchBar />
        </div>
      </div>

      <CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-sm text-neutral-500">
            {loading ? "Loading..." : `${sortedEvents.length} event${sortedEvents.length !== 1 ? "s" : ""} found`}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-neutral-600 font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full aspect-[16/9] bg-neutral-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </>
  );
}
