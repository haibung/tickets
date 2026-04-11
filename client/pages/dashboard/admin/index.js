import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { requireAuth } from "@/lib/auth";
import { fetchAdminStats, fetchAllTransactions } from "@/lib/api";

const PLACEHOLDER_STATS = {
  totalUsers: 12_480,
  totalEvents: 348,
  totalTicketsSold: 89_210,
  totalRevenue: 4_230_000_000,
};

const PLACEHOLDER_RECENT = [
  { id: "TXN-0091", user: "Budi Santoso", event: "Coldplay World Tour", amount: 850000, status: "paid", date: "2025-05-10" },
  { id: "TXN-0090", user: "Rina Dewi", event: "Java Jazz 2025", amount: 500000, status: "paid", date: "2025-05-10" },
  { id: "TXN-0089", user: "Ahmad Fauzi", event: "BRI Liga 1", amount: 125000, status: "pending", date: "2025-05-09" },
  { id: "TXN-0088", user: "Siti Aminah", event: "Stand Up Comedy", amount: 350000, status: "paid", date: "2025-05-09" },
  { id: "TXN-0087", user: "Dian Pratama", event: "Bali Arts Festival", amount: 75000, status: "cancelled", date: "2025-05-08" },
];

const STATUS_BADGE = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOverview() {
  const router = useRouter();
  const [stats, setStats] = useState(PLACEHOLDER_STATS);
  const [recent, setRecent] = useState(PLACEHOLDER_RECENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    Promise.all([fetchAdminStats(), fetchAllTransactions({ limit: 5 })])
      .then(([s, t]) => {
        if (s) setStats(s);
        const list = Array.isArray(t) ? t : t?.data ?? t?.transactions ?? [];
        if (list.length) setRecent(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Admin Dashboard – TiketKu</title></Head>
      <DashboardLayout title="Admin Overview">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers?.toLocaleString()} icon="👥" color="blue" />
          <StatCard label="Total Events" value={stats.totalEvents?.toLocaleString()} icon="🎪" color="purple" />
          <StatCard label="Tickets Sold" value={stats.totalTicketsSold?.toLocaleString()} icon="🎟️" color="green" />
          <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon="💰" color="yellow" />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-800">Recent Transactions</h2>
            <button
              onClick={() => router.push("/dashboard/admin/transactions")}
              className="text-sm text-primary font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(6)].map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-3 bg-neutral-200 rounded w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : recent.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-neutral-800">{row.user}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.event}</td>
                        <td className="px-6 py-4 font-medium">{fmt(row.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[row.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-500">{row.date}</td>
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
