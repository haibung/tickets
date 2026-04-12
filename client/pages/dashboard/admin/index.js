import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";

// ── Placeholder data ──────────────────────────────────────────────────────────
const KPI = {
  users: 12_480, creators: 348, tickets: 89_210, revenue: 4_230_000_000,
  usersGrowth: 8, creatorsGrowth: 12, ticketsGrowth: 15, revenueGrowth: 11,
  pendingVerif: 7, pendingWithdraw: 4,
};

const CREATORS_INIT = [
  { id: "CRT-001", name: "Hendra Yusuf",   email: "hendra@example.com",   events: 5, revenue: 620_000_000, status: "pending",  ktp: true, photo: true, legality: true  },
  { id: "CRT-002", name: "Live Nation ID",  email: "live@livenation.co.id", events: 12, revenue: 2_400_000_000, status: "verified", ktp: true, photo: true, legality: true  },
  { id: "CRT-003", name: "Ahmad Fauzi",    email: "ahmad@example.com",     events: 0,  revenue: 0,           status: "pending",  ktp: true, photo: false, legality: false },
  { id: "CRT-004", name: "Nita Kurnia",    email: "nita@example.com",      events: 2,  revenue: 85_000_000,  status: "rejected", ktp: true, photo: true, legality: false },
  { id: "CRT-005", name: "Event Nusantara",email: "en@eventnusantara.id",   events: 7,  revenue: 310_000_000, status: "pending",  ktp: true, photo: true, legality: true  },
];

const EVENTS_INIT = [
  { id: "EVT-001", name: "Coldplay Music of the Spheres Tour", creator: "Live Nation ID", date: "2025-05-15", tickets: "VIP / Cat1 / Cat2 / Gen", status: "pending",  genre: "Music" },
  { id: "EVT-002", name: "Bali Arts & Culture Night",          creator: "Hendra Yusuf",   date: "2025-07-04", tickets: "GA / VIP",               status: "pending",  genre: "Festival" },
  { id: "EVT-003", name: "Stand Up Comedy: Spesial Malam",     creator: "Ahmad Fauzi",    date: "2025-04-30", tickets: "Regular",                 status: "approved", genre: "Comedy" },
  { id: "EVT-004", name: "Java Jazz Festival 2025",            creator: "Event Nusantara",date: "2025-06-20", tickets: "All Access / Regular",    status: "approved", genre: "Music" },
  { id: "EVT-005", name: "Jakarta Food & Music Fest",          creator: "Nita Kurnia",    date: "2025-08-10", tickets: "Early Bird / Regular",    status: "pending",  genre: "Festival" },
];

const USERS_INIT = [
  { id: "USR-001", name: "Budi Santoso",  email: "budi@example.com",   role: "user",  status: "active",    spend: 3_400_000, joined: "2024-01-15" },
  { id: "USR-002", name: "Rina Dewi",     email: "rina@example.com",   role: "user",  status: "active",    spend: 1_250_000, joined: "2024-03-22" },
  { id: "USR-003", name: "Ahmad Fauzi",   email: "ahmad@example.com",  role: "organizer", status: "active", spend: 0,         joined: "2024-02-10" },
  { id: "USR-004", name: "Siti Aminah",   email: "siti@example.com",   role: "user",  status: "active",    spend: 2_800_000, joined: "2024-04-05" },
  { id: "USR-005", name: "Dian Pratama",  email: "dian@example.com",   role: "user",  status: "suspended", spend: 750_000,   joined: "2024-05-20" },
  { id: "USR-006", name: "Hendra Yusuf",  email: "hendra@example.com", role: "organizer", status: "active", spend: 0,        joined: "2023-12-01" },
  { id: "USR-007", name: "Nita Kurnia",   email: "nita@example.com",   role: "user",  status: "active",    spend: 5_200_000, joined: "2023-11-14" },
];

const TXN_INIT = [
  { id: "TXN-0091", user: "Budi Santoso",  event: "Coldplay World Tour",     method: "VA",      amount: 2_500_000, status: "paid",      date: "2025-05-10", ref: "VA202505100091" },
  { id: "TXN-0090", user: "Rina Dewi",     event: "Java Jazz 2025",          method: "E-Wallet", amount: 500_000,  status: "paid",      date: "2025-05-10", ref: "EWL202505100090" },
  { id: "TXN-0089", user: "Ahmad Fauzi",   event: "BRI Liga 1",              method: "CC",      amount: 125_000,   status: "pending",   date: "2025-05-09", ref: "CC202505090089" },
  { id: "TXN-0088", user: "Siti Aminah",   event: "Stand Up Comedy",         method: "VA",      amount: 350_000,   status: "paid",      date: "2025-05-09", ref: "VA202505090088" },
  { id: "TXN-0087", user: "Dian Pratama",  event: "Bali Arts Festival",      method: "E-Wallet", amount: 75_000,   status: "failed",    date: "2025-05-08", ref: "EWL202505080087" },
  { id: "TXN-0086", user: "Nita Kurnia",   event: "Jakarta Food Festival",   method: "CC",      amount: 1_500_000, status: "paid",      date: "2025-05-07", ref: "CC202505070086" },
];

const WD_INIT = [
  { id: "WD-021", creator: "Live Nation ID",  bank: "BCA",     account: "12345678", holder: "Live Nation", amount: 800_000_000, status: "pending",   date: "2025-05-11" },
  { id: "WD-020", creator: "Hendra Yusuf",    bank: "Mandiri", account: "98765432", holder: "Hendra Y.",   amount: 200_000_000, status: "pending",   date: "2025-05-10" },
  { id: "WD-019", creator: "Event Nusantara", bank: "BRI",     account: "11223344", holder: "Event Nus.",  amount: 150_000_000, status: "approved",  date: "2025-05-08" },
  { id: "WD-018", creator: "Nita Kurnia",     bank: "BCA",     account: "55667788", holder: "Nita K.",     amount: 50_000_000,  status: "rejected",  date: "2025-05-06" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const IDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const CARD = "bg-neutral-900 border border-neutral-800 rounded-xl";

const STATUS_MAP = {
  active:    { dot: "bg-emerald-400", label: "Aktif" },
  pending:   { dot: "bg-yellow-500",  label: "Pending" },
  verified:  { dot: "bg-emerald-400", label: "Verified" },
  approved:  { dot: "bg-emerald-400", label: "Approved" },
  rejected:  { dot: "bg-red-500",     label: "Rejected" },
  suspended: { dot: "bg-red-400",     label: "Suspended" },
  paid:      { dot: "bg-emerald-400", label: "Paid" },
  failed:    { dot: "bg-red-500",     label: "Failed" },
  draft:     { dot: "bg-neutral-500", label: "Draft" },
};

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

function Msg({ ok, text }) {
  if (!text) return null;
  return <p className={`text-xs ${ok ? "text-emerald-400" : "text-red-400"}`}>{text}</p>;
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview() {
  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",    value: KPI.users.toLocaleString(),   growth: KPI.usersGrowth,    icon: "\ud83d\udc65" },
          { label: "Total Creators", value: KPI.creators.toLocaleString(), growth: KPI.creatorsGrowth, icon: "\ud83c\udfac" },
          { label: "Tickets Sold",   value: KPI.tickets.toLocaleString(),  growth: KPI.ticketsGrowth,  icon: "\ud83c\udf9f\ufe0f" },
          { label: "Total Revenue",  value: IDR(KPI.revenue),              growth: KPI.revenueGrowth,  icon: "\ud83d\udcb0" },
        ].map((k) => (
          <div key={k.label} className={`${CARD} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">{k.label}</p>
              <span className="text-lg">{k.icon}</span>
            </div>
            <p className="text-xl font-bold text-white mb-1">{k.value}</p>
            <Trend v={k.growth} />
          </div>
        ))}
      </div>

      {/* Actionable alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${CARD} p-4 flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl flex-shrink-0">
            \ud83d\udcc4
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-neutral-500">Pending Verifikasi Creator</p>
            <p className="text-2xl font-bold text-white mt-0.5">{KPI.pendingVerif}</p>
          </div>
          <span className="ml-auto text-[11px] text-yellow-400 font-semibold">Perlu tindakan</span>
        </div>
        <div className={`${CARD} p-4 flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl flex-shrink-0">
            \ud83d\udcb8
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-neutral-500">Pending Pencairan</p>
            <p className="text-2xl font-bold text-white mt-0.5">{KPI.pendingWithdraw}</p>
          </div>
          <span className="ml-auto text-[11px] text-yellow-400 font-semibold">Perlu tindakan</span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="px-5 pt-5 pb-1"><SecTitle>Transaksi Terkini</SecTitle></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-800">
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Event</th>
                <th className="px-5 py-3 text-left">Metode</th>
                <th className="px-5 py-3 text-left">Jumlah</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {TXN_INIT.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
                  <td className="px-5 py-3 text-neutral-300 font-medium">{r.user}</td>
                  <td className="px-5 py-3 text-neutral-400 max-w-[180px] truncate">{r.event}</td>
                  <td className="px-5 py-3 text-neutral-500 text-[11px]">{r.method}</td>
                  <td className="px-5 py-3 text-white font-medium">{IDR(r.amount)}</td>
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

// ── Creators ──────────────────────────────────────────────────────────────────
function Creators() {
  const [creators, setCreators] = useState(CREATORS_INIT);
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);
  const [search, setSearch] = useState("");

  function approve(id) {
    setCreators((cs) => cs.map((c) => (c.id === id ? { ...c, status: "verified" } : c)));
    setModal(null);
    setMsg({ ok: true, text: "Creator berhasil diverifikasi." });
    setTimeout(() => setMsg(null), 3000);
  }

  function reject(id) {
    if (!reason.trim()) { setMsg({ ok: false, text: "Masukkan alasan penolakan." }); return; }
    setCreators((cs) => cs.map((c) => (c.id === id ? { ...c, status: "rejected" } : c)));
    setModal(null);
    setReason("");
    setMsg({ ok: true, text: "Creator ditolak." });
    setTimeout(() => setMsg(null), 3000);
  }

  const displayed = creators.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <SecTitle>Verifikasi Creator (KYC)</SecTitle>
        <div className="ml-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari creator..."
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 w-48"
          />
        </div>
      </div>
      <Msg ok={msg?.ok} text={msg?.text} />

      <div className="space-y-3">
        {displayed.map((c) => (
          <div key={c.id} className={`${CARD} p-4`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{c.email} · {c.id}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[
                    { label: "KTP",       ok: c.ktp },
                    { label: "Foto",      ok: c.photo },
                    { label: "Legalitas", ok: c.legality },
                  ].map((d) => (
                    <span
                      key={d.label}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${d.ok ? "border-emerald-800 text-emerald-400" : "border-red-900 text-red-400"}`}
                    >
                      {d.ok ? "\u2713" : "\u2717"} {d.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Dot status={c.status} />
                {c.status === "pending" && (
                  <button
                    onClick={() => { setModal(c); setReason(""); setMsg(null); }}
                    className="text-[11px] border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
            {c.events > 0 && (
              <p className="text-[11px] text-neutral-600 mt-2">
                {c.events} event · {IDR(c.revenue)} total revenue
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{modal.name}</p>
                <p className="text-[11px] text-neutral-500">{modal.email}</p>
              </div>
              <button onClick={() => setModal(null)} className="text-neutral-500 hover:text-white text-lg">
                \u00d7
              </button>
            </div>

            {/* KYC doc checklist */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Dokumen KYC</p>
              {[
                { label: "KTP / ID Nasional", ok: modal.ktp },
                { label: "Foto Formal",       ok: modal.photo },
                { label: "Legalitas Perusahaan", ok: modal.legality },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between border border-neutral-800 rounded-lg px-4 py-2.5">
                  <p className="text-sm text-neutral-300">{d.label}</p>
                  <span className={`text-xs font-semibold ${d.ok ? "text-emerald-400" : "text-red-400"}`}>
                    {d.ok ? "\u2713 Uploaded" : "\u2717 Missing"}
                  </span>
                </div>
              ))}
            </div>

            {/* Rejection reason */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Alasan Penolakan (opsional untuk approval)
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Dokumen tidak lengkap / tidak valid..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
              />
            </div>
            <Msg ok={msg?.ok} text={msg?.text} />

            <div className="flex gap-3">
              <button
                onClick={() => reject(modal.id)}
                className="flex-1 border border-red-900 text-red-400 hover:border-red-700 hover:text-red-300 py-2 rounded-lg text-sm transition-colors"
              >
                Tolak
              </button>
              <button
                onClick={() => approve(modal.id)}
                className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────
function Events() {
  const [events, setEvents] = useState(EVENTS_INIT);
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);
  const [filter, setFilter] = useState("all");

  function approve(id) {
    setEvents((es) => es.map((e) => (e.id === id ? { ...e, status: "approved" } : e)));
    setModal(null);
    setMsg({ ok: true, text: "Event disetujui dan sekarang live." });
    setTimeout(() => setMsg(null), 3000);
  }

  function reject(id) {
    if (!reason.trim()) { setMsg({ ok: false, text: "Masukkan feedback penolakan." }); return; }
    setEvents((es) => es.map((e) => (e.id === id ? { ...e, status: "rejected" } : e)));
    setModal(null);
    setReason("");
    setMsg({ ok: true, text: "Event ditolak, feedback dikirim ke creator." });
    setTimeout(() => setMsg(null), 3000);
  }

  const displayed = events.filter((e) => filter === "all" || e.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <SecTitle>Persetujuan Event</SecTitle>
        <div className="ml-auto flex gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] capitalize px-3 py-1 rounded-lg border transition-colors ${
                filter === f
                  ? "border-neutral-500 text-white bg-neutral-800"
                  : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <Msg ok={msg?.ok} text={msg?.text} />

      <div className="space-y-3">
        {displayed.map((ev) => (
          <div key={ev.id} className={`${CARD} p-4`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{ev.name}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {ev.creator} · {ev.date} · {ev.genre}
                </p>
                <p className="text-[11px] text-neutral-600 mt-1">Tiket: {ev.tickets}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Dot status={ev.status} />
                {ev.status === "pending" && (
                  <button
                    onClick={() => { setModal(ev); setReason(""); setMsg(null); }}
                    className="text-[11px] border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {displayed.length === 0 && (
          <p className="text-center text-neutral-600 text-sm py-8">Tidak ada event dengan filter ini.</p>
        )}
      </div>

      {/* Review Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{modal.name}</p>
                <p className="text-[11px] text-neutral-500">{modal.creator} · {modal.date}</p>
              </div>
              <button onClick={() => setModal(null)} className="text-neutral-500 hover:text-white text-lg">\u00d7</button>
            </div>
            <div className="space-y-2 text-[12px]">
              {[
                { k: "Genre",      v: modal.genre },
                { k: "Tanggal",    v: modal.date },
                { k: "Tiket",      v: modal.tickets },
                { k: "Creator",    v: modal.creator },
              ].map((r) => (
                <div key={r.k} className="flex justify-between border-b border-neutral-800 pb-1">
                  <span className="text-neutral-500">{r.k}</span>
                  <span className="text-neutral-300">{r.v}</span>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Feedback / Alasan Penolakan
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Deskripsi kurang lengkap / konten tidak sesuai..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
              />
            </div>
            <Msg ok={msg?.ok} text={msg?.text} />
            <div className="flex gap-3">
              <button onClick={() => reject(modal.id)} className="flex-1 border border-red-900 text-red-400 hover:border-red-700 py-2 rounded-lg text-sm transition-colors">Tolak</button>
              <button onClick={() => approve(modal.id)} className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Setujui</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [txnSearch, setTxnSearch] = useState("");
  const [activeSection, setActiveSection] = useState("users");

  const filteredUsers = USERS_INIT.filter((u) => {
    const q = search.toLowerCase();
    const matchName = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchName && matchRole;
  });

  const filteredTxn = TXN_INIT.filter((t) => {
    const q = txnSearch.toLowerCase();
    return !q || t.user.toLowerCase().includes(q) || t.event.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Section toggle */}
      <div className="flex gap-2">
        {[
          { key: "users", label: "Direktori Pengguna" },
          { key: "txn",   label: "Audit Transaksi" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`text-[11px] px-4 py-1.5 rounded-lg border transition-colors ${
              activeSection === s.key
                ? "border-neutral-500 text-white bg-neutral-800"
                : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "users" && (
        <div className={`${CARD} overflow-hidden`}>
          <div className="px-5 pt-5 pb-3 flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
            />
            <div className="flex gap-2">
              {["all", "user", "organizer"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`text-[11px] capitalize px-3 py-1.5 rounded-lg border transition-colors ${
                    roleFilter === r
                      ? "border-neutral-500 text-white bg-neutral-800"
                      : "border-neutral-700 text-neutral-500"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-800">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Nama</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Total Spend</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{u.id}</td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-[11px] text-neutral-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 capitalize text-[12px]">{u.role}</td>
                    <td className="px-5 py-3 text-white">{u.spend ? IDR(u.spend) : "\u2014"}</td>
                    <td className="px-5 py-3"><Dot status={u.status} /></td>
                    <td className="px-5 py-3 text-neutral-500 tabular-nums">{u.joined}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-600 text-sm">Tidak ada pengguna ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-neutral-800 text-[11px] text-neutral-600">
            Menampilkan {filteredUsers.length} dari {USERS_INIT.length} pengguna
          </div>
        </div>
      )}

      {activeSection === "txn" && (
        <div className={`${CARD} overflow-hidden`}>
          <div className="px-5 pt-5 pb-3">
            <input
              value={txnSearch}
              onChange={(e) => setTxnSearch(e.target.value)}
              placeholder="Cari user, event, ID, atau ref..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-800">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Event</th>
                  <th className="px-5 py-3 text-left">Metode</th>
                  <th className="px-5 py-3 text-left">Jumlah</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredTxn.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{t.id}</td>
                    <td className="px-5 py-3 text-neutral-300">{t.user}</td>
                    <td className="px-5 py-3 text-neutral-400 max-w-[150px] truncate">{t.event}</td>
                    <td className="px-5 py-3 text-[11px] text-neutral-500">{t.method}</td>
                    <td className="px-5 py-3 text-white font-medium">{IDR(t.amount)}</td>
                    <td className="px-5 py-3"><Dot status={t.status} /></td>
                    <td className="px-5 py-3 font-mono text-[10px] text-neutral-600 truncate max-w-[130px]">{t.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Withdrawals ───────────────────────────────────────────────────────────────
function Withdrawals() {
  const [wds, setWds] = useState(WD_INIT);
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);
  const [filter, setFilter] = useState("all");

  const PLAT_FEE = 0.05;
  const TAX = 0.02;

  function calcNet(amt) {
    return amt - amt * PLAT_FEE - amt * TAX;
  }

  function approve(id) {
    setWds((ws) => ws.map((w) => (w.id === id ? { ...w, status: "approved" } : w)));
    setModal(null);
    setMsg({ ok: true, text: "Transfer disetujui." });
    setTimeout(() => setMsg(null), 3000);
  }

  function reject(id) {
    if (!reason.trim()) { setMsg({ ok: false, text: "Masukkan alasan penolakan." }); return; }
    setWds((ws) => ws.map((w) => (w.id === id ? { ...w, status: "rejected" } : w)));
    setModal(null);
    setReason("");
    setMsg({ ok: true, text: "Pencairan ditolak." });
    setTimeout(() => setMsg(null), 3000);
  }

  const displayed = wds.filter((w) => filter === "all" || w.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <SecTitle>Manajemen Pencairan</SecTitle>
        <div className="ml-auto flex gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] capitalize px-3 py-1 rounded-lg border transition-colors ${
                filter === f
                  ? "border-neutral-500 text-white bg-neutral-800"
                  : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <Msg ok={msg?.ok} text={msg?.text} />

      <div className="space-y-3">
        {displayed.map((w) => {
          const net = calcNet(w.amount);
          return (
            <div key={w.id} className={`${CARD} p-4`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{w.creator}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {w.bank} · {w.account} · {w.holder}
                  </p>
                  <div className="flex gap-4 mt-2 text-[12px]">
                    <span className="text-neutral-400">Bruto: <span className="text-white">{IDR(w.amount)}</span></span>
                    <span className="text-neutral-500">Fee 5%: {IDR(w.amount * PLAT_FEE)}</span>
                    <span className="text-neutral-500">PPh 2%: {IDR(w.amount * TAX)}</span>
                    <span className="text-neutral-300 font-semibold">Net: {IDR(net)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-1">{w.date} · {w.id}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Dot status={w.status} />
                  {w.status === "pending" && (
                    <button
                      onClick={() => { setModal(w); setReason(""); setMsg(null); }}
                      className="text-[11px] border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Proses
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <p className="text-center text-neutral-600 text-sm py-8">Tidak ada pencairan.</p>
        )}
      </div>

      {/* Process Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{modal.creator}</p>
                <p className="text-[11px] text-neutral-500">{modal.id}</p>
              </div>
              <button onClick={() => setModal(null)} className="text-neutral-500 hover:text-white text-lg">\u00d7</button>
            </div>
            {/* Fee breakdown */}
            <div className="bg-neutral-800/60 rounded-lg p-4 text-sm space-y-1.5">
              <div className="flex justify-between text-neutral-400"><span>Jumlah Bruto</span><span>{IDR(modal.amount)}</span></div>
              <div className="flex justify-between text-neutral-500"><span>Platform Fee (5%)</span><span>\u2013 {IDR(modal.amount * PLAT_FEE)}</span></div>
              <div className="flex justify-between text-neutral-500"><span>PPh 2%</span><span>\u2013 {IDR(modal.amount * TAX)}</span></div>
              <div className="flex justify-between text-white font-semibold border-t border-neutral-700 pt-2"><span>Yang Ditransfer</span><span>{IDR(calcNet(modal.amount))}</span></div>
            </div>
            {/* Bank details */}
            <div className="space-y-1.5 text-[12px]">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Rekening Tujuan</p>
              {[
                { k: "Bank",     v: modal.bank },
                { k: "No. Rek",  v: modal.account },
                { k: "Pemilik",  v: modal.holder },
              ].map((r) => (
                <div key={r.k} className="flex justify-between border-b border-neutral-800 pb-1">
                  <span className="text-neutral-500">{r.k}</span>
                  <span className="text-neutral-300 font-mono">{r.v}</span>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">Alasan Penolakan</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Data rekening tidak valid..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
              />
            </div>
            <Msg ok={msg?.ok} text={msg?.text} />
            <div className="flex gap-3">
              <button onClick={() => reject(modal.id)} className="flex-1 border border-red-900 text-red-400 hover:border-red-700 py-2 rounded-lg text-sm transition-colors">Tolak</button>
              <button onClick={() => approve(modal.id)} className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">Proses Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Per-tab background containers ─────────────────────────────────────────────
const TAB_WRAP = {
  overview:    { style: { background: "radial-gradient(ellipse 90% 40% at 50% -5%, rgba(232,65,30,0.07) 0%, #0d0d0d 60%)" }, cls: "rounded-2xl p-5 md:p-6" },
  creators:    { style: { background: "linear-gradient(145deg, #080c18 0%, #0b0b10 100%)" },                                  cls: "rounded-2xl p-5 md:p-6 border-l-2 border-secondary/30" },
  events:      { style: { background: "linear-gradient(145deg, #0e0810 0%, #0d0d0d 100%)" },                                  cls: "rounded-2xl p-5 md:p-6 border-l-2 border-purple-900/40" },
  users:       { style: { background: "linear-gradient(145deg, #07100a 0%, #0c0c0c 100%)" },                                  cls: "rounded-2xl p-5 md:p-6 border-t border-emerald-900/30" },
  withdrawals: { style: { background: "linear-gradient(145deg, #0f0f0a 0%, #0d0d0d 100%)" },                                  cls: "rounded-2xl p-5 md:p-6 border-l-2 border-neutral-700/40" },
};

const TAB_TITLES = {
  overview:    "Admin Overview",
  creators:    "Creator Verification",
  events:      "Event Approval",
  users:       "Users & Transactions",
  withdrawals: "Withdrawals",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);

  const tab = router.query.tab ?? "overview";

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoading(false);
  }, [router]);

  const wrap = TAB_WRAP[tab] ?? TAB_WRAP.overview;

  return (
    <>
      <Head><title>{TAB_TITLES[tab] ?? "Admin Dashboard"} \u2013 TiketKu</title></Head>
      <DashboardLayout title={TAB_TITLES[tab] ?? "Admin Dashboard"} variant="dark">
        {loading ? (
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : (
          <div className={wrap.cls} style={wrap.style}>
            {tab === "overview"    && <Overview />}
            {tab === "creators"    && <Creators />}
            {tab === "events"      && <Events />}
            {tab === "users"       && <Users />}
            {tab === "withdrawals" && <Withdrawals />}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
