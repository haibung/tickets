import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth, getUser } from "@/lib/auth";

// ── Placeholder data ──────────────────────────────────────────────────────────
const STATS = {
  revenue: 1_420_000_000, sold: 3_820, events: 6, conversion: 4.2,
  revenueGrowth: 12, soldGrowth: 8, eventsGrowth: 2, conversionGrowth: -0.3,
};

const DAILY_SALES = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  amount: Math.round(20_000_000 + Math.sin(i * 0.4) * 15_000_000 + ((i * 7 + 3) % 9) * 1_000_000),
}));

const BREAKDOWN = [
  { category: "VIP Standing", sold: 850,  total: 1000, revenue: 2_125_000_000 },
  { category: "Category 1",   sold: 1200, total: 2000, revenue: 1_800_000_000 },
  { category: "Category 2",   sold: 1100, total: 2000, revenue:   935_000_000 },
  { category: "General",      sold: 670,  total: 3000, revenue:   234_500_000 },
];

const FUNNEL = [
  { step: "Event Page View",  count: 42_000 },
  { step: "Add to Cart",      count: 15_400 },
  { step: "Checkout",         count:  9_200 },
  { step: "Payment",          count:  7_100 },
  { step: "Onsite Check-in",  count:  3_820 },
];

const EVENTS_INIT = [
  { id: "EVT-001", name: "Coldplay World Tour Jakarta",   date: "2025-05-15", status: "active",  sold: 3150, capacity: 7000 },
  { id: "EVT-002", name: "Java Jazz Festival 2025",       date: "2025-06-20", status: "active",  sold: 800,  capacity: 5000 },
  { id: "EVT-003", name: "Bali Arts & Culture Night",     date: "2025-07-04", status: "draft",   sold: 0,    capacity: 2000 },
  { id: "EVT-004", name: "Stand Up Comedy Spesial Malam", date: "2025-04-30", status: "pending", sold: 182,  capacity: 500  },
];

const TICKETS_INIT = [
  { id: "TKT-C1", event: "Coldplay World Tour", category: "VIP Standing",       price: 2_500_000, quota: 1000, sold: 850,  active: true  },
  { id: "TKT-C2", event: "Coldplay World Tour", category: "Category 1",         price: 1_500_000, quota: 2000, sold: 1200, active: true  },
  { id: "TKT-C3", event: "Coldplay World Tour", category: "Category 2",         price:   850_000, quota: 2000, sold: 1100, active: true  },
  { id: "TKT-C4", event: "Coldplay World Tour", category: "General",            price:   350_000, quota: 3000, sold: 670,  active: false },
  { id: "TKT-J1", event: "Java Jazz 2025",       category: "General Admission", price:   500_000, quota: 5000, sold: 800,  active: true  },
];

const CHECKINS_INIT = [
  { id: "TKT-C1", name: "Budi Santoso", ticket: "VIP Standing", time: "19:02" },
  { id: "TKT-C2", name: "Rina Dewi",    ticket: "Category 1",   time: "19:05" },
  { id: "TKT-J1", name: "Ahmad Fauzi",  ticket: "General",      time: "19:07" },
];

const BALANCE_INIT = { available: 340_000_000, pending: 120_000_000, withdrawn: 960_000_000 };

const WITHDRAWAL_INIT = [
  { id: "WD-005", amount: 200_000_000, bank: "BCA",     status: "completed", date: "2025-04-22" },
  { id: "WD-004", amount: 150_000_000, bank: "Mandiri", status: "completed", date: "2025-03-17" },
  { id: "WD-003", amount: 120_000_000, bank: "BCA",     status: "pending",   date: "2025-05-10" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const IDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const CARD = "bg-neutral-900 border border-neutral-800 rounded-xl";

const STATUS_MAP = {
  active:    { dot: "bg-emerald-400", label: "Aktif" },
  draft:     { dot: "bg-neutral-500", label: "Draft" },
  pending:   { dot: "bg-yellow-500",  label: "Pending" },
  completed: { dot: "bg-emerald-400", label: "Selesai" },
  rejected:  { dot: "bg-red-500",     label: "Ditolak" },
  inactive:  { dot: "bg-neutral-600", label: "Nonaktif" },
};

const COMMON_PW = ["123456", "password", "qwerty", "abc123", "111111"];

function validatePw(pw) {
  if (pw.length < 8) return "Min. 8 karakter.";
  if (!/[A-Z]/.test(pw)) return "Butuh huruf kapital.";
  if (!/[0-9]/.test(pw)) return "Butuh angka.";
  if (!/[*#@$%^&+=!?]/.test(pw)) return "Butuh karakter spesial (*#@$%^&+=!?).";
  if (COMMON_PW.some((c) => pw.toLowerCase().includes(c))) return "Password terlalu umum.";
  return null;
}

// ── Shared components ─────────────────────────────────────────────────────────
function Dot({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SecTitle({ children }) {
  return <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-4">{children}</p>;
}

function Trend({ v }) {
  const pos = v >= 0;
  return (
    <span className={`text-[11px] font-medium ${pos ? "text-emerald-400" : "text-red-400"}`}>
      {pos ? "\u2191" : "\u2193"} {Math.abs(v)}% vs last month
    </span>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{label}</label>
      <input
        {...props}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
      />
    </div>
  );
}

function Msg({ ok, text }) {
  if (!text) return null;
  return <p className={`text-xs ${ok ? "text-emerald-400" : "text-red-400"}`}>{text}</p>;
}

// ── Analytics ─────────────────────────────────────────────────────────────────
function Analytics() {
  const max = Math.max(...DAILY_SALES.map((d) => d.amount));
  const barW = 100 / 30;

  function exportCSV() {
    const rows = [["Day", "Revenue"], ...DAILY_SALES.map((d) => [d.day, d.amount])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = "sales_report.csv";
    a.click();
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",   value: IDR(STATS.revenue),          growth: STATS.revenueGrowth },
          { label: "Tiket Terjual",   value: STATS.sold.toLocaleString(),  growth: STATS.soldGrowth },
          { label: "Total Event",     value: STATS.events,                 growth: STATS.eventsGrowth },
          { label: "Conversion Rate", value: `${STATS.conversion}%`,       growth: STATS.conversionGrowth },
        ].map((k) => (
          <div key={k.label} className={`${CARD} p-4`}>
            <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{k.label}</p>
            <p className="text-xl font-bold text-white mb-1">{k.value}</p>
            <Trend v={k.growth} />
          </div>
        ))}
      </div>

      <div className={`${CARD} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <SecTitle>Tren Penjualan 30 Hari</SecTitle>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="text-[11px] border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 px-3 py-1 rounded-lg transition-colors">
              {"\u2193"} CSV
            </button>
            <button className="text-[11px] border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 px-3 py-1 rounded-lg transition-colors">
              {"\u2193"} PDF
            </button>
          </div>
        </div>
        <svg viewBox="0 0 300 80" className="w-full" preserveAspectRatio="none">
          {DAILY_SALES.map((d, i) => {
            const h = (d.amount / max) * 70;
            return <rect key={i} x={i * barW + 0.3} y={80 - h} width={barW - 0.6} height={h} fill="#e8411e" opacity="0.6" rx="1" />;
          })}
        </svg>
        <div className="flex justify-between mt-1 text-[10px] text-neutral-600">
          <span>1</span><span>10</span><span>20</span><span>30</span>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="px-5 pt-5 pb-1"><SecTitle>Breakdown per Kategori</SecTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-800">
                <th className="px-5 py-3 text-left">Kategori</th>
                <th className="px-5 py-3 text-left">Terjual</th>
                <th className="px-5 py-3 text-left">% Terjual</th>
                <th className="px-5 py-3 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {BREAKDOWN.map((r) => (
                <tr key={r.category} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3 text-neutral-300 font-medium">{r.category}</td>
                  <td className="px-5 py-3 text-neutral-400">{r.sold.toLocaleString()} / {r.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((r.sold / r.total) * 100)}%` }} />
                      </div>
                      <span className="text-[11px] text-neutral-500">{Math.round((r.sold / r.total) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white font-medium">{IDR(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${CARD} p-5`}>
        <SecTitle>User Journey Funnel</SecTitle>
        <div className="space-y-3">
          {FUNNEL.map((f, i) => (
            <div key={f.step}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-neutral-400">{f.step}</span>
                <span className="text-neutral-300">{f.count.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(f.count / FUNNEL[0].count) * 100}%`, opacity: 1 - i * 0.12 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────
const EMPTY_EVENT = { name: "", description: "", genre: "", highlights: "", facilities: "" };

function Events() {
  const [events, setEvents] = useState(EVENTS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [artists, setArtists] = useState([{ name: "", type: "Headliner", time: "" }]);
  const [files, setFiles] = useState({ permit: null, logo: null, banner: null });

  function submit(e) {
    e.preventDefault();
    const next = { id: `EVT-00${events.length + 1}`, name: form.name || "Untitled Event", date: "2025-12-01", status: "draft", sold: 0, capacity: 1000 };
    setEvents((ev) => [next, ...ev]);
    setShowForm(false);
    setForm(EMPTY_EVENT);
    setArtists([{ name: "", type: "Headliner", time: "" }]);
    setFiles({ permit: null, logo: null, banner: null });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SecTitle>Event Saya</SecTitle>
        <button onClick={() => setShowForm((s) => !s)} className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          {showForm ? "Tutup" : "+ Event Baru"}
        </button>
      </div>

      {showForm && (
        <div className={`${CARD} p-5`}>
          <SecTitle>Buat Event Baru (Draft)</SecTitle>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nama Event" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Field label="Genre" value={form.genre} onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))} placeholder="Musik, Comedy, Festival..." />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Deskripsi</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Highlights" value={form.highlights} onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))} placeholder="Pisahkan dengan koma" />
              <Field label="Fasilitas" value={form.facilities} onChange={(e) => setForm((f) => ({ ...f, facilities: e.target.value }))} placeholder="Parkir, Food court..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "permit", label: "Dokumen Izin (PDF, max 10 MB)", accept: ".pdf" },
                { key: "logo",   label: "Logo Event (max 5 MB)",          accept: "image/*" },
                { key: "banner", label: "Banner 1920x1080 (max 5 MB)",    accept: "image/*" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{f.label}</label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-neutral-700 rounded-xl p-4 cursor-pointer hover:border-neutral-500 transition-colors text-center">
                    <span className="text-2xl mb-1">📂</span>
                    <span className="text-[11px] text-neutral-500 truncate max-w-full px-1">{files[f.key] ? files[f.key].name : "Pilih file"}</span>
                    <input type="file" accept={f.accept} className="hidden" onChange={(e) => setFiles((p) => ({ ...p, [f.key]: e.target.files[0] ?? null }))} />
                  </label>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-wider text-neutral-500">Artist Lineup</label>
                <button type="button" onClick={() => setArtists((a) => [...a, { name: "", type: "Local", time: "" }])}
                  className="text-[11px] text-neutral-400 hover:text-white border border-neutral-700 px-2 py-0.5 rounded transition-colors">
                  + Tambah
                </button>
              </div>
              <div className="space-y-2">
                {artists.map((a, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input value={a.name} onChange={(e) => setArtists((ar) => ar.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                      placeholder="Nama artist" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none" />
                    <select value={a.type} onChange={(e) => setArtists((ar) => ar.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)))}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-300 focus:outline-none">
                      {["Headliner", "International", "Local"].map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <input type="time" value={a.time} onChange={(e) => setArtists((ar) => ar.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-300 focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-neutral-700 text-neutral-400 hover:text-white py-2 rounded-lg text-sm transition-colors">Batal</button>
              <button type="submit" className="flex-1 bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Simpan sebagai Draft</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className={`${CARD} p-4 flex items-center justify-between gap-4`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{ev.name}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{ev.date} · {ev.id}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-neutral-400">{ev.sold.toLocaleString()} / {ev.capacity.toLocaleString()}</p>
                <div className="w-20 h-1 bg-neutral-700 rounded mt-1">
                  <div className="h-full bg-primary rounded" style={{ width: `${(ev.sold / ev.capacity) * 100}%` }} />
                </div>
              </div>
              <Dot status={ev.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tickets ───────────────────────────────────────────────────────────────────
function Tickets() {
  const [tickets, setTickets] = useState(TICKETS_INIT);
  const [editId, setEditId] = useState(null);
  const [delta, setDelta] = useState("");
  const [newPrice, setNewPrice] = useState("");

  function toggleActive(id) { setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, active: !t.active } : t))); }
  function restock(id) {
    const q = parseInt(delta, 10);
    if (!q || q <= 0) return;
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, quota: t.quota + q } : t)));
    setDelta(""); setEditId(null);
  }
  function changePrice(id) {
    const p = parseInt(newPrice, 10);
    if (!p || p <= 0) return;
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, price: p } : t)));
    setNewPrice(""); setEditId(null);
  }

  return (
    <div className="space-y-4">
      <SecTitle>Manajemen Tiket</SecTitle>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className={`${CARD} p-4`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{t.category}</p>
                <p className="text-[11px] text-neutral-500">{t.event} · {t.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Dot status={t.active ? "active" : "inactive"} />
                <button onClick={() => toggleActive(t.id)} className="text-[11px] border border-neutral-700 text-neutral-400 hover:text-white px-2 py-0.5 rounded transition-colors">
                  {t.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              {[{ label: "Harga", value: IDR(t.price) }, { label: "Kuota", value: t.quota.toLocaleString() }, { label: "Terjual", value: t.sold.toLocaleString() }].map((c) => (
                <div key={c.label} className={`${CARD} py-2`}>
                  <p className="text-[10px] text-neutral-600 mb-0.5">{c.label}</p>
                  <p className="text-sm font-bold text-white">{c.value}</p>
                </div>
              ))}
            </div>
            {editId === t.id ? (
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 flex-1 min-w-0">
                  <input value={delta} onChange={(e) => setDelta(e.target.value)} type="number" placeholder="Tambah kuota"
                    className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                  <button onClick={() => restock(t.id)} className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold flex-shrink-0">Restock</button>
                </div>
                <div className="flex gap-1 flex-1 min-w-0">
                  <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" placeholder="Harga baru"
                    className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                  <button onClick={() => changePrice(t.id)} className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold flex-shrink-0">Update</button>
                </div>
                <button onClick={() => setEditId(null)} className="text-xs text-neutral-500 hover:text-white transition-colors px-2">Batal</button>
              </div>
            ) : (
              <button onClick={() => setEditId(t.id)} className="text-[11px] border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-colors">
                Edit Kuota & Harga
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scanner ───────────────────────────────────────────────────────────────────
function Scanner() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [log, setLog] = useState(CHECKINS_INIT);

  function scan(e) {
    e.preventDefault();
    const code = input.trim();
    if (!code) return;
    const found = TICKETS_INIT.find((t) => t.id === code);
    if (found) {
      const entry = { id: code, name: "Tamu Baru", ticket: found.category, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
      setResult({ ok: true, msg: `\u2713 Valid \u2013 ${found.category}` });
      setLog((l) => [entry, ...l]);
    } else if (code.startsWith("USED-")) {
      setResult({ ok: false, msg: "\u2717 Tiket sudah digunakan" });
    } else {
      setResult({ ok: false, msg: "\u2717 QR tidak valid" });
    }
    setInput("");
    setTimeout(() => setResult(null), 3000);
  }

  return (
    <div className="space-y-5">
      <SecTitle>QR Check-in Scanner</SecTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`${CARD} p-5 space-y-4`}>
          <p className="text-xs text-neutral-400">Input Manual / Auto-scan</p>
          <form onSubmit={scan} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Masukkan kode QR..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="bg-white text-black text-xs font-semibold px-4 rounded-lg hover:bg-neutral-200 transition-colors">Scan</button>
          </form>
          {result && (
            <div className={`text-sm font-medium px-3 py-2 rounded-lg border ${result.ok ? "bg-emerald-900/40 text-emerald-400 border-emerald-800" : "bg-red-900/40 text-red-400 border-red-900"}`}>
              {result.msg}
            </div>
          )}
          <div className="border border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center py-8 text-center text-neutral-600">
            <span className="text-3xl mb-2">📷</span>
            <p className="text-xs">Kamera Scanner (PWA)</p>
            <p className="text-[11px] mt-0.5">Tersedia di perangkat mobile</p>
          </div>
        </div>
        <div className={`${CARD} p-5 flex flex-col`}>
          <p className="text-xs text-neutral-400 mb-3">Log Check-in ({log.length} tamu)</p>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-72">
            {log.map((entry, i) => (
              <div key={i} className="flex items-center justify-between border border-neutral-800 rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-white">{entry.name}</p>
                  <p className="text-[11px] text-neutral-500">{entry.ticket}</p>
                </div>
                <span className="text-[11px] text-neutral-600 font-mono">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Wallet ────────────────────────────────────────────────────────────────────
function Wallet() {
  const [balance, setBalance] = useState(BALANCE_INIT);
  const [history, setHistory] = useState(WITHDRAWAL_INIT);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ amount: "", bank: "", account: "", holder: "" });
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState(null);

  const amt = Number(form.amount) || 0;
  const platform = amt * 0.05;
  const tax = amt * 0.02;
  const net = amt - platform - tax;

  function submitForm(e) {
    e.preventDefault();
    if (!amt || amt <= 0) { setMsg({ ok: false, text: "Masukkan jumlah yang valid." }); return; }
    if (amt > balance.available) { setMsg({ ok: false, text: "Melebihi saldo tersedia." }); return; }
    setMsg({ ok: true, text: "OTP dikirim ke email terdaftar." });
    setStep(2);
  }

  function submitOtp(e) {
    e.preventDefault();
    if (otp.length !== 6) { setMsg({ ok: false, text: "OTP 6 digit diperlukan." }); return; }
    setBalance((b) => ({ ...b, available: b.available - amt, pending: b.pending + amt }));
    setHistory((h) => [{ id: `WD-${String(h.length + 1).padStart(3, "0")}`, amount: amt, bank: form.bank, status: "pending", date: new Date().toISOString().slice(0, 10) }, ...h]);
    setStep(3); setMsg({ ok: true, text: "Pencairan berhasil diajukan!" });
    setForm({ amount: "", bank: "", account: "", holder: "" }); setOtp("");
  }

  function reset() { setStep(0); setMsg(null); }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Saldo Tersedia",    value: IDR(balance.available), note: "Siap ditarik" },
          { label: "Pending Pencairan", value: IDR(balance.pending),   note: "Diproses 2\u20133 hari" },
          { label: "Total Dicairkan",   value: IDR(balance.withdrawn), note: "Historis" },
        ].map((c) => (
          <div key={c.label} className={`${CARD} p-4`}>
            <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{c.label}</p>
            <p className="text-lg font-bold text-white">{c.value}</p>
            <p className="text-[11px] text-neutral-600 mt-0.5">{c.note}</p>
          </div>
        ))}
      </div>

      <div className={`${CARD} p-5`}>
        {step === 0 && (
          <>
            <SecTitle>Pengajuan Pencairan</SecTitle>
            <p className="text-sm text-neutral-500 mb-4">Cairkan saldo ke rekening bank. Biaya platform 5% + PPh 2% dipotong otomatis.</p>
            <button onClick={() => setStep(1)} disabled={balance.available <= 0}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${balance.available > 0 ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"}`}>
              Ajukan Pencairan
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <SecTitle>Detail Pencairan</SecTitle>
            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Jumlah (IDR)" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="Masukkan jumlah" required />
                <Field label="Nama Bank" value={form.bank} onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))} placeholder="BCA, Mandiri, BRI..." required />
                <Field label="No. Rekening" value={form.account} onChange={(e) => setForm((f) => ({ ...f, account: e.target.value }))} placeholder="1234567890" required />
                <Field label="Nama Pemilik Rekening" value={form.holder} onChange={(e) => setForm((f) => ({ ...f, holder: e.target.value }))} placeholder="Nama lengkap" required />
              </div>
              {amt > 0 && (
                <div className="bg-neutral-800/60 rounded-lg p-4 text-sm space-y-1.5">
                  <div className="flex justify-between text-neutral-400"><span>Jumlah Bruto</span><span>{IDR(amt)}</span></div>
                  <div className="flex justify-between text-neutral-500"><span>Platform Fee (5%)</span><span>\u2013 {IDR(platform)}</span></div>
                  <div className="flex justify-between text-neutral-500"><span>PPh 2%</span><span>\u2013 {IDR(tax)}</span></div>
                  <div className="flex justify-between text-white font-semibold border-t border-neutral-700 pt-2"><span>Yang Diterima</span><span>{IDR(net)}</span></div>
                </div>
              )}
              <Msg ok={msg?.ok} text={msg?.text} />
              <div className="flex gap-3">
                <button type="button" onClick={reset} className="flex-1 border border-neutral-700 text-neutral-400 hover:text-white py-2 rounded-lg text-sm transition-colors">Batal</button>
                <button type="submit" className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Verifikasi OTP</button>
              </div>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <SecTitle>Verifikasi OTP</SecTitle>
            <p className="text-sm text-neutral-500 mb-4">Masukkan 6 digit OTP yang dikirim ke email terdaftar.</p>
            <form onSubmit={submitOtp} className="space-y-3">
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} placeholder="6-digit OTP"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-lg text-white text-center tracking-[0.3em] focus:outline-none focus:border-neutral-500" />
              <Msg ok={msg?.ok} text={msg?.text} />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setMsg(null); }} className="flex-1 border border-neutral-700 text-neutral-400 hover:text-white py-2 rounded-lg text-sm transition-colors">Kembali</button>
                <button type="submit" className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Konfirmasi</button>
              </div>
            </form>
          </>
        )}
        {step === 3 && (
          <div className="text-center py-4">
            <p className="text-3xl mb-3">\u2705</p>
            <p className="text-sm font-semibold text-white mb-1">Pencairan Diajukan</p>
            <p className="text-xs text-neutral-500 mb-4">Diproses dalam 2\u20133 hari kerja.</p>
            <button onClick={reset} className="text-xs border border-neutral-700 text-neutral-400 hover:text-white px-4 py-2 rounded-lg transition-colors">Selesai</button>
          </div>
        )}
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="px-5 pt-5 pb-1"><SecTitle>Riwayat Pencairan</SecTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-800">
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Jumlah</th>
                <th className="px-5 py-3 text-left">Bank</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {history.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{IDR(r.amount)}</td>
                  <td className="px-5 py-3 text-neutral-400">{r.bank}</td>
                  <td className="px-5 py-3"><Dot status={r.status} /></td>
                  <td className="px-5 py-3 text-neutral-500 tabular-nums">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function OrgSettings({ user }) {
  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", whatsapp: "", bio: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);
  const [twoFA, setTwoFA] = useState(false);
  const [tfaStep, setTfaStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [tfaMsg, setTfaMsg] = useState(null);

  function saveProfile(e) {
    e.preventDefault();
    if (!profile.name.trim()) { setProfileMsg({ ok: false, text: "Nama wajib diisi." }); return; }
    setProfileMsg({ ok: true, text: "Profil disimpan." });
    setTimeout(() => setProfileMsg(null), 3000);
  }
  function changePassword(e) {
    e.preventDefault();
    if (!pw.current) { setPwMsg({ ok: false, text: "Masukkan password saat ini." }); return; }
    const err = validatePw(pw.next);
    if (err) { setPwMsg({ ok: false, text: err }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ ok: false, text: "Konfirmasi tidak cocok." }); return; }
    setPwMsg({ ok: true, text: "Password diperbarui." });
    setPw({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwMsg(null), 3000);
  }
  function toggleTfa() {
    if (!twoFA && tfaStep === 0) { setTfaStep(1); setTfaMsg({ ok: true, text: `OTP dikirim ke ${profile.email || "email Anda"}` }); return; }
    if (twoFA) { setTwoFA(false); setTfaStep(0); setTfaMsg({ ok: true, text: "2FA dinonaktifkan." }); setTimeout(() => setTfaMsg(null), 3000); }
  }
  function verifyOtp(e) {
    e.preventDefault();
    if (otp.length !== 6) { setTfaMsg({ ok: false, text: "Masukkan 6 digit OTP." }); return; }
    setTwoFA(true); setTfaStep(2); setOtp("");
    setTfaMsg({ ok: true, text: "2FA aktif." }); setTimeout(() => setTfaMsg(null), 3000);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`${CARD} p-5`}>
          <SecTitle>Profil Creator</SecTitle>
          <form onSubmit={saveProfile} className="space-y-3">
            <Field label="Nama" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <Field label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <Field label="Telepon" type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
            <Field label="WhatsApp Business" type="tel" value={profile.whatsapp} onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))} />
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Bio</label>
              <textarea rows={2} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none" />
            </div>
            <Msg ok={profileMsg?.ok} text={profileMsg?.text} />
            <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Simpan</button>
          </form>
        </div>

        <div className={`${CARD} p-5`}>
          <SecTitle>Ubah Password</SecTitle>
          <form onSubmit={changePassword} className="space-y-3">
            <Field label="Password Saat Ini" type={showPw ? "text" : "password"} value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
            <Field label="Password Baru" type={showPw ? "text" : "password"} value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
            <Field label="Konfirmasi Password" type={showPw ? "text" : "password"} value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
            <label className="flex items-center gap-2 text-[11px] text-neutral-500 cursor-pointer">
              <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="accent-primary" /> Tampilkan
            </label>
            <Msg ok={pwMsg?.ok} text={pwMsg?.text} />
            <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Ubah</button>
          </form>
        </div>

        <div className={`${CARD} p-5`}>
          <SecTitle>Autentikasi Dua Faktor</SecTitle>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-300">Status</p>
            <Dot status={twoFA ? "active" : "inactive"} />
          </div>
          {tfaStep === 1 && (
            <form onSubmit={verifyOtp} className="space-y-3 mb-3">
              <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit OTP"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white text-center tracking-widest focus:outline-none focus:border-neutral-500" />
              <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Verifikasi</button>
            </form>
          )}
          <Msg ok={tfaMsg?.ok} text={tfaMsg?.text} />
          {tfaStep !== 1 && (
            <button onClick={toggleTfa} className="w-full mt-3 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 hover:text-white py-2 rounded-lg transition-colors">
              {twoFA ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
            </button>
          )}
        </div>

        <div className={`${CARD} p-5`}>
          <SecTitle>Dokumen KYC</SecTitle>
          <div className="space-y-3">
            {[
              { label: "KTP / ID Nasional",    accept: "image/*,.pdf" },
              { label: "Foto Formal",           accept: "image/*" },
              { label: "Legalitas Perusahaan",  accept: ".pdf" },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between border border-neutral-800 rounded-lg px-4 py-3">
                <p className="text-sm text-neutral-300">{d.label}</p>
                <label className="text-[11px] border border-neutral-700 text-neutral-400 hover:text-white px-3 py-1 rounded-lg cursor-pointer transition-colors">
                  Upload
                  <input type="file" accept={d.accept} className="hidden" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Per-tab background containers ─────────────────────────────────────────────
const TAB_WRAP = {
  analytics: { style: { background: "radial-gradient(ellipse 90% 40% at 50% -5%, rgba(232,65,30,0.07) 0%, #0d0d0d 60%)" }, cls: "rounded-2xl p-5 md:p-6" },
  events:    { style: { background: "linear-gradient(145deg, #080c18 0%, #0b0b10 100%)" },                                   cls: "rounded-2xl p-5 md:p-6 border-l-2 border-secondary/30" },
  tickets:   { style: { background: "linear-gradient(145deg, #0e0810 0%, #0d0d0d 100%)" },                                   cls: "rounded-2xl p-5 md:p-6 border-l-2 border-purple-900/40" },
  scanner:   { style: { background: "linear-gradient(145deg, #07100a 0%, #0c0c0c 100%)" },                                   cls: "rounded-2xl p-5 md:p-6 border-t border-emerald-900/30" },
  wallet:    { style: { background: "linear-gradient(145deg, #0f0f0a 0%, #0d0d0d 100%)" },                                   cls: "rounded-2xl p-5 md:p-6 border-l-2 border-neutral-700/40" },
  settings:  { style: { background: "#0d0d0d" },                                                                             cls: "rounded-2xl p-5 md:p-6" },
};

const TAB_TITLES = {
  analytics: "Analytics",
  events:    "Event Management",
  tickets:   "Ticket Management",
  scanner:   "QR Scanner",
  wallet:    "Wallet & Financials",
  settings:  "Settings",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrganizerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);

  const tab = router.query.tab ?? "analytics";

  useEffect(() => {
    if (!requireAuth(router, ["organizer", "admin"])) return;
    setUser(getUser());
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoading(false);
  }, [router]);

  const wrap = TAB_WRAP[tab] ?? TAB_WRAP.analytics;

  return (
    <>
      <Head><title>{TAB_TITLES[tab] ?? "Creator Dashboard"} \u2013 TiketKu</title></Head>
      <DashboardLayout title={TAB_TITLES[tab] ?? "Creator Dashboard"} variant="dark">
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : (
          <div className={wrap.cls} style={wrap.style}>
            {tab === "analytics" && <Analytics />}
            {tab === "events"    && <Events />}
            {tab === "tickets"   && <Tickets />}
            {tab === "scanner"   && <Scanner />}
            {tab === "wallet"    && <Wallet />}
            {tab === "settings"  && <OrgSettings user={user} />}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
