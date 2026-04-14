import Head from "next/head";
import Link from "next/link";

const OPEN_ROLES = [
  {
    dept: "Engineering",
    roles: [
      { title: "Senior Backend Engineer (Go / Node.js)", type: "Full-time", location: "Jakarta / Remote" },
      { title: "Frontend Engineer (Next.js / React)", type: "Full-time", location: "Jakarta / Remote" },
      { title: "Mobile Engineer (React Native)", type: "Full-time", location: "Jakarta / Remote" },
      { title: "Site Reliability Engineer", type: "Full-time", location: "Remote" },
    ],
  },
  {
    dept: "Product & Design",
    roles: [
      { title: "Senior Product Manager", type: "Full-time", location: "Jakarta" },
      { title: "UX / Product Designer", type: "Full-time", location: "Jakarta / Remote" },
      { title: "Data Analyst", type: "Full-time", location: "Jakarta" },
    ],
  },
  {
    dept: "Growth & Partnerships",
    roles: [
      { title: "Organizer Partnership Manager", type: "Full-time", location: "Jakarta" },
      { title: "Performance Marketing Specialist", type: "Full-time", location: "Jakarta / Remote" },
    ],
  },
  {
    dept: "Operations",
    roles: [
      { title: "Customer Success Specialist", type: "Full-time", location: "Jakarta" },
      { title: "Operations Intern", type: "Internship (3 months)", location: "Jakarta" },
    ],
  },
];

const PERKS = [
  { icon: "🏠", title: "Flexible & Remote", desc: "Work from anywhere in Indonesia. We care about output, not office time." },
  { icon: "🎫", title: "Free Event Tickets", desc: "Monthly ticket credit for any event on our platform. Live music on us." },
  { icon: "📚", title: "Learning Budget", desc: "IDR 10 juta / year for courses, books, and conferences." },
  { icon: "💪", title: "Health & Wellness", desc: "Full BPJS + private health insurance for you and your family." },
  { icon: "🚀", title: "Equity Programme", desc: "All employees receive stock options. You build it, you own a piece of it." },
  { icon: "🍱", title: "Daily Meals", desc: "Free lunch and snacks in our Jakarta HQ (for office days)." },
];

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers – TiketKu</title>
        <meta name="description" content="Join TiketKu — help us build Indonesia's most trusted ticketing platform." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
            We&rsquo;re Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Build the future of <br /><span className="text-primary">live events in Indonesia</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Join a team of 40+ people obsessed with making every fan&rsquo;s live-event experience remarkable.
            We move fast, debate hard, and ship real features to real users every week.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 text-center mb-10">Why work at TiketKu?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="flex gap-4 p-5 rounded-2xl border border-neutral-100 hover:shadow-md transition-shadow">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-neutral-800 text-sm mb-1">{p.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 mb-8">Open Positions</h2>
          <div className="space-y-8">
            {OPEN_ROLES.map((dept) => (
              <div key={dept.dept}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{dept.dept}</h3>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-neutral-50">
                  {dept.roles.map((role) => (
                    <div key={role.title} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors gap-2">
                      <div>
                        <p className="font-semibold text-neutral-800 text-sm">{role.title}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{role.location} · {role.type}</p>
                      </div>
                      <Link
                        href="/contact"
                        className="flex-shrink-0 text-xs font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
                      >
                        Apply →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous */}
      <section className="bg-primary py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Don&rsquo;t see the right role?</h2>
          <p className="text-white text-sm mb-6 opacity-90">
            We love hearing from talented people. Send us your CV and tell us how you&rsquo;d make TiketKu better.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-semibold px-7 py-3 rounded-full hover:bg-neutral-100 transition-colors text-sm">
            Send a Spontaneous Application
          </Link>
        </div>
      </section>
    </>
  );
}
