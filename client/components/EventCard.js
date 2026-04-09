import Link from "next/link";

export default function EventCard({ event }) {
  const {
    id = "1",
    title = "Untitled Event",
    artist = "Unknown Artist",
    date = "TBA",
    venue = "TBA",
    city = "",
    price = 0,
    imageUrl = null,
    category = "Concert",
    availableTickets = 0,
  } = event || {};

  const isSoldOut = availableTickets === 0;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  return (
    <div className="card group">
      {/* Event image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🎵</span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
          {category}
        </span>
        {isSoldOut && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Event details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-primary-600 font-medium text-sm mb-3">{artist}</p>

        <div className="space-y-1 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {venue}{city ? `, ${city}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Starting from</span>
            <p className="text-xl font-bold text-gray-900">
              ${Number(price).toFixed(2)}
            </p>
          </div>
          <Link
            href={isSoldOut ? "#" : `/events/${id}`}
            className={`btn-primary text-sm px-4 py-2 ${
              isSoldOut
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            aria-disabled={isSoldOut}
          >
            {isSoldOut ? "Sold Out" : "Get Tickets"}
          </Link>
        </div>
      </div>
    </div>
  );
}
