import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="relative bg-neutral-900 overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary border-opacity-40 bg-primary bg-opacity-10 px-4 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live events across Indonesia &amp; beyond
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
          Your next great<br />
          <span className="text-primary">experience starts here.</span>
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Concerts, sports, comedy &amp; festivals — book in seconds, show up and live it.
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* Stats strip */}
        <div className="mt-14 inline-flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[
            { value: "10,000+", label: "Events" },
            { value: "500K+", label: "Tickets Sold" },
            { value: "100+", label: "Cities" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3 text-left">
              {i > 0 && <span className="hidden sm:block w-px h-8 bg-neutral-700" />}
              <div>
                <p className="text-xl font-extrabold text-white leading-none">{stat.value}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
