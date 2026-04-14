import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { requireAuth } from "@/lib/auth";
import { fetchWithdrawals, createWithdrawal } from "@/lib/api";

const PLACEHOLDER_BALANCE = {
  available: 340_000_000,
  pending: 120_000_000,
  withdrawn: 960_000_000,
};

const PLACEHOLDER_HISTORY = [
  { id: "WD-005", amount: 200000000, method: "Bank Transfer – BCA", status: "completed", requestedAt: "2025-04-20", completedAt: "2025-04-22" },
  { id: "WD-004", amount: 150000000, method: "Bank Transfer – Mandiri", status: "completed", requestedAt: "2025-03-15", completedAt: "2025-03-17" },
  { id: "WD-003", amount: 120000000, method: "Bank Transfer – BCA", status: "pending", requestedAt: "2025-05-10", completedAt: null },
  { id: "WD-002", amount: 300000000, method: "Bank Transfer – BNI", status: "completed", requestedAt: "2025-02-01", completedAt: "2025-02-03" },
  { id: "WD-001", amount: 310000000, method: "Bank Transfer – BCA", status: "completed", requestedAt: "2025-01-10", completedAt: "2025-01-12" },
];

const STATUS_BADGE = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const EMPTY_FORM = { amount: "", bankName: "", accountNumber: "", accountName: "" };

export default function OrganizerWithdrawals() {
  const router = useRouter();
  const [balance, setBalance] = useState(PLACEHOLDER_BALANCE);
  const [history, setHistory] = useState(PLACEHOLDER_HISTORY);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!requireAuth(router, "organizer")) return;
    fetchWithdrawals()
      .then((data) => {
        if (data?.balance) setBalance(data.balance);
        const list = Array.isArray(data) ? data : data?.withdrawals ?? data?.data ?? [];
        if (list.length) setHistory(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amt = Number(form.amount);
    if (amt <= 0) { setError("Amount must be greater than zero."); return; }
    if (amt > balance.available) { setError("Amount exceeds available balance."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await createWithdrawal({ ...form, amount: amt });
      setSuccess("Withdrawal request submitted! It will be processed within 2-3 business days.");
      setShowModal(false);
      setForm(EMPTY_FORM);
      setBalance((b) => ({ ...b, available: b.available - amt, pending: b.pending + amt }));
    } catch (err) {
      setError(err.message || "Failed to submit withdrawal.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n) => `IDR ${Number(n).toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Withdrawals – Organizer – TiketKu</title></Head>
      <DashboardLayout title="Withdrawal Management">
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex justify-between">
            {success}<button onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard label="Available Balance" value={fmt(balance.available)} icon="💰" color="green" />
          <StatCard label="Pending Withdrawal" value={fmt(balance.pending)} icon="⏳" color="yellow" />
          <StatCard label="Total Withdrawn" value={fmt(balance.withdrawn)} icon="✅" color="blue" />
        </div>

        {/* Withdraw CTA */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-800 mb-1">Request Withdrawal</h2>
            <p className="text-sm text-neutral-500">Transfer your available balance to your bank account. Processing takes 2–3 business days.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={balance.available <= 0}
            className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              balance.available > 0
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Withdraw Funds
          </button>
        </div>

        {/* History table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-800">Withdrawal History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Method</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Requested</th>
                  <th className="px-6 py-3 text-left">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(6)].map((__, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-neutral-200 rounded w-24" /></td>
                        ))}
                      </tr>
                    ))
                  : history.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">{row.id}</td>
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{fmt(row.amount)}</td>
                        <td className="px-6 py-4 text-neutral-600">{row.method}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[row.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.requestedAt}</td>
                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{row.completedAt ?? "—"}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-800">Request Withdrawal</h2>
                <button onClick={() => { setShowModal(false); setError(null); }} className="text-neutral-400 hover:text-neutral-600">✕</button>
              </div>
              <form onSubmit={handleWithdraw} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
                )}
                <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
                  Available: <span className="font-bold">{fmt(balance.available)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Amount (IDR) <span className="text-red-500">*</span></label>
                  <input required type="number" name="amount" value={form.amount} onChange={handleChange} min="1" max={balance.available} placeholder="e.g. 50000000" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Bank Name <span className="text-red-500">*</span></label>
                  <input required name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. BCA" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Account Number <span className="text-red-500">*</span></label>
                  <input required name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="e.g. 1234567890" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                  <input required name="accountName" value={form.accountName} onChange={handleChange} placeholder="Full name on account" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setError(null); }} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-50">Cancel</button>
                  <button type="submit" disabled={submitting} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${submitting ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"}`}>
                    {submitting ? "Submitting…" : "Request Withdrawal"}
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
