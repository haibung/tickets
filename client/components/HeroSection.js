import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-dark overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary opacity-10 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary opacity-10 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        {/* Badge */}
        <span className="inline-block bg-primary bg-opacity-20 text-primary-light text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 border border-primary border-opacity-30">
          🎫 #1 Ticketing Platform in Indonesia
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 text-balance">
          Discover &amp; Book
          <br />
          <span className="text-primary-light">Amazing Events</span>
        </h1>
        <p className="text-neutral-200 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Concerts, sports, festivals &amp; more — find tickets for the best
          live events near you.
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* Quick stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {[
            { value: "10,000+", label: "Events Listed" },
            { value: "500K+", label: "Happy Customers" },
            { value: "100+", label: "Cities Covered" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-neutral-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
