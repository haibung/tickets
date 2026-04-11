import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchAllTickets } from "@/lib/api";

const PLACEHOLDER = [
  { id: "TKT-001", name: "VIP Standing", event: "Coldplay World Tour", organizer: "Live Nation Indonesia", price: 2500000, quota: 500, sold: 498, status: "on sale" },
  { id: "TKT-002", name: "Category 1", event: "Coldplay World Tour", organizer: "Live Nation Indonesia", price: 1500000, quota: 2000, sold: 1940, status: "on sale" },
  { id: "TKT-003", name: "Category 2", event: "Coldplay World Tour", organizer: "Live Nation Indonesia", price: 850000, quota: 5000, sold: 4200, status: "on sale" },
  { id: "TKT-004", name: "General Admission", event: "Java Jazz 2025", organizer: "Java Festival Production", price: 500000, quota: 3000, sold: 1500, status: "on sale" },
  { id: "TKT-005", name: "Tribune A", event: "BRI Liga 1", organizer: "PT Liga Indonesia Baru", price: 125000, quota: 10000, sold: 8000, status: "sold out" },
  { id: "TKT-006", name: "VIP", event: "Stand Up Comedy", organizer: "Majelis Lucu Indonesia", price: 350000, quota: 100, sold: 100, status: "sold out" },
  { id: "TKT-007", name: "General", event: "Bali Arts Festival", organizer: "Pemerintah Provinsi Bali", price: 75000, quota: 5000, sold: 0, status: "draft" },
];

const STATUS_BADGE = {
  "on sale": "bg-green-100 text-green-700",
  "sold out": "bg-red-100 text-red-700",
  draft: "bg-neutral-100 text-neutral-600",
  cancelled: "bg-orange-100 text-orange-700",
};

export default function AdminTickets() {
  const router = useRouter();
  const [rows, setRows] = useState(PLACEHOLDER);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    fetchAllTickets()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.tickets ?? [];
        if (list.length) setRows(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const displayed = rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name?.toLowerCase().includes(q) || r.event?.toLowerCase().includes(q) || r.organizer?.toLowerCase().includes(q);
  });

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Tickets – Admin – TiketKu</title></Head>
      <DashboardLayout title="All Organizer Tickets">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
            <input
              type="text"
              placeholder="Search by ticket name, event, or organizer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Ticket Name</th>
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Organizer</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Quota</th>
                  <th className="px-6 py-3 text-left">Sold</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(5)].map((_, i) => (
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
                          No tickets found.
                        </td>
                      </tr>
                    )
                  : displayed.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-neutral-800">{row.name}</td>
                        <td className="px-6 py-4 text-neutral-600 max-w-xs">
                          <p className="truncate">{row.event}</p>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{row.organizer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{fmt(row.price)}</td>
                        <td className="px-6 py-4">{row.quota?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span>{row.sold?.toLocaleString()}</span>
                            {row.quota > 0 && (
                              <div className="mt-1 w-20 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.min(100, (row.sold / row.quota) * 100)}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_BADGE[row.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div className="px-6 py-3 border-t border-neutral-100 text-xs text-neutral-400">
              Showing {displayed.length} of {rows.length} tickets
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
