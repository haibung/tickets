import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchAllUsers } from "@/lib/api";

const PLACEHOLDER = [
  { id: "USR-001", name: "Budi Santoso", email: "budi@example.com", role: "user", orders: 12, joined: "2024-01-15", status: "active" },
  { id: "USR-002", name: "Rina Dewi", email: "rina@example.com", role: "user", orders: 5, joined: "2024-03-22", status: "active" },
  { id: "USR-003", name: "Ahmad Fauzi", email: "ahmad@example.com", role: "organizer", orders: 0, joined: "2024-02-10", status: "active" },
  { id: "USR-004", name: "Siti Aminah", email: "siti@example.com", role: "user", orders: 8, joined: "2024-04-05", status: "active" },
  { id: "USR-005", name: "Dian Pratama", email: "dian@example.com", role: "user", orders: 3, joined: "2024-05-20", status: "suspended" },
  { id: "USR-006", name: "Hendra Yusuf", email: "hendra@example.com", role: "organizer", orders: 0, joined: "2023-12-01", status: "active" },
  { id: "USR-007", name: "Nita Kurnia", email: "nita@example.com", role: "user", orders: 21, joined: "2023-11-14", status: "active" },
];

const ROLE_BADGE = {
  admin: "bg-red-100 text-red-700",
  organizer: "bg-blue-100 text-blue-700",
  user: "bg-green-100 text-green-700",
};

const STATUS_BADGE = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  inactive: "bg-neutral-100 text-neutral-600",
};

const ROLE_OPTIONS = ["all", "admin", "organizer", "user"];

export default function AdminUsers() {
  const router = useRouter();
  const [rows, setRows] = useState(PLACEHOLDER);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router, "admin")) return;
    fetchAllUsers()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.users ?? [];
        if (list.length) setRows(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const displayed = rows.filter((r) => {
    const matchRole = roleFilter === "all" || r.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <>
      <Head><title>Users – Admin – TiketKu</title></Head>
      <DashboardLayout title="User Management">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-neutral-100">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 flex-wrap">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    roleFilter === r
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {r}
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
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Orders</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Status</th>
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
                  : displayed.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 text-sm">
                          No users found.
                        </td>
                      </tr>
                    )
                  : displayed.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">{row.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-800">{row.name}</p>
                          <p className="text-xs text-neutral-400">{row.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[row.role] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{row.orders}</td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.joined}</td>
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
              Showing {displayed.length} of {rows.length} users
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
