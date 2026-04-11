import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchOrganizerTickets, fetchOrganizerEvents, createTicket, deleteTicket } from "@/lib/api";

const PLACEHOLDER_TICKETS = [
  { id: "TKT-001", name: "VIP Standing", eventId: "EVT-001", event: "Coldplay World Tour", price: 2500000, quota: 500, sold: 498, status: "on sale" },
  { id: "TKT-002", name: "Category 1", eventId: "EVT-001", event: "Coldplay World Tour", price: 1500000, quota: 2000, sold: 1940, status: "on sale" },
  { id: "TKT-003", name: "Category 2", eventId: "EVT-001", event: "Coldplay World Tour", price: 850000, quota: 5000, sold: 4200, status: "on sale" },
  { id: "TKT-004", name: "General Admission", eventId: "EVT-002", event: "Java Jazz 2025", price: 500000, quota: 3000, sold: 800, status: "on sale" },
];

const PLACEHOLDER_EVENTS = [
  { id: "EVT-001", name: "Coldplay World Tour" },
  { id: "EVT-002", name: "Java Jazz 2025" },
];

const EMPTY_FORM = { name: "", eventId: "", price: "", quota: "" };

const STATUS_BADGE = {
  "on sale": "bg-green-100 text-green-700",
  "sold out": "bg-red-100 text-red-700",
  draft: "bg-neutral-100 text-neutral-600",
};

export default function OrganizerTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState(PLACEHOLDER_TICKETS);
  const [events, setEvents] = useState(PLACEHOLDER_EVENTS);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadData = () => {
    Promise.all([fetchOrganizerTickets(), fetchOrganizerEvents()])
      .then(([t, e]) => {
        const tList = Array.isArray(t) ? t : t?.data ?? t?.tickets ?? [];
        if (tList.length) setTickets(tList);
        const eList = Array.isArray(e) ? e : e?.data ?? e?.events ?? [];
        if (eList.length) setEvents(eList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!requireAuth(router, "organizer")) return;
    loadData();
  }, [router]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createTicket({
        ...form,
        price: Number(form.price),
        quota: Number(form.quota),
      });
      setSuccess("Ticket created successfully!");
      setShowModal(false);
      setForm(EMPTY_FORM);
      loadData();
    } catch (err) {
      setError(err.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete ticket.");
    }
  };

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Tickets – Organizer – TiketKu</title></Head>
      <DashboardLayout title="Manage Tickets">
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex justify-between">
            {success}<button onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Ticket
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Ticket Name</th>
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Quota</th>
                  <th className="px-6 py-3 text-left">Sold</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(7)].map((__, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-neutral-200 rounded w-20" /></td>
                        ))}
                      </tr>
                    ))
                  : tickets.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-400 text-sm">
                          No tickets yet. Add your first ticket!
                        </td>
                      </tr>
                    )
                  : tickets.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-800">{row.name}</td>
                        <td className="px-6 py-4 text-neutral-600 max-w-xs">
                          <p className="truncate">{row.event}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{fmt(row.price)}</td>
                        <td className="px-6 py-4">{row.quota?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span>{row.sold?.toLocaleString()}</span>
                            {row.quota > 0 && (
                              <div className="mt-1 w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
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
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-800">Add New Ticket</h2>
                <button onClick={() => { setShowModal(false); setError(null); }} className="text-neutral-400 hover:text-neutral-600">✕</button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Event <span className="text-red-500">*</span></label>
                  <select required name="eventId" value={form.eventId} onChange={handleChange} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select an event</option>
                    {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Ticket Name <span className="text-red-500">*</span></label>
                  <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. VIP Standing" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price (IDR) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" name="price" value={form.price} onChange={handleChange} placeholder="850000" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Quota <span className="text-red-500">*</span></label>
                    <input required type="number" min="1" name="quota" value={form.quota} onChange={handleChange} placeholder="500" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setError(null); }} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-50">Cancel</button>
                  <button type="submit" disabled={submitting} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${submitting ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"}`}>
                    {submitting ? "Saving…" : "Add Ticket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
