import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getUser, getRole, clearAuth } from "@/lib/auth";

const NAV = {
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "📊" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "💳" },
    { href: "/dashboard/admin/events", label: "Event Types", icon: "🎪" },
    { href: "/dashboard/admin/tickets", label: "Tickets", icon: "🎟️" },
    { href: "/dashboard/admin/users", label: "Users", icon: "👥" },
  ],
  organizer: [
    { href: "/dashboard/organizer?tab=analytics", label: "Analytics",  icon: "📊" },
    { href: "/dashboard/organizer?tab=events",    label: "Events",     icon: "🎪" },
    { href: "/dashboard/organizer?tab=tickets",   label: "Tickets",    icon: "🎟️" },
    { href: "/dashboard/organizer?tab=scanner",   label: "QR Scanner", icon: "📷" },
    { href: "/dashboard/organizer?tab=wallet",    label: "Wallet",     icon: "💰" },
    { href: "/dashboard/organizer?tab=settings",  label: "Settings",   icon: "⚙️" },
  ],
  user: [
    { href: "/dashboard/user?tab=overview", label: "Overview",   icon: "🏠" },
    { href: "/dashboard/user?tab=tickets",  label: "Tiket Saya", icon: "🎟️" },
    { href: "/dashboard/user?tab=settings", label: "Pengaturan", icon: "⚙️" },
  ],
};

const ROLE_BADGE = {
  admin: { label: "Admin", cls: "bg-red-100 text-red-700" },
  organizer: { label: "Organizer", cls: "bg-blue-100 text-blue-700" },
  user: { label: "User", cls: "bg-green-100 text-green-700" },
};

export default function DashboardLayout({ children, title, variant = "light" }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const role = user?.role ?? "user";
  const navItems = NAV[role] ?? NAV.user;
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.user;

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  const DEFAULT_TABS = {
    "/dashboard/user": "overview",
    "/dashboard/organizer": "analytics",
  };

  const isActive = (href) => {
    if (href.includes("?")) {
      const [path, qs] = href.split("?");
      if (router.pathname !== path) return false;
      const expected = new URLSearchParams(qs);
      for (const [k, v] of expected.entries()) {
        const defaultVal = k === "tab" ? (DEFAULT_TABS[path] ?? "overview") : undefined;
        const actual = router.query[k] ?? defaultVal;
        if (actual !== v) return false;
      }
      return true;
    }
    return href === "/dashboard/admin" ||
      href === "/dashboard/organizer" ||
      href === "/dashboard/user"
      ? router.pathname === href
      : router.pathname.startsWith(href);
  };

  const isDark = variant === "dark";

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "bg-[#0d0d0d]" : "bg-neutral-50"}`}>
      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-neutral-900 text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-700 flex-shrink-0">
          <Link href="/" className="text-xl font-extrabold">
            Tiket<span className="text-primary">Ku</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-neutral-700 flex-shrink-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name ?? "Loading..."}
          </p>
          <p className="text-xs text-neutral-400 truncate mb-2">
            {user?.email ?? ""}
          </p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-white"
                  : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors mb-1"
          >
            <span>🏠</span> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-red-700 hover:text-white transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`flex items-center justify-between px-6 h-16 border-b flex-shrink-0 ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-md ${isDark ? "text-neutral-400 hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-100"}`}
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-lg font-semibold ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
              {badge.label}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
