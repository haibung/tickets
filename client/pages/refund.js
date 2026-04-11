import Head from "next/head";
import Link from "next/link";

const SCENARIOS = [
  {
    title: "Event Cancelled by Organizer",
    icon: "🚫",
    eligibility: "Full refund (100%)",
    timeline: "Automatic within 24 hours",
    action: "No action required. We process it automatically.",
  },
  {
    title: "Event Postponed",
    icon: "📅",
    eligibility: "Full refund if you cannot attend new date",
    timeline: "5–7 business days after request",
    action: "Request via 'My Orders' or email support@tiketku.id within 7 days of the postponement announcement.",
  },
  {
    title: "Venue Changed",
    icon: "📍",
    eligibility: "Full refund if new venue is unacceptable",
    timeline: "5–7 business days after request",
    action: "Request within 7 days of the venue change announcement.",
  },
  {
    title: "Duplicate Purchase (Technical Error)",
    icon: "⚙️",
    eligibility: "Full refund for the duplicate order",
    timeline: "3–5 business days",
    action: "Contact support@tiketku.id within 48 hours with both order IDs.",
  },
  {
    title: "Change of Mind",
    icon: "🤔",
    eligibility: "Generally not eligible",
    timeline: "N/A",
    action: "Tickets are non-refundable once purchased unless the event is cancelled or postponed. Check if the event has a resale feature.",
  },
];

export default function RefundPage() {
  return (
    <>
      <Head>
        <title>Refund Policy – TiketKu</title>
        <meta name="description" content="TiketKu's full refund policy — when you're eligible, how to request, and how long it takes." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Refund Policy</h1>
          <p className="text-green-100 text-base">
            We believe in fair treatment for every buyer. Here&rsquo;s exactly when and how refunds work.
          </p>
          <p className="text-green-200 text-xs mt-3">Last updated: April 2026</p>
        </div>
      </section>

      {/* Key principle */}
      <section className="bg-green-50 border-b border-green-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-green-800 font-semibold text-sm">
            🌟 <strong>Our commitment:</strong> If an event is cancelled, you receive a full refund automatically — no forms, no waiting, no chasing. For all other scenarios, see the table below.
          </p>
        </div>
      </section>

      {/* Scenarios table */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 mb-6">Refund Scenarios</h2>
          <div className="space-y-4">
            {SCENARIOS.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-800 mb-3">{s.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Eligibility</p>
                        <p className={`font-semibold ${s.eligibility.includes("Full") ? "text-green-600" : "text-neutral-600"}`}>{s.eligibility}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Timeline</p>
                        <p className="font-semibold text-neutral-700">{s.timeline}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">What to do</p>
                        <p className="text-neutral-600">{s.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to request */}
      <section className="bg-white py-16" id="timeline">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 mb-6">How to Request a Refund</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Log in to your account", desc: "Go to tiketku.id and sign in with the account you used to purchase." },
              { step: "2", title: "Open 'My Orders'", desc: "Find the order you want to refund and click 'View Details'." },
              { step: "3", title: "Click 'Request Refund'", desc: "Select the reason and confirm. For cancelled events this button may not appear — the refund is already processing automatically." },
              { step: "4", title: "Wait for confirmation", desc: "You'll receive an email confirming your refund within one business day. Funds arrive based on the timeline in the table above." },
            ].map((step) => (
              <li key={step.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">{step.title}</p>
                  <p className="text-sm text-neutral-500">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Additional notes */}
      <section className="bg-neutral-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-bold text-neutral-800 mb-4">Additional Notes</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-start gap-2"><span className="text-neutral-400 flex-shrink-0">•</span>Refunds are always issued to the original payment method. We cannot issue refunds to a different account or card.</li>
            <li className="flex items-start gap-2"><span className="text-neutral-400 flex-shrink-0">•</span>Service fees (5%) are non-refundable unless the event is cancelled by the organizer.</li>
            <li className="flex items-start gap-2"><span className="text-neutral-400 flex-shrink-0">•</span>For events with a resale feature, you may re-list your ticket at face value instead of requesting a refund.</li>
            <li className="flex items-start gap-2"><span className="text-neutral-400 flex-shrink-0">•</span>TiketKu acts as a marketplace between buyers and organizers. For disputes not resolved through our platform, you retain your statutory consumer rights under Indonesian Consumer Protection Law (UU No. 8 Tahun 1999).</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm mb-4">Have a refund question not answered here?</p>
          <Link href="/contact" className="inline-block bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm">
            Contact Support
          </Link>
        </div>
      </section>
    </>
  );
}
