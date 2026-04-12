import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth, getUser } from "@/lib/auth";
import { fetchMyOrders } from "@/lib/api";

// ─── Dummy data ────────────────────────────────────────────────────────────────

const PLACEHOLDER_TICKETS = [
  {
    id: "TKT-0091",
    event: "Konser Sheila On 7 – KSATRIA",
    date: "30 Agustus 2025",
    time: "20:00",
    location: "Istora Senayan, Jakarta",
    type: "Category A",
    price: 550000,
    status: "active",
    orderedAt: "2025-04-10",
  },
  {
    id: "TKT-0078",
    event: "Noah Live in Concert 2025",
    date: "14 September 2025",
    time: "19:30",
    location: "Gelora Bung Karno, Jakarta",
    type: "VVIP",
    price: 950000,
    status: "active",
    orderedAt: "2025-04-05",
  },
  {
    id: "TKT-0055",
    event: "Dewa 19 Reunion Tour",
    date: "5 Oktober 2025",
    time: "20:00",
    location: "JIExpo Kemayoran, Jakarta",
    type: "General",
    price: 350000,
    status: "active",
    orderedAt: "2025-03-28",
  },
  {
    id: "TKT-0044",
    event: "Java Jazz Festival 2024",
    date: "2 Juni 2024",
    time: "10:00",
    location: "JIExpo Kemayoran, Jakarta",
    type: "General Admission",
    price: 500000,
    status: "completed",
    orderedAt: "2024-05-01",
  },
  {
    id: "TKT-0032",
    event: "Coldplay – Music of the Spheres",
    date: "15 November 2024",
    time: "19:00",
    location: "Gelora Bung Karno, Jakarta",
    type: "Category 2",
    price: 850000,
    status: "completed",
    orderedAt: "2024-10-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

// Parse Indonesian date string to ISO for Google Calendar
const ID_MONTHS = {
  Januari: "01", Februari: "02", Maret: "03", April: "04",
  Mei: "05", Juni: "06", Juli: "07", Agustus: "08",
  September: "09", Oktober: "10", November: "11", Desember: "12",
};

function parseIdDate(dateStr) {
  const match = dateStr.match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!match) return null;
  const [, day, monthId, year] = match;
  const month = ID_MONTHS[monthId];
  if (!month) return null;
  return `${year}${month}${day.padStart(2, "0")}`;
}

function buildGCalUrl(ticket) {
  const isoDate = parseIdDate(ticket.date);
  if (!isoDate) return null;
  const timeStr = ticket.time?.replace(":", "") ?? "180000";
  const start = `${isoDate}T${timeStr}00`;
  const endHour = parseInt(timeStr.slice(0, 2)) + 2;
  const end = `${isoDate}T${String(endHour).padStart(2, "0")}${timeStr.slice(2)}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ticket.event,
    dates: `${start}/${end}`,
    location: ticket.location,
    details: `Tiket: ${ticket.type} – TiketKu ID: ${ticket.id}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Deterministic QR grid: 21×21
function generateQR(ticketId) {
  const seed = ticketId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grid = [];
  for (let y = 0; y < 21; y++) {
    const row = [];
    for (let x = 0; x < 21; x++) {
      // Finder patterns (corners)
      const inFinder =
        (x < 8 && y < 8) ||
        (x > 12 && y < 8) ||
        (x < 8 && y > 12);
      if (inFinder) {
        const fx = x < 8 ? x : x - 14;
        const fy = y < 8 ? y : y - 14;
        const outerRing = fx === 0 || fx === 6 || fy === 0 || fy === 6;
        const inner = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
        row.push(outerRing || inner ? 1 : 0);
      } else {
        row.push((seed + x * 13 + y * 17) % 2);
      }
    }
    grid.push(row);
  }
  return grid;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS = {
  active:    { cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", label: "Aktif" },
  completed: { cls: "bg-neutral-700/50 text-neutral-400 border border-neutral-600/30", label: "Selesai" },
  cancelled: { cls: "bg-red-500/20 text-red-400 border border-red-500/30", label: "Dibatalkan" },
};

// ─── QR Modal ────────────────────────────────────────────────────────────────

function QRModal({ ticket, onClose }) {
  const grid = generateQR(ticket.id);
  const gcUrl = buildGCalUrl(ticket);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl leading-none">✕</button>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">E-Ticket</p>
        <h2 className="text-white font-extrabold text-lg leading-snug mb-0.5">{ticket.event}</h2>
        <p className="text-neutral-400 text-xs mb-4">{ticket.id}</p>

        {/* QR */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-xl inline-block">
            <div className="grid" style={{ gridTemplateColumns: `repeat(21, 10px)`, gap: "1px" }}>
              {grid.flat().map((cell, i) => (
                <div key={i} style={{ width: 10, height: 10, backgroundColor: cell ? "#000" : "#fff" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-neutral-300 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">📅</span>
            <span>{ticket.date} · {ticket.time} WIB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">📍</span>
            <span>{ticket.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">🎟️</span>
            <span>{ticket.type} · {fmtIDR(ticket.price)}</span>
          </div>
        </div>

        {gcUrl && (
          <a
            href={gcUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            📆 Tambah ke Google Calendar
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function Overview({ tickets, user }) {
  const active = tickets.filter((t) => t.status === "active");
  const totalSpend = tickets.reduce((s, t) => s + t.price, 0);
  const recent = [...tickets].sort((a, b) => b.orderedAt.localeCompare(a.orderedAt)).slice(0, 3);

  const stats = [
    { label: "Tiket Aktif", value: active.length, icon: "🎟️", accent: "from-primary/30 to-primary/10" },
    { label: "Total Pengeluaran", value: fmtIDR(totalSpend), icon: "💳", accent: "from-blue-500/30 to-blue-500/10" },
    { label: "Event Mendatang", value: active.length, icon: "📅", accent: "from-emerald-500/30 to-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.accent} backdrop-blur-xl rounded-2xl p-5 border border-white/10`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-2xl font-extrabold text-white leading-none mb-1">{s.value}</p>
            <p className="text-xs text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Aktivitas Terbaru</p>
        {recent.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-6">Belum ada aktivitas.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "active" ? "bg-emerald-400" : "bg-neutral-600"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.event}</p>
                    <p className="text-xs text-neutral-500">{t.status === "active" ? "Pembelian" : "Event Selesai"} · {t.orderedAt}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-white flex-shrink-0">{fmtIDR(t.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Welcome card */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold mb-1">Selamat datang, {user?.name?.split(" ")[0] ?? "Pengguna"}! 👋</p>
          <p className="text-neutral-400 text-sm">Kamu punya {active.length} tiket aktif yang menanti.</p>
        </div>
        <Link
          href="/events"
          className="flex-shrink-0 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
        >
          Jelajah Event
        </Link>
      </div>
    </div>
  );
}

// ─── My Tickets Tab ───────────────────────────────────────────────────────────

function MyTickets({ tickets }) {
  const [filter, setFilter] = useState("all");
  const [qrTicket, setQrTicket] = useState(null);

  const displayed = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {f === "all" ? "Semua" : STATUS[f]?.label ?? f}
          </button>
        ))}
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      {displayed.length === 0 ? (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <div className="text-4xl mb-3">🎟️</div>
          <p className="text-white font-semibold mb-1">Tidak ada tiket</p>
          <p className="text-neutral-500 text-sm mb-4">Belum ada tiket di kategori ini.</p>
          <Link href="/events" className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition-colors">
            Beli Tiket
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Event</th>
                  <th className="text-left px-4 py-3">Tanggal</th>
                  <th className="text-left px-4 py-3">Lokasi</th>
                  <th className="text-left px-4 py-3">Tipe</th>
                  <th className="text-left px-4 py-3">Harga</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {displayed.map((t) => {
                  const badge = STATUS[t.status] ?? STATUS.cancelled;
                  const gcUrl = buildGCalUrl(t);
                  return (
                    <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white leading-snug">{t.event}</p>
                        <p className="text-xs text-neutral-500 font-mono">{t.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300 whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3.5 text-neutral-400 max-w-[160px] truncate">{t.location}</td>
                      <td className="px-4 py-3.5 text-neutral-300">{t.type}</td>
                      <td className="px-4 py-3.5 text-white font-semibold whitespace-nowrap">{fmtIDR(t.price)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {t.status === "active" && (
                            <>
                              <button
                                onClick={() => setQrTicket(t)}
                                className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                              >
                                Lihat QR
                              </button>
                              {gcUrl && (
                                <a
                                  href={gcUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold text-neutral-400 hover:text-white whitespace-nowrap"
                                  title="Tambah ke Google Calendar"
                                >
                                  📆
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {displayed.map((t) => {
              const badge = STATUS[t.status] ?? STATUS.cancelled;
              const gcUrl = buildGCalUrl(t);
              return (
                <div key={t.id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm leading-snug">{t.event}</p>
                      <p className="text-[11px] text-neutral-500 font-mono">{t.id}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <div className="text-xs text-neutral-400 space-y-0.5 mb-3">
                    <p>📅 {t.date} · {t.time} WIB</p>
                    <p>📍 {t.location}</p>
                    <p>🎟️ {t.type} · <span className="text-white font-semibold">{fmtIDR(t.price)}</span></p>
                  </div>
                  {t.status === "active" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQrTicket(t)}
                        className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        Lihat QR
                      </button>
                      {gcUrl && (
                        <a
                          href={gcUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors text-center"
                        >
                          📆 Reminder
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {qrTicket && <QRModal ticket={qrTicket} onClose={() => setQrTicket(null)} />}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

const COMMON_PASSWORDS = ["123456", "password", "qwerty", "abc123", "111111", "letmein"];

function validatePassword(pw, userName) {
  if (pw.length < 8) return "Minimal 8 karakter.";
  if (!/[A-Z]/.test(pw)) return "Harus mengandung huruf kapital.";
  if (!/[a-z]/.test(pw)) return "Harus mengandung huruf kecil.";
  if (!/[0-9]/.test(pw)) return "Harus mengandung angka.";
  if (!/[*#@$%^&+=!?]/.test(pw)) return "Harus mengandung karakter spesial (*#@$%^&+=!?).";
  if (userName && pw.toLowerCase().includes(userName.toLowerCase().split(" ")[0])) return "Password tidak boleh mengandung nama Anda.";
  if (COMMON_PASSWORDS.some((c) => pw.toLowerCase().includes(c))) return "Password terlalu umum.";
  return null;
}

function Settings({ user }) {
  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "" });
  const [profileMsg, setProfileMsg] = useState(null);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const [twoFA, setTwoFA] = useState(false);
  const [tfaStep, setTfaStep] = useState(0); // 0=idle, 1=otp sent, 2=done
  const [otp, setOtp] = useState("");
  const [tfaMsg, setTfaMsg] = useState(null);

  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, newsletter: false, promo: false });

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      setProfileMsg({ ok: false, text: "Nama dan email wajib diisi." });
      return;
    }
    setProfileMsg({ ok: true, text: "Profil berhasil diperbarui." });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handlePwChange = (e) => {
    e.preventDefault();
    if (!pwForm.current) { setPwMsg({ ok: false, text: "Masukkan password saat ini." }); return; }
    const err = validatePassword(pwForm.next, profile.name);
    if (err) { setPwMsg({ ok: false, text: err }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ ok: false, text: "Konfirmasi password tidak cocok." }); return; }
    setPwMsg({ ok: true, text: "Password berhasil diperbarui." });
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwMsg(null), 3000);
  };

  const handleTfaToggle = () => {
    if (!twoFA && tfaStep === 0) {
      setTfaStep(1);
      setTfaMsg({ ok: true, text: `Kode OTP dikirim ke ${profile.email}` });
    } else if (twoFA) {
      setTwoFA(false);
      setTfaStep(0);
      setTfaMsg({ ok: true, text: "2FA dinonaktifkan." });
      setTimeout(() => setTfaMsg(null), 3000);
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setTfaMsg({ ok: false, text: "Masukkan 6 digit OTP." }); return; }
    setTwoFA(true);
    setTfaStep(2);
    setOtp("");
    setTfaMsg({ ok: true, text: "2FA berhasil diaktifkan." });
    setTimeout(() => setTfaMsg(null), 3000);
  };

  const Toggle = ({ value, onChange, label }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <p className="text-sm text-neutral-300">{label}</p>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-primary" : "bg-neutral-700"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-5.5" : "left-0.5"}`} style={{ left: value ? "1.375rem" : "0.125rem" }} />
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Profile */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Profil</p>
        <form onSubmit={handleProfileSave} className="space-y-3">
          {[
            { label: "Nama Lengkap", key: "name", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "No. Telepon", key: "phone", type: "tel" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs text-neutral-400 mb-1">{label}</label>
              <input
                type={type}
                value={profile[key]}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          {profileMsg && (
            <p className={`text-xs ${profileMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{profileMsg.text}</p>
          )}
          <button type="submit" className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors">
            Simpan Perubahan
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Ubah Password</p>
        <form onSubmit={handlePwChange} className="space-y-3">
          {[
            { label: "Password Saat Ini", key: "current" },
            { label: "Password Baru", key: "next" },
            { label: "Konfirmasi Password Baru", key: "confirm" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-neutral-400 mb-1">{label}</label>
              <input
                type={showPw ? "text" : "password"}
                value={pwForm[key]}
                onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400">
            <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="accent-primary" />
            Tampilkan password
          </label>
          {pwMsg && (
            <p className={`text-xs ${pwMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{pwMsg.text}</p>
          )}
          <button type="submit" className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors">
            Ubah Password
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Autentikasi Dua Faktor (2FA)</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-white font-semibold">Status 2FA</p>
            <p className="text-xs text-neutral-500">Lindungi akun dengan verifikasi OTP via email.</p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${twoFA ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-700/50 text-neutral-400"}`}>
            {twoFA ? "Aktif" : "Nonaktif"}
          </div>
        </div>

        {tfaStep === 1 && (
          <form onSubmit={handleOtpVerify} className="space-y-3 mb-3">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit OTP"
              className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-neutral-600 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors">
              Verifikasi OTP
            </button>
          </form>
        )}

        {tfaMsg && (
          <p className={`text-xs mb-3 ${tfaMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{tfaMsg.text}</p>
        )}

        {tfaStep !== 1 && (
          <button
            onClick={handleTfaToggle}
            className={`w-full text-sm font-semibold py-2.5 rounded-xl transition-colors ${twoFA ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-primary text-white hover:bg-primary-dark"}`}
          >
            {twoFA ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Notifikasi</p>
        <Toggle value={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} label="Email" />
        <Toggle value={notifs.sms} onChange={(v) => setNotifs((n) => ({ ...n, sms: v }))} label="SMS" />
        <Toggle value={notifs.push} onChange={(v) => setNotifs((n) => ({ ...n, push: v }))} label="Push Notification" />
        <Toggle value={notifs.newsletter} onChange={(v) => setNotifs((n) => ({ ...n, newsletter: v }))} label="Newsletter" />
        <Toggle value={notifs.promo} onChange={(v) => setNotifs((n) => ({ ...n, promo: v }))} label="Promo & Penawaran" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "tickets",  label: "Tiket Saya", icon: "🎟️" },
  { id: "settings", label: "Pengaturan", icon: "⚙️" },
];

export default function UserDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState(PLACEHOLDER_TICKETS);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!requireAuth(router, ["user", "admin", "organizer"])) return;
    setUser(getUser());
    fetchMyOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.orders ?? data?.data ?? [];
        if (list.length) setTickets(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <>
      <Head><title>Dashboard – TiketKu</title></Head>
      <DashboardLayout title="Dashboard">
        {/* Dark glass wrapper */}
        <div className="min-h-full" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)", borderRadius: "1rem", padding: "1.5rem" }}>

          {/* Tab nav */}
          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
            {MAIN_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? "bg-primary text-white shadow"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse h-28" />
              ))}
            </div>
          ) : (
            <>
              {tab === "overview" && <Overview tickets={tickets} user={user} />}
              {tab === "tickets"  && <MyTickets tickets={tickets} />}
              {tab === "settings" && <Settings user={user} />}
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
