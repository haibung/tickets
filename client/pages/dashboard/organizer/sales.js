import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { requireAuth } from "@/lib/auth";
import { fetchOrganizerSales } from "@/lib/api";

const PLACEHOLDER_STATS = {
  totalRevenue: 1_420_000_000,
  totalSold: 3_820,
  avgOrderValue: 371_700,
};

const PLACEHOLDER_ROWS = [
  { event: "Coldplay World Tour", ticket: "VIP Standing", date: "2025-05-10", buyer: "Budi Santoso", qty: 2, amount: 5000000 },
  { event: "Coldplay World Tour", ticket: "Category 2", date: "2025-05-09", buyer: "Rina Dewi", qty: 1, amount: 850000 },
  { event: "Java Jazz 2025", ticket: "General", date: "2025-05-09", buyer: "Ahmad Fauzi", qty: 3, amount: 1500000 },
  { event: "Coldplay World Tour", ticket: "Category 1", date: "2025-05-08", buyer: "Siti Aminah", qty: 1, amount: 1500000 },
  { event: "Stand Up Comedy", ticket: "VIP", date: "2025-05-07", buyer: "Dian Pratama", qty: 2, amount: 700000 },
  { event: "Java Jazz 2025", ticket: "General", date: "2025-05-07", buyer: "Hendra Yusuf", qty: 2, amount: 1000000 },
  { event: "Coldplay World Tour", ticket: "Category 2", date: "2025-05-06", buyer: "Nita Kurnia", qty: 4, amount: 3400000 },
];

const EVENT_SUMMARY = [
  { event: "Coldplay World Tour", sold: 7638, revenue: 8100000000 },
  { event: "Java Jazz 2025", sold: 800, revenue: 400000000 },
  { event: "Stand Up Comedy", sold: 182, revenue: 46000000 },
];

export default function OrganizerSales() {
  const router = useRouter();
  const [stats, setStats] = useState(PLACEHOLDER_STATS);
  const [rows, setRows] = useState(PLACEHOLDER_ROWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "organizer")) return;
    fetchOrganizerSales()
      .then((data) => {
        if (data?.stats) setStats(data.stats);
        const list = Array.isArray(data) ? data : data?.transactions ?? data?.data ?? [];
        if (list.length) setRows(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Sales – Organizer – TiketKu</title></Head>
      <DashboardLayout title="Sales Report">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon="💰" color="green" />
          <StatCard label="Total Tickets Sold" value={stats.totalSold?.toLocaleString()} icon="🎟️" color="blue" />
          <StatCard label="Avg. Order Value" value={fmt(stats.avgOrderValue)} icon="📊" color="purple" />
        </div>

        {/* Per-event summary */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-800">Sales by Event</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Tickets Sold</th>
                  <th className="px-6 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {EVENT_SUMMARY.map((r) => (
                  <tr key={r.event} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-800">{r.event}</td>
                    <td className="px-6 py-4">{r.sold.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-primary">{fmt(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction log */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-800">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Ticket</th>
                  <th className="px-6 py-3 text-left">Buyer</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(6)].map((__, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-neutral-200 rounded w-24" /></td>
                        ))}
                      </tr>
                    ))
                  : rows.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-800">{row.event}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.ticket}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.buyer}</td>
                        <td className="px-6 py-4">{row.qty}</td>
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{fmt(row.amount)}</td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.date}</td>
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
