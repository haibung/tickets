"use client";

import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";

const INITIAL_EVENT_TYPES = [
  { id: 1, name: "Concert", description: "Live music events" },
  { id: 2, name: "Workshop", description: "Hands-on learning sessions" },
];

export default function OrganizerEventTypesPage() {
  const [items, setItems] = useState(INITIAL_EVENT_TYPES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  function handleCreate(e) {
    e.preventDefault();
    setItems([...items, { id: Date.now(), ...form }]);
    setForm({ name: "", description: "" });
    setShowForm(false);
  }

  return (
    <RoleGuard role="organizer">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Event Types</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            {showForm ? "Cancel" : "+ Create"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-5 mb-5 space-y-3">
            <h3 className="font-semibold text-neutral-900">New Event Type</h3>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
              Save
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["#", "Name", "Description"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((et, i) => (
                <tr key={et.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 text-neutral-700">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{et.name}</td>
                  <td className="px-4 py-3 text-neutral-700">{et.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
