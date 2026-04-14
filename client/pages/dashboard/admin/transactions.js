import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchAllTransactions } from "@/lib/api";

const PLACEHOLDER = [
  { id: "TXN-0091", user: "Budi Santoso", email: "budi@example.com", event: "Coldplay World Tour", ticket: "Category 2", qty: 2, amount: 1700000, status: "paid", date: "2025-05-10" },
  { id: "TXN-0090", user: "Rina Dewi", email: "rina@example.com", event: "Java Jazz 2025", ticket: "General", qty: 1, amount: 500000, status: "paid", date: "2025-05-10" },
  { id: "TXN-0089", user: "Ahmad Fauzi", email: "ahmad@example.com", event: "BRI Liga 1", ticket: "Tribune", qty: 3, amount: 375000, status: "pending", date: "2025-05-09" },
  { id: "TXN-0088", user: "Siti Aminah", email: "siti@example.com", event: "Stand Up Comedy", ticket: "VIP", qty: 1, amount: 350000, status: "paid", date: "2025-05-09" },
  { id: "TXN-0087", user: "Dian Pratama", email: "dian@example.com", event: "Bali Arts Festival", ticket: "General", qty: 1, amount: 75000, status: "cancelled", date: "2025-05-08" },
  { id: "TXN-0086", user: "Hendra Yusuf", email: "hendra@example.com", event: "Prambanan Jazz", ticket: "Category 1", qty: 2, amount: 900000, status: "paid", date: "2025-05-07" },
  { id: "TXN-0085", user: "Nita Kurnia", email: "nita@example.com", event: "DWP 2025", ticket: "Early Bird", qty: 1, amount: 600000, status: "paid", date: "2025-05-07" },
];

const STATUS_BADGE = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS = ["all", "paid", "pending", "cancelled"];

export default function AdminTransactions() {
  const router = useRouter();
  const [rows, setRows] = useState(PLACEHOLDER);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    fetchAllTransactions()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.transactions ?? [];
        if (list.length) setRows(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const displayed = rows.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.id?.toLowerCase().includes(q) ||
      r.user?.toLowerCase().includes(q) ||
      r.event?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Transactions – Admin – TiketKu</title></Head>
      <DashboardLayout title="All Transactions">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-neutral-100">
            <input
              type="text"
              placeholder="Search by ID, user, or event…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    filter === s
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Ticket</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(6)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(8)].map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-3 bg-neutral-200 rounded w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : displayed.length === 0
                  ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400 text-sm">
                          No transactions found.
                        </td>
                      </tr>
                    )
                  : displayed.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500 whitespace-nowrap">{row.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-800">{row.user}</p>
                          <p className="text-xs text-neutral-400">{row.email}</p>
                        </td>
                        <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{row.event}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.ticket}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.qty}</td>
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{fmt(row.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[row.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.date}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div className="px-6 py-3 border-t border-neutral-100 text-xs text-neutral-400">
              Showing {displayed.length} of {rows.length} transactions
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
