import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

/* ─── Inline SVG icons (Heroicons outline paths) ─────────────────────────── */
function IconInfo({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    </svg>
  );
}
function IconShield({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623C17.176 19.29 21 14.591 21 9c0-1.099-.14-2.165-.404-3.18" />
    </svg>
  );
}
function IconUsers({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0zM3 17a3 3 0 110-6 3 3 0 010 6z" />
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
function IconLock({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
function IconGlobe({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  );
}
function IconCurrency({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconScale({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-3 9 3M3 6v12l9 3 9-3V6M3 6l9 3 9-3M12 9v12" />
    </svg>
  );
}

/* ─── Article data ────────────────────────────────────────────────────────── */
const ARTICLES = [
  {
    key: "definisi",
    title: "Definisi & Interpretasi",
    Icon: IconInfo,
    color: "from-blue-500 to-blue-600",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Definisi &amp; Interpretasi</h2>
        <p>Dalam Syarat &amp; Ketentuan ini, istilah-istilah berikut memiliki arti sebagaimana didefinisikan di bawah ini:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>"Platform"</strong> berarti situs web, aplikasi, dan layanan yang dioperasikan oleh PT TiketKu Indonesia di bawah nama merek TiketKu.</li>
          <li><strong>"Pengguna"</strong> berarti setiap individu yang mengakses atau menggunakan Platform, termasuk Pembeli dan Penyelenggara Acara.</li>
          <li><strong>"Pembeli"</strong> berarti Pengguna yang melakukan pembelian tiket melalui Platform.</li>
          <li><strong>"Penyelenggara"</strong> berarti individu atau badan hukum yang mendaftarkan dan mengelola acara melalui Platform.</li>
          <li><strong>"Tiket"</strong> berarti bukti hak masuk ke suatu acara yang diterbitkan secara elektronik oleh Platform.</li>
          <li><strong>"NIK"</strong> berarti Nomor Induk Kependudukan sebagaimana tercantum pada Kartu Tanda Penduduk (KTP) yang diterbitkan oleh pemerintah Republik Indonesia.</li>
          <li><strong>"Biaya Layanan"</strong> berarti biaya sebesar 5% dari nilai nominal tiket yang dikenakan Platform atas setiap transaksi.</li>
        </ul>
        <p>Kata-kata dalam bentuk tunggal mencakup bentuk jamak dan sebaliknya. Judul pasal digunakan hanya untuk kemudahan referensi dan tidak mempengaruhi interpretasi Syarat &amp; Ketentuan ini.</p>
      </div>
    ),
  },
  {
    key: "umum",
    title: "Ketentuan Umum",
    Icon: IconShield,
    color: "from-green-500 to-green-600",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Ketentuan Umum</h2>
        <p>Dengan mengakses atau menggunakan Platform TiketKu, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Syarat &amp; Ketentuan ini secara penuh dan tanpa syarat.</p>
        <p>TiketKu berhak mengubah Syarat &amp; Ketentuan ini sewaktu-waktu. Perubahan material akan diberitahukan melalui email atau pemberitahuan di Platform setidaknya 7 hari sebelum berlaku. Penggunaan Platform secara berkelanjutan setelah perubahan berlaku dianggap sebagai penerimaan atas perubahan tersebut.</p>
        <p>Platform hanya dapat digunakan oleh individu yang berusia 17 tahun ke atas, atau di bawah pengawasan orang tua/wali yang sah. Dengan mendaftar, Anda menyatakan memenuhi persyaratan usia ini.</p>
        <p>Anda bertanggung jawab atas keamanan akun Anda. TiketKu tidak bertanggung jawab atas kerugian yang timbul akibat akses tidak sah ke akun Anda yang disebabkan oleh kelalaian Anda dalam menjaga kerahasiaan kredensial.</p>
        <p>TiketKu bertindak sebagai marketplace antara Pembeli dan Penyelenggara. TiketKu bukan pihak dalam perjanjian antara Pembeli dan Penyelenggara terkait penyelenggaraan acara itu sendiri.</p>
      </div>
    ),
  },
  {
    key: "tipe-klien",
    title: "Tipe Penggolongan Klien",
    Icon: IconUsers,
    color: "from-purple-500 to-purple-600",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Tipe Penggolongan Klien Kami</h2>
        <p>TiketKu melayani dua kategori utama pengguna dengan hak dan kewajiban yang berbeda:</p>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">🎫 Pembeli (Fan / Audience)</h3>
          <ul className="list-disc pl-4 space-y-1 text-purple-700">
            <li>Dapat mencari, menelusuri, dan membeli tiket untuk acara yang terdaftar di Platform.</li>
            <li>Wajib mendaftarkan akun dengan informasi yang akurat, termasuk nama dan NIK.</li>
            <li>Bertanggung jawab atas data peserta yang diisikan saat pembelian.</li>
            <li>Tunduk pada batas pembelian per-pengguna yang ditetapkan oleh Penyelenggara.</li>
            <li>Berhak mengajukan pengembalian dana sesuai Kebijakan Pengembalian Uang Platform.</li>
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <h3 className="font-bold text-indigo-800 mb-2">🎪 Penyelenggara (Organizer)</h3>
          <ul className="list-disc pl-4 space-y-1 text-indigo-700">
            <li>Dapat mendaftarkan acara, mengelola tiket, dan memantau penjualan melalui dashboard.</li>
            <li>Bertanggung jawab penuh atas konten, pelaksanaan, dan kualitas acara yang didaftarkan.</li>
            <li>Berhak menetapkan batas pembelian tiket per pengguna.</li>
            <li>Menerima dana hasil penjualan dalam 24 jam setelah acara selesai, dikurangi Biaya Layanan.</li>
            <li>Wajib menghormati seluruh tiket yang telah terjual; pembatalan sepihak dapat mengakibatkan penghapusan dari Platform.</li>
          </ul>
        </div>

        <p>Satu akun tidak dapat digunakan untuk kedua peran secara bersamaan. Penyelenggara yang juga ingin membeli tiket harus menggunakan akun terpisah.</p>
      </div>
    ),
  },
  {
    key: "informasi-pribadi",
    title: "Informasi Pribadi",
    Icon: IconDatabase,
    color: "from-orange-500 to-red-500",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Informasi Pribadi</h2>
        <p>TiketKu mengumpulkan dan memproses informasi pribadi Anda sesuai dengan ketentuan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).</p>
        <p><strong>Data yang dikumpulkan meliputi:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Nama lengkap dan NIK (untuk verifikasi identitas peserta tiket)</li>
          <li>Alamat email dan nomor telepon (untuk pengiriman e-tiket dan komunikasi)</li>
          <li>Data transaksi dan riwayat pembelian</li>
          <li>Data teknis (alamat IP, jenis browser, data penggunaan Platform)</li>
        </ul>
        <p><strong>Penggunaan data:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Memproses pembelian tiket dan memverifikasi identitas peserta di pintu masuk acara</li>
          <li>Mengirimkan e-tiket dan informasi terkait acara</li>
          <li>Mendeteksi dan mencegah penipuan serta penyalahgunaan Platform</li>
          <li>Meningkatkan layanan dan pengalaman pengguna</li>
        </ul>
        <p>TiketKu <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga. Data dapat dibagikan kepada Penyelenggara terkait (nama &amp; data kontak peserta) dan penyedia layanan pembayaran yang terpercaya, semata-mata untuk keperluan penyelenggaraan acara dan pemrosesan transaksi.</p>
        <p>Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda dengan menghubungi privacy@tiketku.id.</p>
      </div>
    ),
  },
  {
    key: "hak-cipta",
    title: "Hak Cipta",
    Icon: IconLock,
    color: "from-teal-500 to-cyan-500",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Hak Cipta</h2>
        <p>Seluruh konten yang terdapat di Platform TiketKu — termasuk namun tidak terbatas pada logo, desain antarmuka, teks, grafis, kode perangkat lunak, dan basis data — merupakan kekayaan intelektual eksklusif PT TiketKu Indonesia atau pemberi lisensinya, dan dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta serta peraturan perundang-undangan yang berlaku.</p>
        <p>Anda dilarang untuk:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mereproduksi, mendistribusikan, atau membuat karya turunan dari konten Platform tanpa izin tertulis sebelumnya dari TiketKu.</li>
          <li>Menggunakan merek dagang, logo, atau nama "TiketKu" untuk keperluan komersial tanpa otorisasi.</li>
          <li>Melakukan scraping, crawling, atau pengambilan data massal dari Platform dengan cara apapun.</li>
          <li>Mendekompilasi, merekayasa balik, atau mencoba mengekstrak kode sumber Platform.</li>
        </ul>
        <p>Konten yang diunggah oleh Penyelenggara (deskripsi acara, gambar, dll.) tetap menjadi hak milik Penyelenggara. Dengan mengunggah konten ke Platform, Penyelenggara memberikan TiketKu lisensi non-eksklusif, bebas royalti, dan dapat disublisensikan untuk menampilkan konten tersebut di Platform dan materi promosi.</p>
        <p>Pelanggaran hak cipta dapat dilaporkan ke legal@tiketku.id.</p>
      </div>
    ),
  },
  {
    key: "cookies",
    title: "Cookies",
    Icon: IconGlobe,
    color: "from-yellow-500 to-orange-500",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Cookies</h2>
        <p>Platform TiketKu menggunakan cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna, menganalisis lalu lintas, dan menampilkan konten yang relevan.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { type: "Cookies Esensial", desc: "Diperlukan untuk fungsi dasar Platform seperti sesi login dan keranjang pembelian. Tidak dapat dinonaktifkan.", color: "bg-green-50 border-green-100 text-green-800" },
            { type: "Cookies Analitik", desc: "Membantu kami memahami cara pengguna berinteraksi dengan Platform (mis. Google Analytics). Data bersifat anonim.", color: "bg-blue-50 border-blue-100 text-blue-800" },
            { type: "Cookies Fungsional", desc: "Menyimpan preferensi pengguna seperti bahasa dan kota asal untuk pengalaman yang lebih personal.", color: "bg-purple-50 border-purple-100 text-purple-800" },
            { type: "Cookies Pemasaran", desc: "Digunakan untuk menampilkan iklan yang relevan di platform pihak ketiga. Dapat dinonaktifkan melalui pengaturan akun.", color: "bg-orange-50 border-orange-100 text-orange-800" },
          ].map((c) => (
            <div key={c.type} className={`rounded-xl border p-3 ${c.color}`}>
              <p className="font-bold text-xs mb-1">{c.type}</p>
              <p className="text-xs leading-relaxed opacity-80">{c.desc}</p>
            </div>
          ))}
        </div>

        <p>Dengan melanjutkan penggunaan Platform, Anda menyetujui penggunaan cookies sesuai kebijakan ini. Anda dapat mengelola preferensi cookies melalui pengaturan browser Anda, namun menonaktifkan cookies esensial dapat mempengaruhi fungsi Platform.</p>
        <p>Kami tidak menggunakan cookies untuk mengumpulkan informasi yang dapat secara langsung mengidentifikasi Anda tanpa persetujuan eksplisit Anda.</p>
      </div>
    ),
  },
  {
    key: "pengembalian-uang",
    title: "Kebijakan Pengembalian Uang",
    Icon: IconCurrency,
    color: "from-emerald-500 to-green-600",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Kebijakan Pengembalian Uang</h2>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-800">
          <p className="font-semibold">🌟 Komitmen kami: Jika acara dibatalkan oleh Penyelenggara, Anda menerima pengembalian dana penuh secara otomatis dalam 24 jam — tanpa formulir, tanpa menunggu.</p>
        </div>

        <div className="space-y-3">
          {[
            { situation: "Acara dibatalkan oleh Penyelenggara", eligible: "Pengembalian penuh (100%)", timeline: "Otomatis dalam 24 jam", action: "Tidak diperlukan tindakan." },
            { situation: "Acara ditunda", eligible: "Pengembalian penuh jika tidak dapat hadir di tanggal baru", timeline: "5–7 hari kerja", action: "Ajukan melalui 'Pesanan Saya' dalam 7 hari sejak pengumuman." },
            { situation: "Perubahan lokasi acara", eligible: "Pengembalian penuh jika lokasi baru tidak dapat dijangkau", timeline: "5–7 hari kerja", action: "Ajukan dalam 7 hari sejak pengumuman perubahan." },
            { situation: "Pembelian duplikat (kesalahan teknis)", eligible: "Pengembalian penuh untuk pesanan duplikat", timeline: "3–5 hari kerja", action: "Hubungi support@tiketku.id dalam 48 jam dengan kedua nomor pesanan." },
            { situation: "Perubahan pikiran (bukan karena kesalahan Penyelenggara)", eligible: "Tidak memenuhi syarat", timeline: "—", action: "Periksa apakah acara memiliki fitur jual-kembali." },
          ].map((row) => (
            <div key={row.situation} className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm">
              <p className="font-semibold text-neutral-800 text-xs mb-2">{row.situation}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Eligibilitas</p>
                  <p className={`font-semibold ${row.eligible.includes("penuh") ? "text-green-600" : "text-neutral-500"}`}>{row.eligible}</p>
                </div>
                <div>
                  <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Timeline</p>
                  <p className="font-semibold text-neutral-700">{row.timeline}</p>
                </div>
                <div>
                  <p className="text-neutral-400 uppercase tracking-wider mb-0.5">Tindakan</p>
                  <p className="text-neutral-600">{row.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400">Biaya Layanan sebesar 5% bersifat non-refundable kecuali acara dibatalkan oleh Penyelenggara. Pengembalian dana selalu dikembalikan ke metode pembayaran asal.</p>
      </div>
    ),
  },
  {
    key: "pembelaan-hukum",
    title: "Pembelaan & Domisili Hukum",
    Icon: IconScale,
    color: "from-indigo-500 to-purple-600",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
        <h2 className="text-xl font-bold text-neutral-800">Pembelaan &amp; Domisili Hukum</h2>
        <p>Syarat &amp; Ketentuan ini tunduk pada dan diinterpretasikan berdasarkan hukum Republik Indonesia.</p>
        <p><strong>Batasan tanggung jawab:</strong> Sejauh yang diizinkan oleh hukum yang berlaku, TiketKu tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau punitive yang timbul dari penggunaan Platform. Total kewajiban TiketKu kepada Anda atas klaim apapun tidak akan melebihi jumlah yang telah Anda bayarkan untuk tiket yang bersangkutan.</p>
        <p><strong>Penyelesaian sengketa:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Setiap sengketa akan diselesaikan terlebih dahulu melalui musyawarah mufakat dalam jangka waktu 30 hari sejak sengketa timbul.</li>
          <li>Apabila musyawarah tidak menghasilkan penyelesaian, sengketa akan diselesaikan melalui mediasi di Badan Mediasi Indonesia (BAMI) sebelum dibawa ke pengadilan.</li>
          <li>Apabila mediasi gagal, para pihak sepakat untuk menyerahkan penyelesaian sengketa kepada yurisdiksi eksklusif Pengadilan Negeri Jakarta Selatan.</li>
        </ul>
        <p><strong>Hak konsumen:</strong> Tidak ada ketentuan dalam Syarat &amp; Ketentuan ini yang membatasi hak-hak konsumen Anda berdasarkan Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen.</p>
        <p><strong>Keterpisahan:</strong> Apabila suatu ketentuan dalam Syarat &amp; Ketentuan ini dinyatakan tidak sah atau tidak dapat dilaksanakan, ketentuan tersebut akan dipisahkan dan tidak mempengaruhi keberlakuan ketentuan lainnya.</p>
        <p>Untuk pertanyaan hukum, hubungi: <a href="mailto:legal@tiketku.id" className="text-primary hover:underline">legal@tiketku.id</a></p>
      </div>
    ),
  },
];

export default function TermsPage() {
  const [selected, setSelected] = useState(ARTICLES[0].key);
  const article = ARTICLES.find((a) => a.key === selected);

  return (
    <>
      <Head>
        <title>Syarat &amp; Ketentuan – TiketKu</title>
        <meta name="description" content="Syarat & Ketentuan penggunaan platform TiketKu — hak dan kewajiban Anda sebagai pengguna." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-indigo-900 py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500 opacity-10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-primary opacity-10 rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500 bg-opacity-20 px-4 py-1.5 rounded-full mb-5 border border-indigo-400 border-opacity-30">
            Dokumen Hukum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Syarat &amp; Ketentuan</h1>
          <p className="text-neutral-400 text-sm">Terakhir diperbarui: April 2026 · Berlaku segera</p>
        </div>
      </section>

      {/* Body: sidebar + content */}
      <section className="bg-neutral-50 py-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Sidebar ── */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pasal</p>
                </div>
                <nav className="divide-y divide-neutral-50">
                  {ARTICLES.map((art) => {
                    const active = art.key === selected;
                    return (
                      <button
                        key={art.key}
                        onClick={() => setSelected(art.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors group ${active ? "bg-neutral-50" : "hover:bg-neutral-50"}`}
                      >
                        {/* Colored icon chip */}
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${art.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <art.Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-xs font-semibold leading-tight transition-colors ${active ? "text-primary" : "text-neutral-700 group-hover:text-neutral-900"}`}>
                          {art.title}
                        </span>
                        {active && (
                          <svg className="ml-auto w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Last updated note */}
              <p className="text-xs text-neutral-400 mt-4 px-1">
                Pertanyaan?{" "}
                <Link href="/contact" className="text-primary hover:underline">Hubungi tim hukum kami</Link>
              </p>
            </aside>

            {/* ── Content panel ── */}
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Coloured header strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${article.color}`} />

                <div className="p-6 sm:p-8">
                  {/* Article icon + title */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                      <article.Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest">
                        Pasal {ARTICLES.findIndex((a) => a.key === selected) + 1} dari {ARTICLES.length}
                      </p>
                    </div>
                  </div>

                  {/* Article body */}
                  <div key={selected}>
                    {article.content}
                  </div>

                  {/* Prev / Next navigation */}
                  <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-between gap-3">
                    {(() => {
                      const idx = ARTICLES.findIndex((a) => a.key === selected);
                      const prev = ARTICLES[idx - 1];
                      const next = ARTICLES[idx + 1];
                      return (
                        <>
                          <div>
                            {prev && (
                              <button
                                onClick={() => setSelected(prev.key)}
                                className="flex items-center gap-2 text-xs text-neutral-500 hover:text-primary transition-colors group"
                              >
                                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>{prev.title}</span>
                              </button>
                            )}
                          </div>
                          <div>
                            {next && (
                              <button
                                onClick={() => setSelected(next.key)}
                                className="flex items-center gap-2 text-xs text-neutral-500 hover:text-primary transition-colors group"
                              >
                                <span>{next.title}</span>
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
