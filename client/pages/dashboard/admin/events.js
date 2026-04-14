import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchAllEventTypes } from "@/lib/api";

const PLACEHOLDER = [
  { id: "EVT-001", name: "Coldplay Music of the Spheres World Tour", category: "music", organizer: "Live Nation Indonesia", date: "2025-05-15", location: "Gelora Bung Karno, Jakarta", status: "active", ticketsSold: 42000 },
  { id: "EVT-002", name: "Java Jazz Festival 2025", category: "music", organizer: "Java Festival Production", date: "2025-06-01", location: "JIExpo Kemayoran, Jakarta", status: "active", ticketsSold: 15000 },
  { id: "EVT-003", name: "BRI Liga 1: Persija vs Persib", category: "sports", organizer: "PT Liga Indonesia Baru", date: "2025-05-20", location: "Stadion GBK, Jakarta", status: "active", ticketsSold: 8000 },
  { id: "EVT-004", name: "Jakarta Food & Music Festival", category: "festival", organizer: "Event Nusantara", date: "2025-07-04", location: "Senayan City, Jakarta", status: "active", ticketsSold: 3200 },
  { id: "EVT-005", name: "Stand Up Comedy: Raditya Dika Live", category: "comedy", organizer: "Majelis Lucu Indonesia", date: "2025-05-30", location: "Balai Kartini, Jakarta", status: "active", ticketsSold: 1200 },
  { id: "EVT-006", name: "Bali Arts Festival", category: "festival", organizer: "Pemerintah Provinsi Bali", date: "2025-06-14", location: "Ardha Candra, Bali", status: "draft", ticketsSold: 0 },
];

const CATEGORY_COLORS = {
  music: "bg-purple-100 text-purple-700",
  sports: "bg-green-100 text-green-700",
  festival: "bg-yellow-100 text-yellow-700",
  comedy: "bg-orange-100 text-orange-700",
  theatre: "bg-blue-100 text-blue-700",
  food: "bg-red-100 text-red-700",
};

const STATUS_BADGE = {
  active: "bg-green-100 text-green-700",
  draft: "bg-neutral-100 text-neutral-600",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminEvents() {
  const router = useRouter();
  const [rows, setRows] = useState(PLACEHOLDER);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    fetchAllEventTypes()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.events ?? [];
        if (list.length) setRows(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const displayed = rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name?.toLowerCase().includes(q) || r.organizer?.toLowerCase().includes(q);
  });

  return (
    <>
      <Head><title>Event Types – Admin – TiketKu</title></Head>
      <DashboardLayout title="All Event Types">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
            <input
              type="text"
              placeholder="Search by event name or organizer…"
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
                  <th className="px-6 py-3 text-left">Event Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Organizer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Tickets Sold</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(7)].map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-3 bg-neutral-200 rounded w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : displayed.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-400 text-sm">
                          No events found.
                        </td>
                      </tr>
                    )
                  : displayed.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-neutral-800 max-w-xs">
                          <p className="truncate">{row.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{row.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[row.category] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{row.organizer}</td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.date}</td>
                        <td className="px-6 py-4 font-medium">{row.ticketsSold?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[row.status] ?? "bg-neutral-100 text-neutral-600"}`}>
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
              Showing {displayed.length} of {rows.length} events
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
