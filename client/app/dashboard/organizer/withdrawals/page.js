"use client";

import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";

const INITIAL_WITHDRAWALS = [
  { id: "WD001", amount: "Rp 10,000,000", bank: "BCA - 1234567890", status: "Approved", date: "2025-05-15" },
  { id: "WD002", amount: "Rp 5,000,000", bank: "BCA - 1234567890", status: "Pending", date: "2025-06-01" },
];

export default function OrganizerWithdrawalsPage() {
  const [items, setItems] = useState(INITIAL_WITHDRAWALS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", bank: "" });

  function handleRequest(e) {
    e.preventDefault();
    setItems([
      ...items,
      { id: `WD${String(items.length + 1).padStart(3, "0")}`, ...form, status: "Pending", date: new Date().toISOString().slice(0, 10) },
    ]);
    setForm({ amount: "", bank: "" });
    setShowForm(false);
  }

  return (
    <RoleGuard role="organizer">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Withdrawals</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            {showForm ? "Cancel" : "Request Withdrawal"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleRequest} className="bg-white rounded-xl shadow p-5 mb-5 space-y-3">
            <h3 className="font-semibold text-neutral-900">New Withdrawal Request</h3>
            <input
              required
              placeholder="Amount (e.g. Rp 5,000,000)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              placeholder="Bank Account (e.g. BCA - 1234567890)"
              value={form.bank}
              onChange={(e) => setForm({ ...form, bank: e.target.value })}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
              Submit Request
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "Amount", "Bank Account", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((w, i) => (
                <tr key={w.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{w.id}</td>
                  <td className="px-4 py-3 font-semibold">{w.amount}</td>
                  <td className="px-4 py-3 text-neutral-700">{w.bank}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      w.status === "Approved" ? "bg-green-100 text-green-700" :
                      w.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{w.status}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{w.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
