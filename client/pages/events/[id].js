import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchEventById } from "@/lib/api";

const PLACEHOLDER_EVENT = {
  id: "1",
  title: "Coldplay Music of the Spheres World Tour",
  date: "2025-05-15T19:00:00Z",
  endDate: "2025-05-15T22:00:00Z",
  location: "Gelora Bung Karno, Jakarta",
  description:
    "Experience the magic of Coldplay's Music of the Spheres World Tour live in Jakarta! Featuring stunning visuals, pyrotechnics, and all your favourite hits from A Head Full of Dreams, Music of the Spheres, and more.",
  price: 850000,
  category: "music",
  organizer: "Live Nation Indonesia",
  ticketTypes: [
    { id: "vip", name: "VIP Standing", price: 2500000, available: 50 },
    { id: "cat1", name: "Category 1", price: 1500000, available: 200 },
    { id: "cat2", name: "Category 2", price: 850000, available: 500 },
    { id: "cat3", name: "Category 3", price: 500000, available: 1000 },
  ],
};

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchEventById(id)
      .then((data) => setEvent(data))
      .catch(() => setEvent(PLACEHOLDER_EVENT))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="w-full aspect-[16/9] bg-neutral-200 rounded-2xl mb-8" />
        <div className="h-8 bg-neutral-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-32">
        <p className="text-neutral-500 text-lg">Event not found.</p>
        <Link href="/events" className="text-primary font-semibold mt-4 inline-block hover:underline">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const ticketTypes = event.ticketTypes ?? [
    { id: "general", name: "General Admission", price: event.price, available: 100 },
  ];

  const handleCheckout = () => {
    if (!selectedTicket) return;
    router.push(
      `/checkout?eventId=${event.id}&ticketId=${selectedTicket}&qty=${quantity}`
    );
  };

  return (
    <>
      <Head>
        <title>{event.title} – TiketKu</title>
        <meta name="description" content={event.description?.slice(0, 160)} />
      </Head>

      <div className="bg-neutral-50 pb-16">
        {/* Hero image */}
        <div className="relative w-full h-56 sm:h-72 md:h-96 bg-gradient-to-br from-primary to-secondary overflow-hidden">
          {event.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl opacity-30">🎫</span>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">
                  {event.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">
                  {event.title}
                </h1>

                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-neutral-800">{formattedDate}</p>
                      <p>{formattedTime} WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-neutral-800">{event.location}</p>
                    </div>
                  </div>
                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="font-medium text-neutral-800">{event.organizer}</p>
                        <p>Event Organizer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-neutral-800 mb-3">About this Event</h2>
                  <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Ticket booking sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Select Tickets</h2>

                <div className="space-y-3 mb-6">
                  {ticketTypes.map((ticket) => (
                    <label
                      key={ticket.id}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
                        selectedTicket === ticket.id
                          ? "border-primary bg-primary bg-opacity-5"
                          : "border-neutral-200 hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="ticket"
                          value={ticket.id}
                          checked={selectedTicket === ticket.id}
                          onChange={() => setSelectedTicket(ticket.id)}
                          className="accent-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{ticket.name}</p>
                          <p className="text-xs text-neutral-500">{ticket.available} remaining</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {ticket.price === 0
                          ? "Free"
                          : `IDR ${Number(ticket.price).toLocaleString("id-ID")}`}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-neutral-700">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 text-neutral-700"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 text-neutral-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {selectedTicket && (
                  <div className="flex justify-between text-sm mb-4 pb-4 border-b border-neutral-100">
                    <span className="text-neutral-600">Total</span>
                    <span className="font-bold text-neutral-800">
                      IDR{" "}
                      {(
                        (ticketTypes.find((t) => t.id === selectedTicket)?.price ?? 0) *
                        quantity
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={!selectedTicket}
                  className={`w-full py-3 rounded-full font-semibold text-sm transition-colors ${
                    selectedTicket
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  {selectedTicket ? "Buy Ticket" : "Select a Ticket Type"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
