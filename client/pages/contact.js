import { useState } from "react";
import Head from "next/head";

const TOPICS = ["General Enquiry", "Ticket Support", "Refund / Cancellation", "Organizer Partnership", "Press / Media", "Bug Report", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    // In production this would POST to the backend; for now we simulate success.
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact – TiketKu</title>
        <meta name="description" content="Get in touch with the TiketKu team." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
          <p className="text-neutral-400 text-base">
            A real human reads every message. We typically reply within one business day.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact channels */}
            <div className="space-y-5">
              {[
                { icon: "📧", title: "Email", detail: "support@tiketku.id", sub: "General enquiries & ticket support" },
                { icon: "📞", title: "Phone", detail: "+62 21 5000-1234", sub: "Mon – Fri, 09:00 – 18:00 WIB" },
                { icon: "💬", title: "Live Chat", detail: "Available in the app", sub: "Fastest response for urgent issues" },
                { icon: "📍", title: "HQ Address", detail: "Jl. Sudirman No. 15, Jakarta Pusat 10220", sub: "By appointment only" },
              ].map((ch) => (
                <div key={ch.title} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
                  <span className="text-2xl flex-shrink-0">{ch.icon}</span>
                  <div>
                    <p className="font-bold text-neutral-800 text-sm">{ch.title}</p>
                    <p className="text-sm text-primary font-semibold">{ch.detail}</p>
                    <p className="text-xs text-neutral-400">{ch.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-xl font-bold text-neutral-800 mb-2">Message received!</h2>
                  <p className="text-neutral-500 text-sm">
                    Thanks, {form.name}. We&apos;ll get back to you at <strong>{form.email}</strong> within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-bold text-neutral-800">Send us a message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Budi Santoso"
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="budi@email.com"
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Topic</label>
                    <select
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your question or issue in detail…"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
