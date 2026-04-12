import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const TEAM = [
  { name: "Budi Santoso", role: "Co-founder & CEO", avatar: "BS", bio: "Former product lead at Gojek with 10 years building consumer apps at scale." },
  { name: "Rina Wijaya", role: "Co-founder & CTO", avatar: "RW", bio: "Ex-Google engineer. Obsessed with sub-second latency and zero-downtime deploys." },
  { name: "Hendra Kusuma", role: "Head of Design", avatar: "HK", bio: "Previously at Tokopedia. Believes great UX is invisible." },
  { name: "Dewi Anggraini", role: "Head of Partnerships", avatar: "DA", bio: "Built the venue & organizer network from 0 to 3,000+ partners in 18 months." },
];

const VALUES = [
  { icon: "🔍", title: "Radical Transparency", desc: "No hidden fees. Ever. The price you see is the price you pay." },
  { icon: "🤝", title: "Fan First", desc: "Every product decision starts with one question: does this make fans' lives easier?" },
  { icon: "⚡", title: "Speed as a Feature", desc: "From search to e-ticket in under 60 seconds. We obsess over every millisecond." },
  { icon: "🌏", title: "Indonesia Native", desc: "Built in Jakarta, designed for Indonesian payment rails, languages, and culture." },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us – TiketKu</title>
        <meta name="description" content="Learn about TiketKu — Indonesia's most trusted ticketing platform." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary overflow-hidden relative py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary opacity-10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary opacity-10 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            We&rsquo;re fixing a broken industry,<br />
            <span className="text-primary">one ticket at a time</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            TiketKu was born from frustration — hidden fees, scalpers, paper tickets, and refunds that took weeks.
            We built the platform we always wanted as fans.
          </p>
        </div>
      </section>

      {/* Mission numbers */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2020", label: "Founded" },
              { value: "10,000+", label: "Events Listed" },
              { value: "500K+", label: "Tickets Sold" },
              { value: "100+", label: "Cities" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 mb-4">The story behind TiketKu</h2>
          <div className="prose prose-neutral text-neutral-600 text-sm leading-relaxed space-y-4">
            <p>
              In 2019, co-founders Budi and Rina spent two hours trying to buy tickets to a major Jakarta concert — only to find the event was sold out entirely to resellers at 3× face value. They left empty-handed. That night they started sketching what a better ticketing platform would look like.
            </p>
            <p>
              TiketKu launched in early 2020 with a single commitment: every ticket at face value, no scalpers allowed. We verify every buyer with a national ID, link tickets cryptographically to the purchaser, and make reselling above face value impossible.
            </p>
            <p>
              Today we partner with Indonesia&rsquo;s biggest organizers, artists, and venue operators — from stadium concerts to intimate theatre shows — and process hundreds of thousands of tickets every month. But the mission hasn&rsquo;t changed: make live events accessible to every Indonesian fan.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 text-center mb-10">What we stand for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-neutral-100 hover:shadow-md transition-shadow">
                <span className="text-3xl flex-shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-neutral-800 mb-1">{v.title}</h3>
                  <p className="text-sm text-neutral-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-neutral-800 text-center mb-10">Meet the team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center text-white font-extrabold text-lg mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-neutral-800">{member.name}</h3>
                <p className="text-xs text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form — Tentang Kami */}
      <section className="bg-neutral-50 py-16 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Hubungi Kami</p>
            <h2 className="text-2xl font-extrabold text-neutral-900">Ada pertanyaan? Kami siap membantu.</h2>
            <p className="text-neutral-500 text-sm mt-2">Tim kami biasanya membalas dalam satu hari kerja.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact channels */}
            <div className="space-y-4">
              {[
                { label: "Email", value: "support@tiketku.id",           sub: "Pertanyaan umum & dukungan tiket" },
                { label: "Telepon", value: "+62 21 5000-1234",           sub: "Sen – Jum, 09.00 – 18.00 WIB"    },
                { label: "Live Chat", value: "Tersedia di aplikasi",     sub: "Respons tercepat untuk masalah mendesak" },
                { label: "Kantor", value: "Jl. Sudirman No. 15, Jakarta", sub: "Hanya dengan perjanjian"         },
              ].map((ch) => (
                <div key={ch.label} className="bg-white rounded-2xl p-4 border border-neutral-100">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{ch.label}</p>
                  <p className="text-sm font-semibold text-neutral-800">{ch.value}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{ch.sub}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Bergabunglah bersama kami</h2>
          <p className="text-white text-opacity-80 mb-6 text-sm">
            Apakah kamu penggemar, organizer, atau ingin bekerja bersama kami — selalu ada tempat untukmu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/careers" className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-neutral-100 transition-colors text-sm">
              Lihat Lowongan
            </Link>
            <Link href="/contact" className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-primary transition-colors text-sm">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [form, setForm]           = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Semua field wajib diisi.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-neutral-800 mb-1">Pesan terkirim!</h3>
        <p className="text-sm text-neutral-500">
          Terima kasih, <strong>{form.name}</strong>. Kami akan membalas ke <strong>{form.email}</strong> dalam 1 hari kerja.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
      <h3 className="text-base font-bold text-neutral-800">Kirim pesan</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Budi Santoso"
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="budi@email.com"
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Ceritakan pertanyaan atau kebutuhanmu…"
          className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
      >
        Kirim Pesan
      </button>
    </form>
  );
}
