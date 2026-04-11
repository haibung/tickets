import Head from "next/head";
import Link from "next/link";

const PRESS_RELEASES = [
  {
    date: "March 2026",
    title: "TiketKu reaches 500,000 tickets sold milestone",
    outlet: "Bisnis Indonesia",
    link: "#",
  },
  {
    date: "January 2026",
    title: "TiketKu raises Series A to expand beyond Java",
    outlet: "DealStreetAsia",
    link: "#",
  },
  {
    date: "October 2025",
    title: "TiketKu launches ID-verified ticketing to combat scalpers",
    outlet: "Kompas",
    link: "#",
  },
  {
    date: "July 2025",
    title: "TiketKu partners with 500 new event organizers in Q2 2025",
    outlet: "Startup Report Indonesia",
    link: "#",
  },
  {
    date: "April 2025",
    title: "TiketKu wins Best Consumer App at Startup Awards Indonesia",
    outlet: "Tech in Asia",
    link: "#",
  },
];

const COVERAGE = [
  { name: "Kompas", logo: "K" },
  { name: "Bisnis Indonesia", logo: "B" },
  { name: "Tech in Asia", logo: "T" },
  { name: "DealStreetAsia", logo: "D" },
  { name: "Katadata", logo: "K2" },
  { name: "CNN Indonesia", logo: "C" },
];

export default function PressPage() {
  return (
    <>
      <Head>
        <title>Press – TiketKu</title>
        <meta name="description" content="Press coverage, media kit, and contact information for TiketKu." />
      </Head>

      {/* Hero */}
      <section className="bg-neutral-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
            Newsroom
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">TiketKu in the Press</h1>
          <p className="text-neutral-400 text-base">
            Find our latest press releases, media assets, and journalist contact information here.
          </p>
        </div>
      </section>

      {/* Coverage logos */}
      <section className="bg-white py-10 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs uppercase tracking-widest text-neutral-400 text-center mb-6">As featured in</p>
          <div className="flex flex-wrap justify-center gap-6">
            {COVERAGE.map((outlet) => (
              <div
                key={outlet.name}
                className="flex items-center gap-2 px-5 py-2.5 border border-neutral-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                  {outlet.logo[0]}
                </div>
                <span className="text-sm font-semibold text-neutral-600">{outlet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press releases */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 mb-8">Press Releases</h2>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-neutral-50">
            {PRESS_RELEASES.map((pr) => (
              <div key={pr.title} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-3 hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">{pr.date} · {pr.outlet}</p>
                  <p className="font-semibold text-neutral-800 text-sm">{pr.title}</p>
                </div>
                <a
                  href={pr.link}
                  className="flex-shrink-0 text-xs font-semibold text-primary hover:underline"
                >
                  Read →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media kit */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-800 mb-3">Media Kit</h2>
              <p className="text-neutral-500 text-sm mb-5">
                Download our official logos, brand guidelines, product screenshots, and founder headshots.
              </p>
              <a
                href="#"
                className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm"
              >
                Download Media Kit (ZIP)
              </a>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-bold text-neutral-800 mb-3">Press Contact</h3>
              <p className="text-sm text-neutral-600 mb-4">
                For media enquiries, interview requests, or embargoed briefings, please reach out directly to our communications team.
              </p>
              <p className="text-sm font-semibold text-neutral-800">press@tiketku.id</p>
              <p className="text-xs text-neutral-400 mt-1">Response time: within 24 hours (business days)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
