"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = {
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "💳" },
    { href: "/dashboard/admin/event-types", label: "Event Types", icon: "🎭" },
    { href: "/dashboard/admin/tickets", label: "Organizer Tickets", icon: "🎟️" },
  ],
  organizer: [
    { href: "/dashboard/organizer", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/organizer/event-types", label: "Event Types", icon: "🎭" },
    { href: "/dashboard/organizer/tickets", label: "Tickets", icon: "🎟️" },
    { href: "/dashboard/organizer/sales", label: "Sales", icon: "📊" },
    { href: "/dashboard/organizer/withdrawals", label: "Withdrawals", icon: "💰" },
  ],
  user: [
    { href: "/dashboard/user", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/user/transactions", label: "My Tickets", icon: "🎫" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-neutral-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-neutral-800">
        <span className="text-xl font-bold text-primary">TiketKu</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
