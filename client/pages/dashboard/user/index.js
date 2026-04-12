import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth, getUser } from "@/lib/auth";
import { fetchMyOrders } from "@/lib/api";

// ── placeholder data ──────────────────────────────────────────────────────────
const PLACEHOLDER_TICKETS = [
  { id: "TKT-0091", event: "Konser Sheila On 7 – KSATRIA",      date: "30 Agustus 2025",  time: "20:00", location: "Istora Senayan, Jakarta",      type: "Category A",      price: 550000,  status: "active",    orderedAt: "2025-04-10" },
  { id: "TKT-0078", event: "Noah Live in Concert 2025",           date: "14 September 2025",time: "19:30", location: "Gelora Bung Karno, Jakarta",   type: "VVIP",            price: 950000,  status: "active",    orderedAt: "2025-04-05" },
  { id: "TKT-0055", event: "Dewa 19 Reunion Tour",                date: "5 Oktober 2025",   time: "20:00", location: "JIExpo Kemayoran, Jakarta",    type: "General",         price: 350000,  status: "active",    orderedAt: "2025-03-28" },
  { id: "TKT-0044", event: "Java Jazz Festival 2024",             date: "2 Juni 2024",      time: "10:00", location: "JIExpo Kemayoran, Jakarta",    type: "General Admission",price: 500000, status: "completed", orderedAt: "2024-05-01" },
  { id: "TKT-0032", event: "Coldplay – Music of the Spheres",     date: "15 November 2024", time: "19:00", location: "Gelora Bung Karno, Jakarta",   type: "Category 2",      price: 850000,  status: "completed", orderedAt: "2024-10-01" },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ID_MONTHS = {
  Januari:"01",Februari:"02",Maret:"03",April:"04",Mei:"05",Juni:"06",
  Juli:"07",Agustus:"08",September:"09",Oktober:"10",November:"11",Desember:"12",
};

function parseIdDate(s) {
  const m = s.match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!m) return null;
  const mo = ID_MONTHS[m[2]];
  return mo ? `${m[3]}${mo}${m[1].padStart(2,"0")}` : null;
}

function buildGCalUrl(t) {
  const d = parseIdDate(t.date);
  if (!d) return null;
  const ts = (t.time ?? "19:00").replace(":","");
  const eh = String(parseInt(ts.slice(0,2)) + 2).padStart(2,"0");
  const params = new URLSearchParams({
    action: "TEMPLATE", text: t.event,
    dates: `${d}T${ts}00/${d}T${eh}${ts.slice(2)}00`,
    location: t.location,
    details: `Tiket: ${t.type} · ${t.id}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function generateQR(id) {
  const seed = id.split("").reduce((a,c) => a + c.charCodeAt(0), 0);
  return Array.from({length:21}, (_,y) =>
    Array.from({length:21}, (_,x) => {
      const fin = (x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12);
      if (fin) {
        const fx = x<8?x:x-14, fy = y<8?y:y-14;
        return (fx===0||fx===6||fy===0||fy===6||( fx>=2&&fx<=4&&fy>=2&&fy<=4)) ? 1 : 0;
      }
      return (seed + x*13 + y*17) % 2;
    })
  );
}

// ── tiny shared primitives ────────────────────────────────────────────────────
const CARD = "bg-neutral-900 border border-neutral-800 rounded-xl";

const STATUS = {
  active:    { dot: "bg-emerald-400", label: "Aktif" },
  completed: { dot: "bg-neutral-600", label: "Selesai" },
  cancelled: { dot: "bg-red-500",     label: "Batal" },
};

function Badge({ status }) {
  const s = STATUS[status] ?? STATUS.cancelled;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── QR modal ──────────────────────────────────────────────────────────────────
function QRModal({ ticket, onClose }) {
  const grid = generateQR(ticket.id);
  const gcUrl = buildGCalUrl(ticket);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative ${CARD} p-6 w-full max-w-xs`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white text-sm">✕</button>

        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{ticket.id}</p>
        <p className="text-white font-semibold text-sm leading-snug mb-4">{ticket.event}</p>

        {/* QR */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-2.5 rounded-lg">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(21,9px)", gap:"1px" }}>
              {grid.flat().map((c,i) => (
                <div key={i} style={{ width:9, height:9, backgroundColor: c ? "#000":"#fff" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-400 space-y-1 mb-4">
          <p>{ticket.date} · {ticket.time} WIB</p>
          <p>{ticket.location}</p>
          <p>{ticket.type} · {fmtIDR(ticket.price)}</p>
        </div>

        {gcUrl && (
          <a href={gcUrl} target="_blank" rel="noreferrer"
             className="block w-full text-center text-xs text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg py-2 transition-colors">
            Tambah ke Google Calendar
          </a>
        )}
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function Overview({ tickets, user }) {
  const active = tickets.filter(t => t.status === "active");
  const totalSpend = tickets.reduce((s,t) => s + t.price, 0);
  const recent = [...tickets].sort((a,b) => b.orderedAt.localeCompare(a.orderedAt)).slice(0,3);

  return (
    <div className="space-y-5">
      {/* stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tiket Aktif",       value: active.length },
          { label: "Total Belanja",     value: fmtIDR(totalSpend) },
          { label: "Event Mendatang",   value: active.length },
        ].map(s => (
          <div key={s.label} className={`${CARD} p-4`}>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* recent activity */}
      <div className={CARD}>
        <div className="px-4 pt-4 pb-3 border-b border-neutral-800">
          <p className="text-[11px] uppercase tracking-widest text-neutral-500">Aktivitas Terbaru</p>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-neutral-600 text-center py-8">Belum ada aktivitas.</p>
        ) : (
          <ul>
            {recent.map((t, i) => (
              <li key={t.id} className={`flex items-center justify-between px-4 py-3 ${i < recent.length-1 ? "border-b border-neutral-800":""}`}>
                <div className="min-w-0 mr-4">
                  <p className="text-sm text-white truncate">{t.event}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{t.orderedAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-white">{fmtIDR(t.price)}</p>
                  <Badge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* cta */}
      <div className={`${CARD} px-4 py-3 flex items-center justify-between`}>
        <p className="text-sm text-neutral-300">
          Hai, <span className="text-white font-medium">{user?.name?.split(" ")[0] ?? "Pengguna"}</span> — {active.length} tiket aktif.
        </p>
        <Link href="/events" className="text-xs text-primary hover:underline flex-shrink-0">Jelajah →</Link>
      </div>
    </div>
  );
}

// ── My Tickets tab ────────────────────────────────────────────────────────────
function MyTickets({ tickets }) {
  const [filter, setFilter] = useState("all");
  const [qr, setQr] = useState(null);

  const shown = filter === "all" ? tickets : tickets.filter(t => t.status === filter);
  const FILTERS = ["all","active","completed","cancelled"];

  return (
    <div className="space-y-4">
      {/* filter bar */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              filter === f ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}>
            {f === "all" ? "Semua" : STATUS[f]?.label ?? f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className={`${CARD} p-10 text-center`}>
          <p className="text-neutral-500 text-sm mb-3">Tidak ada tiket.</p>
          <Link href="/events" className="text-xs text-primary hover:underline">Beli tiket →</Link>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className={`${CARD} hidden lg:block overflow-hidden`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  {["Event","Tanggal","Lokasi","Tipe","Harga","Status",""].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-neutral-500 px-4 py-3 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((t,i) => {
                  const gcUrl = buildGCalUrl(t);
                  return (
                    <tr key={t.id} className={`${i < shown.length-1 ? "border-b border-neutral-800":""} hover:bg-neutral-800/50 transition-colors`}>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium text-sm">{t.event}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">{t.id}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-400 text-sm whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3 text-neutral-400 text-sm max-w-[160px] truncate">{t.location}</td>
                      <td className="px-4 py-3 text-neutral-400 text-sm">{t.type}</td>
                      <td className="px-4 py-3 text-white text-sm whitespace-nowrap">{fmtIDR(t.price)}</td>
                      <td className="px-4 py-3"><Badge status={t.status} /></td>
                      <td className="px-4 py-3">
                        {t.status === "active" && (
                          <div className="flex gap-3">
                            <button onClick={() => setQr(t)} className="text-xs text-primary hover:underline">QR</button>
                            {gcUrl && <a href={gcUrl} target="_blank" rel="noreferrer" className="text-xs text-neutral-400 hover:text-white">Cal</a>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="lg:hidden space-y-2">
            {shown.map(t => {
              const gcUrl = buildGCalUrl(t);
              return (
                <div key={t.id} className={`${CARD} p-4`}>
                  <div className="flex justify-between gap-2 mb-1">
                    <p className="text-sm text-white font-medium leading-snug">{t.event}</p>
                    <Badge status={t.status} />
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-2">{t.date} · {t.location}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">{fmtIDR(t.price)}</p>
                    {t.status === "active" && (
                      <div className="flex gap-3">
                        <button onClick={() => setQr(t)} className="text-xs text-primary hover:underline">QR</button>
                        {gcUrl && <a href={gcUrl} target="_blank" rel="noreferrer" className="text-xs text-neutral-400 hover:text-white">Kalender</a>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {qr && <QRModal ticket={qr} onClose={() => setQr(null)} />}
    </div>
  );
}

// ── Settings tab ──────────────────────────────────────────────────────────────
const COMMON_PW = ["123456","password","qwerty","abc123","111111","letmein"];

function validatePassword(pw, name) {
  if (pw.length < 8) return "Minimal 8 karakter.";
  if (!/[A-Z]/.test(pw)) return "Butuh huruf kapital.";
  if (!/[a-z]/.test(pw)) return "Butuh huruf kecil.";
  if (!/[0-9]/.test(pw)) return "Butuh angka.";
  if (!/[*#@$%^&+=!?]/.test(pw)) return "Butuh karakter spesial (*#@$%^&+=!?).";
  if (name && pw.toLowerCase().includes(name.toLowerCase().split(" ")[0])) return "Jangan gunakan nama Anda.";
  if (COMMON_PW.some(c => pw.toLowerCase().includes(c))) return "Password terlalu umum.";
  return null;
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{label}</label>
      <input {...props}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors" />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-800 last:border-0">
      <p className="text-sm text-neutral-300">{label}</p>
      <button onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-neutral-700"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all`}
              style={{ left: value ? "1.25rem" : "0.125rem" }} />
      </button>
    </div>
  );
}

function Msg({ ok, text }) {
  if (!text) return null;
  return <p className={`text-xs ${ok ? "text-emerald-400" : "text-red-400"}`}>{text}</p>;
}

function Settings({ user }) {
  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "" });
  const [profileMsg, setProfileMsg] = useState(null);

  const [pw, setPw] = useState({ current:"", next:"", confirm:"" });
  const [pwMsg, setPwMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const [twoFA, setTwoFA] = useState(false);
  const [tfaStep, setTfaStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [tfaMsg, setTfaMsg] = useState(null);

  const [notifs, setNotifs] = useState({ email:true, sms:false, push:true, newsletter:false, promo:false });

  function saveProfile(e) {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) { setProfileMsg({ ok:false, text:"Nama & email wajib diisi." }); return; }
    setProfileMsg({ ok:true, text:"Profil disimpan." });
    setTimeout(() => setProfileMsg(null), 3000);
  }

  function changePassword(e) {
    e.preventDefault();
    if (!pw.current) { setPwMsg({ ok:false, text:"Masukkan password saat ini." }); return; }
    const err = validatePassword(pw.next, profile.name);
    if (err) { setPwMsg({ ok:false, text:err }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ ok:false, text:"Konfirmasi tidak cocok." }); return; }
    setPwMsg({ ok:true, text:"Password diperbarui." });
    setPw({ current:"", next:"", confirm:"" });
    setTimeout(() => setPwMsg(null), 3000);
  }

  function toggleTfa() {
    if (!twoFA && tfaStep === 0) { setTfaStep(1); setTfaMsg({ ok:true, text:`OTP dikirim ke ${profile.email}` }); return; }
    if (twoFA) { setTwoFA(false); setTfaStep(0); setTfaMsg({ ok:true, text:"2FA dinonaktifkan." }); setTimeout(()=>setTfaMsg(null),3000); }
  }

  function verifyOtp(e) {
    e.preventDefault();
    if (otp.length !== 6) { setTfaMsg({ ok:false, text:"Masukkan 6 digit OTP." }); return; }
    setTwoFA(true); setTfaStep(2); setOtp("");
    setTfaMsg({ ok:true, text:"2FA aktif." }); setTimeout(()=>setTfaMsg(null),3000);
  }

  const SectionTitle = ({ children }) => (
    <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-4">{children}</p>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Profile */}
      <div className={`${CARD} p-5`}>
        <SectionTitle>Profil</SectionTitle>
        <form onSubmit={saveProfile} className="space-y-3">
          <Field label="Nama" type="text"  value={profile.name}  onChange={e => setProfile(p=>({...p,name:e.target.value}))} />
          <Field label="Email" type="email" value={profile.email} onChange={e => setProfile(p=>({...p,email:e.target.value}))} />
          <Field label="Telepon" type="tel" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} />
          <Msg {...(profileMsg ?? { ok:true, text:"" })} />
          <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">
            Simpan
          </button>
        </form>
      </div>

      {/* Password */}
      <div className={`${CARD} p-5`}>
        <SectionTitle>Ubah Password</SectionTitle>
        <form onSubmit={changePassword} className="space-y-3">
          <Field label="Password Saat Ini"   type={showPw?"text":"password"} value={pw.current}  onChange={e => setPw(p=>({...p,current:e.target.value}))} />
          <Field label="Password Baru"        type={showPw?"text":"password"} value={pw.next}     onChange={e => setPw(p=>({...p,next:e.target.value}))} />
          <Field label="Konfirmasi Password" type={showPw?"text":"password"} value={pw.confirm}  onChange={e => setPw(p=>({...p,confirm:e.target.value}))} />
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-500">
            <input type="checkbox" checked={showPw} onChange={e=>setShowPw(e.target.checked)} className="accent-primary" />
            Tampilkan
          </label>
          <Msg {...(pwMsg ?? { ok:true, text:"" })} />
          <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">
            Ubah
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className={`${CARD} p-5`}>
        <SectionTitle>Autentikasi Dua Faktor</SectionTitle>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-300">Status</p>
          <Badge status={twoFA ? "active" : "cancelled"} />
        </div>
        {tfaStep === 1 && (
          <form onSubmit={verifyOtp} className="space-y-3 mb-3">
            <input type="text" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
              placeholder="6-digit OTP"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white text-center tracking-widest focus:outline-none focus:border-neutral-500 transition-colors" />
            <button type="submit" className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">
              Verifikasi
            </button>
          </form>
        )}
        <Msg {...(tfaMsg ?? { ok:true, text:"" })} />
        {tfaStep !== 1 && (
          <button onClick={toggleTfa}
            className="w-full mt-3 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 hover:text-white py-2 rounded-lg transition-colors">
            {twoFA ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
          </button>
        )}
      </div>

      {/* Notifikasi */}
      <div className={`${CARD} p-5`}>
        <SectionTitle>Notifikasi</SectionTitle>
        <Toggle label="Email"        value={notifs.email}      onChange={v => setNotifs(n=>({...n,email:v}))} />
        <Toggle label="SMS"          value={notifs.sms}        onChange={v => setNotifs(n=>({...n,sms:v}))} />
        <Toggle label="Push"         value={notifs.push}       onChange={v => setNotifs(n=>({...n,push:v}))} />
        <Toggle label="Newsletter"   value={notifs.newsletter} onChange={v => setNotifs(n=>({...n,newsletter:v}))} />
        <Toggle label="Promo"        value={notifs.promo}      onChange={v => setNotifs(n=>({...n,promo:v}))} />
      </div>
    </div>
  );
}

// ── Per-tab visual containers ─────────────────────────────────────────────────
const TAB_WRAP = {
  overview: {
    style: { background: "radial-gradient(ellipse 90% 45% at 50% -5%, rgba(232,65,30,0.08) 0%, #0d0d0d 65%)" },
    cls: "rounded-2xl p-5 md:p-6",
  },
  tickets: {
    style: { background: "linear-gradient(145deg, #080c18 0%, #0b0b10 100%)" },
    cls: "rounded-2xl p-5 md:p-6 border-l-2 border-secondary/30",
  },
  settings: {
    style: { background: "linear-gradient(145deg, #07100a 0%, #0c0c0c 100%)" },
    cls: "rounded-2xl p-5 md:p-6 border-t border-emerald-900/30",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState(PLACEHOLDER_TICKETS);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const loadedRef = useRef(false);

  const tab = (router.query.tab ?? "overview");

  useEffect(() => {
    if (!requireAuth(router, ["user","admin","organizer"])) return;
    setUser(getUser());
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchMyOrders()
      .then(d => { const l = Array.isArray(d)?d:d?.orders??d?.data??[]; if(l.length) setTickets(l); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [router]);

  const wrap = TAB_WRAP[tab] ?? TAB_WRAP.overview;

  return (
    <>
      <Head><title>Dashboard – TiketKu</title></Head>
      <DashboardLayout title="Dashboard" variant="dark">
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_,i) => <div key={i} className="bg-neutral-900 rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : (
          <div className={wrap.cls} style={wrap.style}>
            {tab === "overview"  && <Overview  tickets={tickets} user={user} />}
            {tab === "tickets"   && <MyTickets tickets={tickets} />}
            {tab === "settings"  && <Settings  user={user} />}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
