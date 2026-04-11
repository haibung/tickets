import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { requireAuth } from "@/lib/auth";
import { fetchOrganizerEvents, createEventType, deleteEventType } from "@/lib/api";

const PLACEHOLDER = [
  { id: "EVT-001", name: "Coldplay World Tour Jakarta", category: "music", date: "2025-05-15", location: "Gelora Bung Karno, Jakarta", status: "active", ticketsSold: 7640 },
  { id: "EVT-002", name: "Java Jazz Festival 2025", category: "music", date: "2025-06-01", location: "JIExpo Kemayoran, Jakarta", status: "active", ticketsSold: 800 },
  { id: "EVT-003", name: "Stand Up Comedy Night", category: "comedy", date: "2025-05-30", location: "Balai Kartini, Jakarta", status: "draft", ticketsSold: 0 },
];

const CATEGORIES = ["music", "sports", "festival", "theatre", "comedy", "food"];

const EMPTY_FORM = { name: "", category: "music", date: "", location: "", description: "" };

export default function OrganizerEvents() {
  const router = useRouter();
  const [events, setEvents] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadEvents = () => {
    fetchOrganizerEvents()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.events ?? [];
        if (list.length) setEvents(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!requireAuth(router, "organizer")) return;
    loadEvents();
  }, [router]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createEventType(form);
      setSuccess("Event created successfully!");
      setShowModal(false);
      setForm(EMPTY_FORM);
      loadEvents();
    } catch (err) {
      setError(err.message || "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEventType(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete event.");
    }
  };

  const STATUS_BADGE = {
    active: "bg-green-100 text-green-700",
    draft: "bg-neutral-100 text-neutral-600",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Head><title>My Events – Organizer – TiketKu</title></Head>
      <DashboardLayout title="My Events">
        {/* Success / error banners */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex justify-between">
            {success}
            <button onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span>+</span> Create Event
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Event Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Location</th>
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
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-neutral-200 rounded w-24" /></td>
                        ))}
                      </tr>
                    ))
                  : events.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-400 text-sm">
                          No events yet. Create your first event!
                        </td>
                      </tr>
                    )
                  : events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-800">{ev.name}</p>
                        </td>
                        <td className="px-6 py-4 capitalize text-neutral-600">{ev.category}</td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{ev.date}</td>
                        <td className="px-6 py-4 text-neutral-600">{ev.location}</td>
                        <td className="px-6 py-4">{ev.ticketsSold?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[ev.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-800">Create New Event</h2>
                <button
                  onClick={() => { setShowModal(false); setError(null); }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Event Name <span className="text-red-500">*</span></label>
                  <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Coldplay World Tour" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <select required name="category" value={form.category} onChange={handleChange} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date <span className="text-red-500">*</span></label>
                    <input required type="date" name="date" value={form.date} onChange={handleChange} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <input required name="location" value={form.location} onChange={handleChange} placeholder="Venue, City" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe your event…" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setError(null); }} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${submitting ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"}`}>
                    {submitting ? "Creating…" : "Create Event"}
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
