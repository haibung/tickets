import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar({ className = "", placeholder = "Search events, concerts, artists..." }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/events?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex gap-2 bg-white rounded-full shadow-lg overflow-hidden p-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 pl-5 py-3 text-neutral-800 text-sm focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
