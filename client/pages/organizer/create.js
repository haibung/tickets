import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function IconCurrency() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v2m0 8v2m-3-5h6m-6 0a3 3 0 003-3m0 3a3 3 0 003 3" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-8" />
    </svg>
  );
}
function IconSpeaker() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6" /><path d="M19 3 5 21" /><path d="M19 3c0 0-7 3-7 9s7 9 7 9" />
    </svg>
  );
}
function IconLightning() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconCog() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M15 5H9a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}
function IconTrending() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="m3 17 4-4 4 4 4-6 4 4" /><path d="M21 7h-4v4" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IconQuote() {
  return (
    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: <IconCurrency />,
    iconBg: "bg-blue-50 text-blue-600",
    title: "Revenue Maksimal",
    description: "Dapatkan hingga 95% dari penjualan tiket dengan fee platform yang sangat kompetitif dan transparan.",
    badge: "Hingga 95%",
    badgeCls: "bg-blue-100 text-blue-700",
  },
  {
    icon: <IconChart />,
    iconBg: "bg-red-50 text-red-600",
    title: "Analytics Mendalam",
    description: "Monitor penjualan real-time, demografi audience, dan insight berharga untuk event berikutnya.",
    badge: "Real-time",
    badgeCls: "bg-red-100 text-red-700",
  },
  {
    icon: <IconSpeaker />,
    iconBg: "bg-blue-50 text-blue-600",
    title: "Marketing Tools",
    description: "Promosi built-in, early bird, presale, kode referral — semua tersedia tanpa biaya tambahan.",
    badge: "Built-in",
    badgeCls: "bg-blue-100 text-blue-700",
  },
  {
    icon: <IconLightning />,
    iconBg: "bg-red-50 text-red-600",
    title: "Setup Cepat",
    description: "Buat event lengkap dalam hitungan menit menggunakan wizard dan template siap pakai.",
    badge: "< 5 menit",
    badgeCls: "bg-red-100 text-red-700",
  },
  {
    icon: <IconCalendar />,
    iconBg: "bg-blue-50 text-blue-600",
    title: "Event Management",
    description: "Kelola multiple events sekaligus, tiket VIP / Regular / Presale, dan check-in via QR code.",
    badge: "Multi-event",
    badgeCls: "bg-blue-100 text-blue-700",
  },
  {
    icon: <IconShield />,
    iconBg: "bg-red-50 text-red-600",
    title: "Pembayaran Aman",
    description: "Terima semua metode pembayaran populer dengan sistem berstandar KYC dan enkripsi penuh.",
    badge: "Secured",
    badgeCls: "bg-red-100 text-red-700",
  },
];

const STEPS = [
  { step: "01", icon: <IconUser />, title: "Daftar sebagai Organizer", description: "Buat akun organizer, lengkapi verifikasi identitas dan dokumen legal event Anda.", color: "bg-blue-600" },
  { step: "02", icon: <IconCog />,  title: "Setup Event Pertama",      description: "Gunakan wizard setup untuk membuat event dengan detail foto, deskripsi, dan venue.", color: "bg-blue-700" },
  { step: "03", icon: <IconTicket />, title: "Konfigurasi Tiket",     description: "Tentukan harga, kategori (VIP / Regular / Presale), kuota, dan masa penjualan.", color: "bg-red-600" },
  { step: "04", icon: <IconTrending />, title: "Launch & Promosi",    description: "Publikasikan event dan manfaatkan tools marketing untuk menjangkau ribuan audience.", color: "bg-red-700" },
];

const TESTIMONIALS = [
  { name: "Reza Mahendra", role: "Concert Organizer · Jakarta", quote: "Pendapatan kami naik 40% sejak pindah ke TiketKu. Analytics-nya sangat detail dan pencairan dana super cepat.", avatar: "RM", stars: 5 },
  { name: "Dian Pratiwi",  role: "Festival Director · Bali",   quote: "Setup event dalam 10 menit, QR scanner berjalan mulus di pintu masuk. Tim support selalu siap membantu.", avatar: "DP", stars: 5 },
  { name: "Hendra Yusuf",  role: "Stand-Up Comedian · Bandung", quote: "Fitur early bird dan kode referral benar-benar membantu promosi. Lebih dari 2.000 tiket terjual lewat TiketKu.", avatar: "HY", stars: 5 },
];

const PACKAGES = [
  {
    name: "Starter",
    subtitle: "Ideal untuk event perdana",
    price: "Gratis",
    fee: "3% per transaksi",
    features: ["Maks 100 tiket/event", "Basic analytics", "1 kategori tiket", "Email support"],
    cta: "Mulai Gratis",
    popular: false,
    ctaCls: "border border-blue-600 text-blue-700 hover:bg-blue-50",
  },
  {
    name: "Professional",
    subtitle: "Untuk organizer aktif",
    price: "Custom",
    fee: "2% per transaksi",
    features: ["Tiket tidak terbatas", "Advanced analytics", "Kategori tiket tak terbatas", "Priority support", "Custom branding", "QR scanner tiket"],
    cta: "Hubungi Kami",
    popular: true,
    ctaCls: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    name: "Enterprise",
    subtitle: "Skala penuh & kustomisasi",
    price: "Custom",
    fee: "Negosiasi",
    features: ["Semua fitur Professional", "Dedicated account manager", "Custom integrations", "Custom domain & halaman", "Advanced reporting", "Support 24/7"],
    cta: "Hubungi Sales",
    popular: false,
    ctaCls: "border border-blue-600 text-blue-700 hover:bg-blue-50",
  },
];

const FAQS = [
  { q: "Berapa lama proses verifikasi akun organizer?", a: "Verifikasi umumnya selesai dalam 1–2 hari kerja setelah semua dokumen diunggah lengkap." },
  { q: "Kapan dana penjualan tiket dapat dicairkan?", a: "Dana dapat dicairkan 3 hari kerja setelah event berakhir. Untuk event besar, tersedia opsi pencairan lebih awal." },
  { q: "Apakah ada biaya setup atau biaya bulanan?", a: "Tidak ada biaya setup maupun biaya berlangganan bulanan. Anda hanya dikenakan fee per transaksi sesuai paket yang dipilih." },
  { q: "Metode pembayaran apa saja yang diterima?", a: "Transfer bank, virtual account, e-wallet (GoPay, OVO, Dana), QRIS, dan kartu kredit/debit Visa & Mastercard." },
  { q: "Bisakah saya mengelola beberapa event sekaligus?", a: "Ya. Paket Professional dan Enterprise mendukung manajemen event tak terbatas dalam satu dasbor." },
];

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-neutral-50 transition-colors"
      >
        <span className="text-sm font-semibold text-neutral-800">{q}</span>
        <span className={`ml-4 flex-shrink-0 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center transition-transform ${open ? "rotate-45" : ""}`}>
          <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white">
          <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrganizerCreatePage() {
  return (
    <>
      <Head>
        <title>Jadi Organizer – TiketKu</title>
        <meta name="description" content="Buat dan jual tiket event Anda bersama TiketKu. Revenue maksimal, analytics mendalam, setup cepat." />
      </Head>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-5">
                🎉 Platform Tiket #1 Indonesia
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight mb-5">
                Wujudkan Event<br />
                <span className="text-blue-600">Impian Anda</span> Bersama<br />
                TiketKu
              </h1>
              <p className="text-neutral-500 text-lg leading-relaxed mb-8 max-w-lg">
                Dari konser ke festival, stand-up ke seminar — kelola penjualan tiket,
                analisa audience, dan cairkan pendapatan dengan mudah. Gratis untuk memulai.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/auth/register?role=organizer"
                  className="px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors text-center shadow-sm"
                >
                  Daftar sebagai Organizer
                </Link>
                <Link
                  href="/auth/login"
                  className="px-7 py-3.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors text-center"
                >
                  Masuk ke Dashboard
                </Link>
              </div>
              <p className="text-xs text-neutral-400">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Login di sini
                </Link>
                . Butuh bantuan?{" "}
                <Link href="/help" className="text-blue-600 hover:underline font-medium">
                  Hubungi support
                </Link>
              </p>
            </div>

            {/* Right – quick-access card */}
            <div className="lg:justify-self-end w-full max-w-sm">
              <div className="bg-white border border-neutral-200 rounded-2xl shadow-md p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">Akses Cepat</p>
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-neutral-800">Masuk ke Akun</p>
                      <p className="text-xs text-neutral-400">Kelola event Anda sekarang</p>
                    </div>
                  </Link>
                  <Link
                    href="/auth/register?role=organizer"
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-neutral-200 hover:border-red-400 hover:bg-red-50 transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" />
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-neutral-800">Daftar Gratis</p>
                      <p className="text-xs text-neutral-400">Buat akun organizer baru</p>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/organizer"
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-neutral-800">Buka Dashboard</p>
                      <p className="text-xs text-neutral-400">Langsung ke panel organizer</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "10.000+", label: "Organizer Aktif" },
              { value: "2 Juta+", label: "Tiket Terjual" },
              { value: "95%",     label: "Revenue ke Organizer" },
              { value: "< 5 min", label: "Waktu Setup Event" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-blue-100 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
              Keunggulan Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Mengapa Pilih TiketKu?
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Kami bukan sekadar platform tiket. TiketKu adalah mitra pertumbuhan event Anda
              — dari setup hingga pencairan dana.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${b.iconBg}`}>
                    {b.icon}
                  </div>
                  <span className={`mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${b.badgeCls}`}>
                    {b.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{b.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLE: PLATFORM STORY ──────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Illustration placeholder */}
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              {[
                { icon: "🎤", label: "Konser & Musik",   n: "320+ Event" },
                { icon: "🎭", label: "Festival",         n: "180+ Event" },
                { icon: "😂", label: "Stand-Up Comedy",  n: "240+ Event" },
                { icon: "📚", label: "Seminar & Edu",    n: "500+ Event" },
              ].map((c) => (
                <div key={c.label} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-center">
                  <p className="text-3xl mb-2">{c.icon}</p>
                  <p className="text-sm font-semibold text-neutral-800">{c.label}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{c.n}</p>
                </div>
              ))}
            </div>

            {/* Article text */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-5">
                Tentang Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
                Dibangun oleh Pecinta Event,<br />untuk Para Organizer
              </h2>
              <div className="space-y-4 text-neutral-500 text-sm leading-relaxed">
                <p>
                  TiketKu lahir dari frustrasi nyata: platform tiket yang ada memotong
                  terlalu banyak, analitiknya terbatas, dan pencairan dana memakan waktu berminggu-minggu.
                  Kami membangun solusi yang berbeda.
                </p>
                <p>
                  Sejak 2022, lebih dari <strong className="text-neutral-800">10.000 organizer</strong> telah
                  mempercayakan event mereka kepada TiketKu — dari konser skala nasional hingga
                  workshop komunitas lokal. Lebih dari <strong className="text-neutral-800">2 juta tiket</strong> telah
                  terjual dengan tingkat kepuasan organizer 98%.
                </p>
                <p>
                  Kami percaya bahwa organizer yang sukses adalah jantung ekosistem hiburan Indonesia.
                  Itulah mengapa kami terus mengembangkan tools, memperkecil fee, dan mempercepat
                  pencairan — agar Anda bisa fokus pada hal terpenting: menciptakan pengalaman tak terlupakan.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { label: "Fee Transparan", icon: "✅" },
                  { label: "Pencairan Cepat", icon: "⚡" },
                  { label: "Support 24/7",   icon: "🛡️" },
                ].map((t) => (
                  <span key={t.label} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-full">
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
              Cara Kerja
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Event Pertama Anda dalam 4 Langkah
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto">
              Proses yang sederhana dan terpandu — tidak perlu pengalaman teknis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative bg-white rounded-2xl border border-neutral-200 p-6">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-6 h-px bg-neutral-200 z-10" />
                )}
                <div className={`w-11 h-11 rounded-xl ${s.color} text-white flex items-center justify-center mb-4`}>
                  {s.icon}
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Langkah {s.step}</p>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
              Cerita Sukses
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Apa Kata Organizer Kami?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col">
                <div className="text-blue-200 mb-4">
                  <IconQuote />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{t.name}</p>
                    <p className="text-[11px] text-neutral-400">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-yellow-400">
                    {Array.from({ length: t.stars }).map((_, i) => <IconStar key={i} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
              Paket & Harga
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Mulai dari Gratis
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto">
              Tidak ada biaya berlangganan tersembunyi. Hanya fee per transaksi yang transparan.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white rounded-2xl border p-7 ${
                  pkg.popular
                    ? "border-blue-500 shadow-lg ring-1 ring-blue-100"
                    : "border-neutral-200"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold bg-blue-600 text-white px-4 py-1 rounded-full shadow">
                    Paling Populer
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{pkg.name}</p>
                <p className="text-[11px] text-neutral-400 mb-5">{pkg.subtitle}</p>
                <p className="text-3xl font-extrabold text-neutral-900">{pkg.price}</p>
                <p className="text-xs text-neutral-400 mt-1 mb-6">{pkg.fee}</p>
                <ul className="space-y-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <IconCheck />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.popular ? "/auth/register?role=organizer" : "/help"}
                  className={`block w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${pkg.ctaCls}`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-400 mt-8">
            * Paket Starter bebas biaya platform. Fee 3% dikenakan per transaksi tiket berhasil.
            Tidak ada biaya setup, langganan, atau pembatalan.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-4">Siap Memulai?</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Buat Event Pertama Anda Hari Ini
          </h2>
          <p className="text-blue-100 mb-10 max-w-lg mx-auto">
            Bergabunglah dengan 10.000+ organizer yang sudah mempercayakan event mereka kepada TiketKu.
            Gratis untuk memulai — tidak ada kartu kredit yang dibutuhkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=organizer"
              className="px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 rounded-xl border border-blue-400 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
