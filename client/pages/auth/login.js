import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "@/lib/api";
import { saveAuth, dashboardPath } from "@/lib/auth";

// ── tiny icon helpers (inline SVG – no extra dep) ─────────────────────────────
function IconMail() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(form);
      saveAuth({
        token: data?.token,
        user: {
          id: data?.id,
          name: data?.name,
          email: data?.email ?? form.email,
          role: data?.role ?? "user",
        },
      });
      const redirect = router.query.redirect ?? dashboardPath(data?.role ?? "user");
      router.push(redirect);
    } catch (err) {
      setError(err.message || "Email/password yang kamu masukkan tidak sesuai.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgot(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <>
      <Head><title>Login – TiketKu</title></Head>

      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                Tiket<span className="text-neutral-400">Ku</span>
              </span>
            </Link>
            <h1 className="mt-3 text-lg font-semibold text-white">Selamat datang kembali</h1>
            <p className="text-sm text-neutral-500 mt-1">Masuk ke akun Anda</p>
          </div>

          {/* Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2 bg-neutral-800/80 border border-neutral-700 text-neutral-300 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5 text-neutral-500 flex-shrink-0">✕</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" aria-hidden="true">
                    <IconMail />
                  </span>
                  <input
                    required
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="kamu@example.com"
                    aria-label="Alamat email"
                    autoComplete="email"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-[11px] uppercase tracking-wider text-neutral-500">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" aria-hidden="true">
                    <IconLock />
                  </span>
                  <input
                    required
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    aria-label="Password"
                    autoComplete="current-password"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <IconSpinner />
                    <span>Masuk...</span>
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-neutral-600 mt-6">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-neutral-300 font-semibold hover:text-white transition-colors">
                Daftar
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-[11px] text-neutral-600 uppercase tracking-wider">atau</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              onClick={() => alert("Google SSO belum tersedia.")}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-neutral-700 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
            >
              <IconGoogle />
              <span>Masuk dengan Google</span>
            </button>

            {/* Legal */}
            <p className="text-center text-[11px] text-neutral-700 mt-5">
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/terms" className="text-neutral-500 hover:text-neutral-300 underline transition-colors">
                Syarat &amp; Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-neutral-500 hover:text-neutral-300 underline transition-colors">
                Kebijakan Privasi
              </Link>{" "}
              kami.
            </p>

            {/* Demo shortcuts */}
            <div className="mt-6 pt-5 border-t border-neutral-800">
              <p className="text-[11px] text-center text-neutral-600 mb-3 uppercase tracking-wider">Demo login</p>
              <div className="flex gap-2">
                {[
                  { role: "admin",     label: "Admin" },
                  { role: "organizer", label: "Organizer" },
                  { role: "user",      label: "User" },
                ].map(({ role, label }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      saveAuth({
                        token: `demo-${role}-token`,
                        user: {
                          id: role === "admin" ? 1 : role === "organizer" ? 2 : 3,
                          name: `Demo ${label}`,
                          email: `${role}@demo.com`,
                          role,
                        },
                      });
                      router.push(dashboardPath(role));
                    }}
                    className="flex-1 py-2 text-[11px] font-semibold rounded-xl border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-white">Reset Password</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Kami akan kirimkan link ke email Anda
                </p>
              </div>
              <button
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                className="text-neutral-600 hover:text-white transition-colors p-1"
              >
                <IconClose />
              </button>
            </div>

            {forgotSent ? (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-300">✓ Link reset dikirim ke</p>
                <p className="text-white font-semibold mt-1">{forgotEmail}</p>
                <p className="text-[11px] text-neutral-600 mt-3">Periksa folder spam jika tidak muncul.</p>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600">
                    <IconMail />
                  </span>
                  <input
                    required
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="kamu@example.com"
                    aria-label="Email untuk reset password"
                    autoComplete="email"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Kirim Link Reset
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
