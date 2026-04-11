import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { requireAuth } from "@/lib/auth";
import { fetchOrganizerStats, fetchOrganizerSales } from "@/lib/api";

const PLACEHOLDER_STATS = {
  totalEvents: 6,
  totalTicketsSold: 3_820,
  totalRevenue: 1_420_000_000,
  pendingWithdrawal: 340_000_000,
};

const PLACEHOLDER_SALES = [
  { event: "Coldplay World Tour", ticket: "Category 2", sold: 1200, revenue: 1020000000 },
  { event: "Java Jazz 2025", ticket: "General", sold: 800, revenue: 400000000 },
  { event: "Bali Arts Festival", ticket: "General", sold: 420, revenue: 31500000 },
  { event: "Stand Up Comedy", ticket: "VIP", sold: 100, revenue: 35000000 },
  { event: "Stand Up Comedy", ticket: "General", sold: 300, revenue: 60000000 },
];

export default function OrganizerOverview() {
  const router = useRouter();
  const [stats, setStats] = useState(PLACEHOLDER_STATS);
  const [sales, setSales] = useState(PLACEHOLDER_SALES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "organizer")) return;
    Promise.all([fetchOrganizerStats(), fetchOrganizerSales({ limit: 5 })])
      .then(([s, sl]) => {
        if (s) setStats(s);
        const list = Array.isArray(sl) ? sl : sl?.data ?? sl?.sales ?? [];
        if (list.length) setSales(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Organizer Dashboard – TiketKu</title></Head>
      <DashboardLayout title="Organizer Overview">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard label="My Events" value={stats.totalEvents} icon="🎪" color="purple" />
          <StatCard label="Tickets Sold" value={stats.totalTicketsSold?.toLocaleString()} icon="🎟️" color="green" />
          <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon="💰" color="blue" />
          <StatCard label="Pending Withdrawal" value={fmt(stats.pendingWithdrawal)} icon="⏳" color="yellow" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Create Event", href: "/dashboard/organizer/events", icon: "➕", color: "bg-primary" },
            { label: "Manage Tickets", href: "/dashboard/organizer/tickets", icon: "🎟️", color: "bg-secondary" },
            { label: "View Sales", href: "/dashboard/organizer/sales", icon: "📈", color: "bg-green-600" },
            { label: "Withdraw Funds", href: "/dashboard/organizer/withdrawals", icon: "💸", color: "bg-yellow-500" },
          ].map((action) => (
            <button
              key={action.href}
              onClick={() => router.push(action.href)}
              className={`${action.color} text-white rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-semibold text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Top selling tickets */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-800">Top Selling Tickets</h2>
            <button
              onClick={() => router.push("/dashboard/organizer/sales")}
              className="text-sm text-primary font-medium hover:underline"
            >
              Full report →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Ticket Type</th>
                  <th className="px-6 py-3 text-left">Sold</th>
                  <th className="px-6 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(4)].map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-3 bg-neutral-200 rounded w-28" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : sales.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-800">{row.event}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.ticket}</td>
                        <td className="px-6 py-4">{row.sold?.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-primary">{fmt(row.revenue)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
