import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "@/lib/api";
import { saveAuth, dashboardPath } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(form);
      // Backend expected to return { token, role, name, email, id }
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
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login – TiketKu</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold text-primary">
                Tiket<span className="text-secondary">Ku</span>
              </span>
            </Link>
            <h1 className="mt-4 text-xl font-bold text-neutral-800">Welcome back!</h1>
            <p className="text-sm text-neutral-500 mt-1">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-neutral-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full font-semibold text-sm transition-colors ${
                  loading
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <p className="text-xs text-center text-neutral-400 mb-3">— Demo login (no backend needed) —</p>
              <div className="flex gap-2">
                {[
                  { role: "admin",     label: "Admin",     color: "bg-red-50 text-red-600 hover:bg-red-100 border-red-200" },
                  { role: "organizer", label: "Organizer", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" },
                  { role: "user",      label: "User",      color: "bg-green-50 text-green-600 hover:bg-green-100 border-green-200" },
                ].map(({ role, label, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      saveAuth({
                        token: `demo-${role}-token`,
                        user: { id: role === "admin" ? 1 : role === "organizer" ? 2 : 3, name: `Demo ${label}`, email: `${role}@demo.com`, role },
                      });
                      router.push(dashboardPath(role));
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${color}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
