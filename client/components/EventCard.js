import Link from "next/link";

const CATEGORY_COLORS = {
  music: "bg-purple-100 text-purple-800",
  sports: "bg-green-100 text-green-800",
  festival: "bg-yellow-100 text-yellow-800",
  theatre: "bg-blue-100 text-blue-800",
  comedy: "bg-orange-100 text-orange-800",
  food: "bg-red-100 text-red-800",
};

/**
 * EventCard component
 * @param {{ event: { id, title, date, location, price, image, category, organizer } }} props
 */
export default function EventCard({ event }) {
  const {
    id,
    title,
    date,
    location,
    price,
    image,
    category = "music",
    organizer,
  } = event;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date TBA";

  const formattedPrice =
    price === 0 || price === "0"
      ? "Free"
      : price
      ? `IDR ${Number(price).toLocaleString("id-ID")}`
      : "Price TBA";

  const categoryColor =
    CATEGORY_COLORS[category?.toLowerCase()] || "bg-neutral-100 text-neutral-700";

  return (
    <Link href={`/events/${id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        {/* Event image */}
        <div className="relative w-full aspect-[16/9] bg-neutral-200 overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white opacity-60"
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
            </div>
          )}
          {/* Category badge */}
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full capitalize ${categoryColor}`}
          >
            {category}
          </span>
        </div>

        {/* Event info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-neutral-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {organizer && (
            <p className="text-xs text-neutral-500 mb-3">{organizer}</p>
          )}
          <div className="mt-auto space-y-1">
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>
            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  />
                </svg>
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-primary font-bold text-sm">
              {formattedPrice}
            </span>
            <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium group-hover:bg-primary-dark transition-colors">
              Buy Ticket
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
