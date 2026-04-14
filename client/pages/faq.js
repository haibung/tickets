import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

/* ─── Inline SVG icons ───────────────────────────────────────────────────── */
function IconCart({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h11M7 13H5.4M9 21a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}
function IconTicket({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}
function IconCreditCard({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function IconUser({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconChat({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
  );
}
function IconBriefcase({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

/* ─── FAQ data ───────────────────────────────────────────────────────────── */
const FAQ_DATA = [
  {
    category: "Pembelian Tiket",
    Icon: IconCart,
    color: "from-rose-500 to-pink-600",
    questions: [
      {
        question: "Bagaimana cara membeli tiket?",
        answer: "Pilih event yang diinginkan → pilih kategori tiket → isi data pribadi setiap peserta (nama & NIK) → pilih metode pembayaran → selesaikan pembayaran. E-tiket akan dikirim ke email Anda dalam hitungan detik.",
      },
      {
        question: "Berapa jumlah maksimal tiket yang bisa saya beli?",
        answer: "Setiap penyelenggara menetapkan batas pembelian per pengguna yang ditampilkan di halaman event sebelum pembelian. Batas ini diterapkan secara ketat untuk mencegah jual-beli tiket ilegal (scalping).",
      },
      {
        question: "Mengapa saya perlu mengisi NIK?",
        answer: "NIK (16 digit) digunakan untuk memverifikasi identitas dan menautkan tiket secara spesifik pada pemiliknya, sehingga tiket tidak dapat disalahgunakan atau dipindahtangankan sembarangan.",
      },
      {
        question: "Bisakah saya membeli tiket untuk orang lain?",
        answer: "Ya. Saat membeli beberapa tiket, Anda akan diminta mengisi nama, NIK, dan nomor ponsel masing-masing peserta secara individual.",
      },
      {
        question: "Saya mulai checkout tapi tidak selesai — apa yang terjadi?",
        answer: "Tiket Anda dipesan selama 15 menit. Jika pembayaran tidak diselesaikan dalam jangka waktu tersebut, tiket otomatis dilepas kembali ke pool umum.",
      },
    ],
  },
  {
    category: "E-Tiket & Pengiriman",
    Icon: IconTicket,
    color: "from-violet-500 to-indigo-600",
    questions: [
      {
        question: "Bagaimana saya menerima e-tiket?",
        answer: "E-tiket dikirim ke alamat email yang Anda daftarkan dalam 10 detik setelah pembayaran berhasil. Periksa folder spam jika email tidak masuk ke kotak masuk utama.",
      },
      {
        question: "Apakah screenshot e-tiket bisa digunakan?",
        answer: "Ya. QR code pada tiket Anda adalah kredensial masuk dan dapat dibaca dari layar manapun. Petugas akan men-scan QR code tersebut di pintu masuk venue.",
      },
      {
        question: "Bagaimana jika tiket saya hilang atau email tidak ditemukan?",
        answer: "Login ke akun TiketKu Anda dan buka menu 'Tiket Saya'. Seluruh e-tiket Anda selalu tersedia di sana dan dapat diunduh ulang kapan saja.",
      },
      {
        question: "Apakah orang lain bisa menggunakan tiket saya?",
        answer: "Tidak. Masuk venue membutuhkan QR code tiket DAN KTP yang sesuai (nama & NIK harus cocok). Jika tidak cocok, akses akan ditolak.",
      },
      {
        question: "Apakah tiket bisa dikembalikan?",
        answer: "Tiket umumnya tidak dapat dikembalikan. Namun, beberapa event memiliki fitur jual-kembali di nilai nominal. Cek halaman event untuk kebijakan spesifik dari penyelenggara.",
      },
    ],
  },
  {
    category: "Pembayaran",
    Icon: IconCreditCard,
    color: "from-amber-400 to-orange-500",
    questions: [
      {
        question: "Metode pembayaran apa saja yang tersedia?",
        answer: "Kami menerima transfer bank (virtual account), kartu kredit/debit (Visa, Mastercard, JCB), dan e-wallet (GoPay, OVO, DANA, ShopeePay).",
      },
      {
        question: "Apakah ada biaya layanan?",
        answer: "Ya, biaya layanan 5% ditambahkan saat checkout. Biaya ini ditampilkan dengan jelas sebelum Anda mengonfirmasi pembayaran — tidak ada biaya tersembunyi.",
      },
      {
        question: "Pembayaran saya gagal. Apa yang harus dilakukan?",
        answer: "Pastikan saldo kartu atau e-wallet Anda mencukupi. Jika masalah berlanjut, coba metode pembayaran lain atau hubungi bank Anda. Tim support kami juga dapat membantu di support@tiketku.id.",
      },
      {
        question: "Apakah data pembayaran saya aman?",
        answer: "Ya. Kami menggunakan enkripsi TLS standar industri dan tidak menyimpan nomor kartu. Semua transaksi diproses melalui payment gateway bersertifikat PCI-DSS.",
      },
    ],
  },
  {
    category: "Akun & Keamanan",
    Icon: IconUser,
    color: "from-cyan-500 to-sky-600",
    questions: [
      {
        question: "Apakah saya perlu akun untuk membeli tiket?",
        answer: "Ya. Membuat akun gratis hanya membutuhkan waktu kurang dari satu menit dan memungkinkan Anda mengakses e-tiket, mengajukan refund, dan mengelola pesanan kapan saja.",
      },
      {
        question: "Bagaimana cara reset password?",
        answer: "Klik 'Lupa Password' di halaman login, masukkan email terdaftar Anda, dan link reset akan dikirimkan dalam 2 menit.",
      },
      {
        question: "Apakah data pribadi saya aman?",
        answer: "Absolut aman. Kami menggunakan enkripsi SSL dan mematuhi UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Data Anda tidak dibagikan kepada pihak ketiga tanpa persetujuan.",
      },
      {
        question: "Bisakah satu akun digunakan untuk beberapa pembeli dalam satu grup?",
        answer: "Ya, tetapi setiap tiket ditautkan pada NIK peserta spesifik. Anda bisa membeli hingga batas per-pengguna yang ditetapkan penyelenggara dan mengisi detail masing-masing peserta secara terpisah.",
      },
    ],
  },
  {
    category: "Bantuan & Support",
    Icon: IconChat,
    color: "from-fuchsia-500 to-purple-600",
    questions: [
      {
        question: "Apa yang terjadi jika event dibatalkan?",
        answer: "Jika penyelenggara membatalkan event, semua pemegang tiket menerima pengembalian dana penuh secara otomatis ke metode pembayaran asal dalam 24 jam — tanpa perlu tindakan apapun dari Anda.",
      },
      {
        question: "Berapa lama proses refund?",
        answer: "Event dibatalkan: 1–3 hari kerja. Refund sukarela yang disetujui: 5–7 hari kerja. Transfer bank mungkin sedikit lebih lama tergantung kebijakan bank Anda.",
      },
      {
        question: "Siapa yang bisa saya hubungi jika ada masalah?",
        answer: "Tim Customer Support kami siap membantu. Hubungi melalui live chat di platform, email support@tiketku.id, atau gunakan halaman Kontak kami.",
      },
      {
        question: "Berapa lama waktu respons customer support?",
        answer: "Kami berkomitmen merespons dalam maksimal 2 jam pada jam kerja dan 24 jam di luar jam kerja. Untuk kasus mendesak, gunakan fitur live chat.",
      },
    ],
  },
  {
    category: "Untuk Penyelenggara",
    Icon: IconBriefcase,
    color: "from-lime-500 to-teal-600",
    questions: [
      {
        question: "Bagaimana cara mendaftarkan event saya?",
        answer: "Daftar sebagai organizer dan gunakan dashboard 'Buat Event'. Event Anda akan aktif dalam hitungan menit setelah submission.",
      },
      {
        question: "Bagaimana cara menetapkan batas tiket per pengguna?",
        answer: "Di formulir pembuatan event, atur field 'Maks tiket per pembeli'. Field ini terlihat oleh pembeli sebelum pembelian dan diterapkan secara ketat oleh sistem kami.",
      },
      {
        question: "Kapan saya menerima pembayaran?",
        answer: "Pembayaran diproses dalam 24 jam setelah event selesai. Dana ditahan dalam escrow hingga tanggal event untuk melindungi pembeli.",
      },
      {
        question: "Berapa komisi TiketKu?",
        answer: "Kami mengenakan biaya platform 5% dari nilai nominal setiap tiket yang terjual. Tidak ada biaya listing atau biaya bulanan.",
      },
    ],
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQ – TiketKu</title>
        <meta name="description" content="Pertanyaan yang sering diajukan tentang TiketKu — tiket, pembayaran, refund, dan lainnya." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-rose-900 py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-rose-500 opacity-10 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500 opacity-10 rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-300 bg-rose-500 bg-opacity-20 px-4 py-1.5 rounded-full mb-5 border border-rose-400 border-opacity-30">
            Pusat Bantuan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-neutral-400 text-base">Semua yang perlu Anda ketahui tentang membeli dan mengelola tiket di TiketKu.</p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {FAQ_DATA.map((section, catIdx) => (
            <div key={catIdx}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <section.Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-700">{section.category}</h2>
              </div>

              {/* Accordion */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-neutral-50">
                {section.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={qIdx}>
                      <button
                        onClick={() => toggleAccordion(catIdx, qIdx)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors gap-4 group"
                      >
                        <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-primary" : "text-neutral-800 group-hover:text-neutral-900"}`}>
                          {item.question}
                        </span>
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"}`}>
                          <svg
                            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div className={`h-0.5 w-8 rounded-full bg-gradient-to-r ${section.color} mb-3`} />
                          <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still stuck */}
      <section className="bg-white py-14 border-t border-neutral-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Tidak menemukan jawaban Anda?</h2>
          <p className="text-neutral-500 text-sm mb-6">Tim support kami biasanya merespons dalam satu hari kerja.</p>
          <Link href="/contact" className="inline-block bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-orange-700 transition-colors text-sm">
            Hubungi Support
          </Link>
        </div>
      </section>
    </>
  );
}
