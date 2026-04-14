import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const BANNERS = [
  {
    id: "b1",
    title: "ARTJOG 2025 – MOTIF: AMALAN",
    subtitle: "20 Jun – 31 Agu 2025  ·  Jogja National Museum, Yogyakarta",
    cta: "Beli Tiket",
    href: "/events/1",
    gradient: "from-neutral-950 via-neutral-900 to-primary/40",
  },
  {
    id: "b2",
    title: "NEON LIGHT FESTIVAL 2025",
    subtitle: "27 Jul 2025  ·  Surabaya",
    cta: "Beli Tiket",
    href: "/events/6",
    gradient: "from-neutral-950 via-neutral-900 to-secondary/30",
  },
  {
    id: "b3",
    title: "Festival Kopi Tanah Para Raja 2025",
    subtitle: "25 – 27 Jul 2025  ·  Bali",
    cta: "Beli Tiket",
    href: "/events/5",
    gradient: "from-neutral-950 via-neutral-900 to-amber-800/30",
  },
];

const UPCOMING_EVENTS = [
  {
    id: "u1",
    title: "Konser Sheila On 7 – KSATRIA",
    date: "2025-08-30T20:00:00Z",
    location: "Istora Senayan, Jakarta",
    price: 550000,
    category: "konser",
    organizer: "Mahaka Entertainment",
  },
  {
    id: "u2",
    title: "Noah Live in Concert 2025",
    date: "2025-09-14T19:30:00Z",
    location: "Gelora Bung Karno, Jakarta",
    price: 350000,
    category: "konser",
    organizer: "My Music Indonesia",
  },
  {
    id: "u3",
    title: "Dewa 19 Reunion Tour",
    date: "2025-10-05T20:00:00Z",
    location: "JIExpo Kemayoran, Jakarta",
    price: 450000,
    category: "konser",
    organizer: "Java Music Live",
  },
];

const PAST_EVENTS = [
  {
    id: "p1",
    title: "Coldplay – Music of the Spheres",
    date: "2024-11-15T19:00:00Z",
    location: "Gelora Bung Karno, Jakarta",
    price: 850000,
    category: "konser",
    organizer: "Live Nation Indonesia",
  },
  {
    id: "p2",
    title: "Java Jazz Festival 2024",
    date: "2024-06-01T10:00:00Z",
    location: "JIExpo Kemayoran, Jakarta",
    price: 500000,
    category: "jazz",
    organizer: "Java Festival Production",
  },
  {
    id: "p3",
    title: "Djakarta Warehouse Project 2024",
    date: "2024-12-06T20:00:00Z",
    location: "JIExpo Kemayoran, Jakarta",
    price: 600000,
    category: "festival",
    organizer: "ismaya live",
  },
];

// ─── Banner Carousel ──────────────────────────────────────────────────────────

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchEndX.current - touchStartX.current;
    if (diff > 30) setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    else if (diff < -30) setCurrent((prev) => (prev + 1) % BANNERS.length);
  };
  const handlePrev = () => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % BANNERS.length);

  const banner = BANNERS[current];

  return (
    <section
      className="relative overflow-hidden select-none"
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative w-full h-52 sm:h-64 md:h-72 bg-gradient-to-r ${banner.gradient} transition-all duration-700 flex items-center`}
      >
        {/* Decorative circle */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-10 sm:px-14 lg:px-16 w-full">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
            Event Pilihan
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1.5 max-w-xl">
            {banner.title}
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mb-4">{banner.subtitle}</p>
          <Link
            href={banner.href}
            className="inline-block bg-primary text-white font-semibold text-xs sm:text-sm px-5 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            {banner.cta}
          </Link>
        </div>

        {/* Prev arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-5 bg-primary" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Past Event Card ──────────────────────────────────────────────────────────

function PastEventCard({ event }) {
  const { title, date, location, price } = event;
  const dateObj = date ? new Date(date) : null;
  const fullDate = dateObj
    ? dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "TBA";
  const formattedPrice = price
    ? `Rp ${Number(price).toLocaleString("id-ID")}`
    : "TBA";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 opacity-75">
      {/* Image with black overlay */}
      <div className="relative w-full aspect-[16/9] bg-neutral-200 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 z-10 flex flex-col items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-neutral-700 px-3 py-1 rounded-full">
            Event Selesai
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-neutral-500 text-sm leading-snug line-clamp-2 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            </svg>
            <span>{fullDate}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <p className="text-sm font-bold text-neutral-400 line-through">{formattedPrice}</p>
          <span className="text-xs text-neutral-400 border border-neutral-200 px-3 py-1 rounded-full">
            Selesai
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Head>
        <title>TiketKu – Beli Tiket Event di Indonesia</title>
        <meta
          name="description"
          content="Temukan dan beli tiket konser, olahraga, festival, dan event seru lainnya di seluruh Indonesia. Pengiriman instan, tanpa biaya tersembunyi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero */}
      <HeroSection />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Upcoming Events */}
      <section className="bg-neutral-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">On Sale Now</p>
              <h2 className="text-2xl font-extrabold text-neutral-900">Event Mendatang</h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-primary hover:underline flex-shrink-0"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UPCOMING_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-white py-14 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Arsip</p>
            <h2 className="text-2xl font-extrabold text-neutral-900">Event yang Telah Berlalu</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAST_EVENTS.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
