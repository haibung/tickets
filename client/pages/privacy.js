import Head from "next/head";
import Link from "next/link";

/* ─── Inline SVG icons ────────────────────────────────────────────────────── */
function IconLock({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
function IconDatabase({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a8 3 0 1116 0A8 3 0 014 7zm0 0v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
    </svg>
  );
}
function IconUserGroup({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0zM3 17a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}
function IconTrash({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
function IconEye({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}
function IconClipboard({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

/* ─── Privacy points data ─────────────────────────────────────────────────── */
const PRIVACY_POINTS = [
  {
    Icon: IconLock,
    title: "Keamanan Data",
    description: "Data pribadi Anda dienkripsi menggunakan TLS/SSL dan disimpan di server yang sesuai dengan standar keamanan PCI-DSS. Kami tidak pernah menyimpan nomor kartu pembayaran secara langsung.",
    color: "from-rose-500 to-pink-600",
  },
  {
    Icon: IconDatabase,
    title: "Pengumpulan Data",
    description: "Kami hanya mengumpulkan data yang benar-benar diperlukan untuk memberikan layanan: nama, email, nomor ponsel, NIK (untuk verifikasi identitas), dan data transaksi.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    Icon: IconUserGroup,
    title: "Tidak Dibagikan",
    description: "Data pribadi Anda tidak akan dijual atau dibagikan kepada pihak ketiga untuk kepentingan pemasaran tanpa persetujuan eksplisit Anda. Kami hanya berbagi data kepada mitra yang diperlukan untuk memproses transaksi.",
    color: "from-amber-400 to-orange-500",
  },
  {
    Icon: IconTrash,
    title: "Hak Penghapusan",
    description: "Sesuai UU No. 27 Tahun 2022, Anda berhak meminta penghapusan data pribadi kapan saja melalui Customer Support kami. Permintaan akan diproses dalam 14 hari kerja.",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    Icon: IconEye,
    title: "Transparansi",
    description: "Kami berkomitmen untuk transparan dalam setiap penggunaan data. Jika terdapat perubahan kebijakan privasi yang signifikan, Anda akan mendapat notifikasi melalui email minimal 30 hari sebelumnya.",
    color: "from-cyan-500 to-sky-600",
  },
  {
    Icon: IconClipboard,
    title: "Compliance",
    description: "Kebijakan privasi kami mematuhi UU Perlindungan Data Pribadi Indonesia (UU PDP), GDPR, dan standar internasional lainnya yang berlaku untuk platform e-commerce.",
    color: "from-lime-500 to-teal-600",
  },
];

/* ─── Section data ────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    title: "1. Data yang Kami Kumpulkan",
    body: [
      "Saat Anda mendaftar dan menggunakan TiketKu, kami mengumpulkan beberapa kategori data berikut:",
      "a) Data Identitas: nama lengkap, NIK (Nomor Induk Kependudukan), dan tanggal lahir — digunakan untuk verifikasi identitas dan pencegahan penipuan.",
      "b) Data Kontak: alamat email dan nomor ponsel — digunakan untuk pengiriman e-tiket, notifikasi transaksi, dan komunikasi layanan.",
      "c) Data Transaksi: riwayat pembelian, metode pembayaran yang digunakan (hanya jenis, bukan nomor lengkap), dan status pesanan.",
      "d) Data Teknis: alamat IP, tipe perangkat, browser, dan halaman yang dikunjungi — digunakan untuk keamanan akun dan peningkatan layanan.",
    ],
  },
  {
    title: "2. Cara Kami Menggunakan Data",
    body: [
      "Data yang kami kumpulkan digunakan untuk tujuan berikut:",
      "— Memproses pembelian tiket dan mengirimkan e-tiket ke email Anda.",
      "— Memverifikasi identitas pembeli untuk mencegah pemalsuan dan scalping tiket.",
      "— Mengirimkan konfirmasi transaksi, pengingat event, dan pembaruan penting.",
      "— Mendeteksi aktivitas yang mencurigakan dan melindungi akun Anda.",
      "— Meningkatkan fitur dan pengalaman pengguna di platform.",
      "— Mematuhi kewajiban hukum dan regulasi yang berlaku.",
    ],
  },
  {
    title: "3. Berbagi Data dengan Pihak Ketiga",
    body: [
      "Kami tidak menjual data pribadi Anda. Namun, kami dapat berbagi data terbatas dengan pihak ketiga terpercaya dalam kondisi berikut:",
      "— Payment Gateway (misalnya Midtrans, Xendit): untuk memproses pembayaran. Mereka terikat oleh standar keamanan PCI-DSS.",
      "— Penyelenggara Event: nama dan detail yang diperlukan untuk validasi kehadiran di venue. Penyelenggara terikat oleh perjanjian kerahasiaan dengan TiketKu.",
      "— Penyedia Email: untuk pengiriman e-tiket dan notifikasi.",
      "— Otoritas Hukum: jika diwajibkan oleh hukum atau perintah pengadilan yang sah.",
      "Dalam semua kasus ini, kami hanya berbagi data minimum yang diperlukan.",
    ],
  },
  {
    title: "4. Penyimpanan & Keamanan Data",
    body: [
      "Data Anda disimpan di server yang berlokasi di Indonesia dan/atau negara-negara yang memiliki perlindungan data setara.",
      "Langkah keamanan yang kami terapkan:",
      "— Enkripsi TLS 1.3 untuk semua transmisi data.",
      "— Enkripsi AES-256 untuk data sensitif yang disimpan.",
      "— Autentikasi dua faktor untuk akses sistem internal.",
      "— Pemantauan keamanan 24/7 dan uji penetrasi berkala.",
      "Data transaksi disimpan selama 5 tahun sesuai regulasi perpajakan. Data akun aktif disimpan selama akun masih aktif. Setelah penghapusan akun, data akan dihapus permanen dalam 30 hari.",
    ],
  },
  {
    title: "5. Hak-Hak Anda",
    body: [
      "Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda memiliki hak-hak berikut:",
      "— Hak Akses: mendapatkan salinan data pribadi yang kami simpan tentang Anda.",
      "— Hak Koreksi: memperbarui data yang tidak akurat melalui pengaturan akun.",
      "— Hak Portabilitas: menerima data Anda dalam format yang dapat dibaca mesin.",
      "— Hak Penghapusan: meminta penghapusan data pribadi, kecuali data yang wajib disimpan secara hukum.",
      "— Hak Keberatan: menolak pemrosesan data untuk tujuan pemasaran.",
      "Untuk menggunakan hak-hak tersebut, hubungi privacy@tiketku.id.",
    ],
  },
  {
    title: "6. Cookie & Teknologi Pelacakan",
    body: [
      "TiketKu menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna:",
      "— Cookie Esensial: diperlukan untuk fungsi dasar platform (sesi login, keranjang belanja). Tidak dapat dinonaktifkan.",
      "— Cookie Analitik: mengumpulkan data penggunaan secara anonim untuk perbaikan layanan (misalnya Google Analytics).",
      "— Cookie Preferensi: menyimpan preferensi Anda seperti bahasa dan metode pembayaran favorit.",
      "Anda dapat mengelola cookie melalui pengaturan browser. Menonaktifkan cookie analitik tidak akan memengaruhi fungsionalitas utama platform.",
    ],
  },
  {
    title: "7. Perubahan Kebijakan Privasi",
    body: [
      "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami atau persyaratan hukum.",
      "Jika terdapat perubahan yang signifikan, kami akan memberikan pemberitahuan yang jelas melalui:",
      "— Email ke alamat yang terdaftar di akun Anda, minimal 30 hari sebelum perubahan berlaku.",
      "— Banner pemberitahuan di platform.",
      "Penggunaan layanan setelah tanggal berlakunya perubahan dianggap sebagai penerimaan atas kebijakan yang diperbarui.",
      "Versi terakhir diperbarui: Januari 2025. Berlaku sejak: 1 Februari 2025.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi – TiketKu</title>
        <meta name="description" content="Pelajari bagaimana TiketKu mengumpulkan, menggunakan, dan melindungi data pribadi Anda." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-violet-900 py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-500 opacity-10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500 opacity-10 rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-300 bg-violet-500 bg-opacity-20 px-4 py-1.5 rounded-full mb-5 border border-violet-400 border-opacity-30">
            Privasi &amp; Keamanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Kebijakan Privasi</h1>
          <p className="text-neutral-400 text-base">Kami berkomitmen menjaga keamanan dan privasi data pribadi Anda.</p>
        </div>
      </section>

      {/* Privacy points grid */}
      <section className="bg-neutral-50 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Komitmen Kami</h2>
            <p className="text-neutral-500 text-sm max-w-xl mx-auto">Enam prinsip utama yang mendasari bagaimana kami menangani data pribadi Anda.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRIVACY_POINTS.map((point, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${point.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <point.Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 mb-1">{point.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full policy text */}
      <section className="bg-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-800 mb-1">Kebijakan Privasi Lengkap</h2>
            <p className="text-xs text-neutral-400">PT TiketKu Indonesia &nbsp;·&nbsp; Terakhir diperbarui: Januari 2025</p>
            <div className="mt-3 h-px bg-gradient-to-r from-violet-500 to-rose-400 w-16 rounded-full" />
          </div>

          <div className="space-y-8">
            {SECTIONS.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-neutral-800 mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.body.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm text-neutral-600 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-neutral-50 py-14 border-t border-neutral-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Ada pertanyaan tentang privasi?</h2>
          <p className="text-neutral-500 text-sm mb-6">Hubungi tim privasi kami di <a href="mailto:privacy@tiketku.id" className="text-primary font-medium hover:underline">privacy@tiketku.id</a> atau melalui halaman kontak.</p>
          <Link href="/contact" className="inline-block bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm">
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  );
}
