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

  const dateObj = date ? new Date(date) : null;
  const dayNum = dateObj
    ? dateObj.toLocaleDateString("en-ID", { day: "numeric" })
    : null;
  const monthStr = dateObj
    ? dateObj.toLocaleDateString("en-ID", { month: "short" }).toUpperCase()
    : null;
  const fullDate = dateObj
    ? dateObj.toLocaleDateString("en-ID", {
        day: "numeric",
        month: "long",
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
    <Link href={`/events/${id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z"
                />
              </svg>
            </div>
          )}

          {/* Date chip — top left */}
          {dateObj && (
            <div className="absolute top-3 left-3 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center w-10 h-12 leading-none">
              <span className="text-[10px] font-bold text-primary uppercase">{monthStr}</span>
              <span className="text-base font-extrabold text-neutral-800 -mt-0.5">{dayNum}</span>
            </div>
          )}

          {/* Category badge — top right */}
          <span
            className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${categoryColor}`}
          >
            {category}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-neutral-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {organizer && (
            <p className="text-[11px] text-neutral-400 mb-3">{organizer}</p>
          )}

          <div className="mt-auto space-y-1.5">
            {/* Date text */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
              <span>{fullDate}</span>
            </div>
            {/* Location */}
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
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide">From</p>
              <p className={`text-sm font-bold ${price === 0 || price === "0" ? "text-green-600" : "text-neutral-800"}`}>
                {formattedPrice}
              </p>
            </div>
            <span className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-full group-hover:bg-primary-dark transition-colors">
              Get Tickets
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
