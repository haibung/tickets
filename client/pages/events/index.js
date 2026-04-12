import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { fetchEvents } from "@/lib/api";

const PLACEHOLDER_EVENTS = [
  { id: "1",  image: null, title: "ARTJOG 2025 – MOTIF: AMALAN",              date: "2025-06-20T09:00:00Z", location: "Jogja National Museum, Yogyakarta", price: 50000,  category: "Seni",       featured: true,  rating: 4.8, attendees: 1250 },
  { id: "2",  image: null, title: "Konser Maestro Yogyakarta Gaming Festival",  date: "2025-07-23T19:00:00Z", location: "Yogyakarta",                        price: 70000,  category: "Gaming",     featured: false, rating: 4.6, attendees: 890  },
  { id: "3",  image: null, title: "YUK MARI HIPHOP VOL.3",                     date: "2025-07-25T20:00:00Z", location: "Bandung",                           price: 50000,  category: "Hip Hop",    featured: true,  rating: 4.7, attendees: 650  },
  { id: "4",  image: null, title: "VISIBLE TIME Art Exhibition",               date: "2025-07-25T10:00:00Z", location: "Jakarta",                           price: 89000,  category: "Seni",       featured: false, rating: 4.5, attendees: 420  },
  { id: "5",  image: null, title: "Festival Kopi Tanah Para Raja 2025",        date: "2025-07-25T08:00:00Z", location: "Bali",                              price: 200000, category: "Festival",   featured: true,  rating: 4.9, attendees: 2100 },
  { id: "6",  image: null, title: "NEON LIGHT FESTIVAL 2025",                  date: "2025-07-27T18:00:00Z", location: "Surabaya",                          price: 120000, category: "Festival",   featured: true,  rating: 4.8, attendees: 1800 },
  { id: "7",  image: null, title: "Jazz Under The Stars",                      date: "2025-07-30T19:30:00Z", location: "Jakarta",                           price: 85000,  category: "Jazz",       featured: false, rating: 4.6, attendees: 320  },
  { id: "8",  image: null, title: "Indie Music Showcase",                      date: "2025-08-05T18:00:00Z", location: "Bandung",                           price: 65000,  category: "Indie",      featured: false, rating: 4.4, attendees: 280  },
  { id: "9",  image: null, title: "Electronic Dance Paradise",                 date: "2025-08-08T21:00:00Z", location: "Bali",                              price: 150000, category: "EDM",        featured: true,  rating: 4.7, attendees: 1500 },
  { id: "10", image: null, title: "Rock Revolution Concert",                   date: "2025-08-12T19:00:00Z", location: "Surabaya",                          price: 95000,  category: "Rock",       featured: false, rating: 4.5, attendees: 750  },
  { id: "11", image: null, title: "Pop Music Extravaganza",                    date: "2025-08-15T18:00:00Z", location: "Yogyakarta",                        price: 110000, category: "Pop",        featured: true,  rating: 4.8, attendees: 950  },
  { id: "12", image: null, title: "Traditional Music Festival",                date: "2025-08-18T10:00:00Z", location: "Jakarta",                           price: 75000,  category: "Tradisional",featured: false, rating: 4.6, attendees: 580  },
];

const ALL_LOCATIONS = ["Semua Lokasi", "Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Bali"];

const SORT_OPTIONS = [
  { value: "tanggal",      label: "Tanggal Terdekat" },
  { value: "harga-rendah", label: "Harga Terendah"   },
  { value: "harga-tinggi", label: "Harga Tertinggi"  },
  { value: "rating",       label: "Rating Terbaik"   },
  { value: "popular",      label: "Paling Diminati"  },
];

const EVENTS_PER_PAGE = 8;

const CATEGORY_COLORS = {
  Seni:        "bg-blue-100 text-blue-700",
  Gaming:      "bg-purple-100 text-purple-700",
  "Hip Hop":   "bg-yellow-100 text-yellow-700",
  Festival:    "bg-orange-100 text-orange-700",
  Jazz:        "bg-indigo-100 text-indigo-700",
  Indie:       "bg-pink-100 text-pink-700",
  EDM:         "bg-cyan-100 text-cyan-700",
  Rock:        "bg-red-100 text-red-700",
  Pop:         "bg-rose-100 text-rose-700",
  Tradisional: "bg-green-100 text-green-700",
};

function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < full ? "text-yellow-400" : half && i === full ? "text-yellow-300" : "text-neutral-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-neutral-500 font-medium">{rating}</span>
    </span>
  );
}

function JelajahCard({ event }) {
  const { id, image, title, date, location, price, category, featured, rating, attendees } = event;

  const dateObj    = date ? new Date(date) : null;
  const dayNum     = dateObj ? dateObj.toLocaleDateString("id-ID", { day: "numeric" }) : null;
  const monthStr   = dateObj ? dateObj.toLocaleDateString("id-ID", { month: "short" }).toUpperCase() : null;
  const fullDate   = dateObj ? dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "TBA";

  const formattedPrice =
    price === 0 || price === "0"
      ? "Gratis"
      : price
      ? `Rp ${Number(price).toLocaleString("id-ID")}`
      : "Harga TBA";

  const catColor = CATEGORY_COLORS[category] || "bg-neutral-100 text-neutral-600";

  return (
    <Link href={`/events/${id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
              </svg>
            </div>
          )}

          {/* Date chip */}
          {dateObj && (
            <div className="absolute top-3 left-3 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center w-10 h-12 leading-none">
              <span className="text-[9px] font-bold text-primary uppercase">{monthStr}</span>
              <span className="text-base font-extrabold text-neutral-800 -mt-0.5">{dayNum}</span>
            </div>
          )}

          {/* Featured badge */}
          {featured && (
            <span className="absolute top-3 right-3 text-[9px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}

          {/* Category */}
          {!featured && (
            <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
              {category}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-neutral-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Rating + attendees */}
          <div className="flex items-center gap-3 mb-2">
            {rating && <StarRating rating={rating} />}
            {attendees && (
              <span className="text-[11px] text-neutral-400">{attendees.toLocaleString("id-ID")} peminat</span>
            )}
          </div>

          <div className="mt-auto space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
              <span>{fullDate}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mulai dari</p>
              <p className={`text-sm font-bold ${price === 0 || price === "0" ? "text-green-600" : "text-neutral-800"}`}>
                {formattedPrice}
              </p>
            </div>
            <span className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-full group-hover:bg-primary-dark transition-colors">
              Beli Tiket
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function JelajahPage() {
  const router = useRouter();

  const [events, setEvents]                   = useState(PLACEHOLDER_EVENTS);
  const [page, setPage]                       = useState(1);
  const [locationSearch, setLocationSearch]   = useState("");
  const [selectedLokasi, setSelectedLokasi]   = useState("Semua Lokasi");
  const [locationOpen, setLocationOpen]       = useState(false);
  const [sortBy, setSortBy]                   = useState("tanggal");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [loading, setLoading]                 = useState(false);

  /* Sync URL query params → category/location */
  useEffect(() => {
    const { category, search } = router.query;
    if (category) setSelectedLokasi("Semua Lokasi"); // category handled by filter
    if (search)   setLocationSearch(search);
  }, [router.query]);

  /* Try live API */
  useEffect(() => {
    setLoading(true);
    fetchEvents({})
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.events ?? data?.data ?? [];
        if (list.length > 0) setEvents(list.map((e, i) => ({ ...e, id: e.id ?? String(i + 1), rating: e.rating ?? 4.5, attendees: e.attendees ?? 0, featured: e.featured ?? false })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Derived locations from events */
  const allLocations = [
    "Semua Lokasi",
    ...Array.from(new Set(events.map((e) => {
      const loc = e.location?.split(",")[0].trim();
      return ALL_LOCATIONS.includes(loc) ? loc : null;
    }).filter(Boolean))),
  ];

  const filteredLocations = allLocations.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  );

  /* Apply filters */
  let filtered = selectedLokasi === "Semua Lokasi"
    ? events
    : events.filter((e) => e.location?.toLowerCase().includes(selectedLokasi.toLowerCase()));

  if (showFeaturedOnly) filtered = filtered.filter((e) => e.featured);

  /* Sort */
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "tanggal":      return new Date(a.date) - new Date(b.date);
      case "harga-rendah": return (a.price || 0) - (b.price || 0);
      case "harga-tinggi": return (b.price || 0) - (a.price || 0);
      case "rating":       return (b.rating || 0) - (a.rating || 0);
      case "popular":      return (b.attendees || 0) - (a.attendees || 0);
      default:             return 0;
    }
  });

  const totalPages     = Math.ceil(filtered.length / EVENTS_PER_PAGE);
  const paginatedEvents = filtered.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE);

  const handleLokasiSelect = (loc) => {
    setSelectedLokasi(loc);
    setLocationOpen(false);
    setLocationSearch("");
    setPage(1);
  };

  return (
    <>
      <Head>
        <title>Jelajah Event – TiketKu</title>
        <meta name="description" content="Temukan konser, festival, olahraga, dan event seru lainnya di seluruh Indonesia." />
      </Head>

      {/* Page header */}
      <section className="bg-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Temukan event favoritmu</p>
          <h1 className="text-3xl font-extrabold text-white mb-1">Jelajah Event</h1>
          <p className="text-neutral-400 text-sm">Ribuan event seru menanti — pilih lokasi, atur filter, langsung beli tiket.</p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="bg-white border-b border-neutral-100 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">

          {/* Location dropdown */}
          <div className="relative">
            <button
              onClick={() => setLocationOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium border border-neutral-200 rounded-full px-4 py-1.5 hover:border-primary transition-colors bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              <span className={selectedLokasi === "Semua Lokasi" ? "text-neutral-500" : "text-neutral-800"}>
                {selectedLokasi}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="p-2 border-b border-neutral-100">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Cari kota…"
                    className="w-full text-sm px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <ul className="max-h-48 overflow-y-auto py-1">
                  {filteredLocations.map((loc) => (
                    <li key={loc}>
                      <button
                        onClick={() => handleLokasiSelect(loc)}
                        className={`w-full text-left text-sm px-4 py-2 hover:bg-neutral-50 transition-colors ${selectedLokasi === loc ? "text-primary font-semibold" : "text-neutral-700"}`}
                      >
                        {loc}
                      </button>
                    </li>
                  ))}
                  {filteredLocations.length === 0 && (
                    <li className="text-xs text-neutral-400 px-4 py-3 text-center">Tidak ada hasil</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="text-sm border border-neutral-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Featured toggle */}
          <button
            onClick={() => { setShowFeaturedOnly((v) => !v); setPage(1); }}
            className={`flex items-center gap-1.5 text-sm font-medium border rounded-full px-4 py-1.5 transition-colors ${
              showFeaturedOnly
                ? "bg-primary text-white border-primary"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill={showFeaturedOnly ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Featured
          </button>

          {/* Result count */}
          <span className="ml-auto text-xs text-neutral-400">
            {loading ? "Memuat…" : `${filtered.length} event ditemukan`}
          </span>
        </div>
      </section>

      {/* Events grid */}
      <section className="bg-neutral-50 py-10 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
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
          ) : paginatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {paginatedEvents.map((event) => (
                <JelajahCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
              </svg>
              <p className="font-medium text-neutral-500">Tidak ada event ditemukan</p>
              <p className="text-sm mt-1">Coba ubah filter atau lokasi.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    page === i + 1
                      ? "bg-primary text-white"
                      : "border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
