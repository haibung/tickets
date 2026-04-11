import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_TRANSACTIONS = [
  { id: "TXN001", user: "Alice", event: "Jazz Night", tickets: 2, amount: "Rp 300,000", status: "Paid", date: "2025-06-01" },
  { id: "TXN002", user: "Bob", event: "Tech Conf 2025", tickets: 1, amount: "Rp 500,000", status: "Paid", date: "2025-06-03" },
  { id: "TXN003", user: "Clara", event: "Art Expo", tickets: 3, amount: "Rp 225,000", status: "Pending", date: "2025-06-05" },
  { id: "TXN004", user: "David", event: "Food Festival", tickets: 4, amount: "Rp 400,000", status: "Paid", date: "2025-06-07" },
  { id: "TXN005", user: "Eva", event: "Jazz Night", tickets: 1, amount: "Rp 150,000", status: "Cancelled", date: "2025-06-08" },
];

export default function AdminTransactionsPage() {
  return (
    <RoleGuard role="admin">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">All Transactions</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "User", "Event", "Tickets", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <tr key={tx.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3">{tx.user}</td>
                  <td className="px-4 py-3">{tx.event}</td>
                  <td className="px-4 py-3">{tx.tickets}</td>
                  <td className="px-4 py-3">{tx.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tx.status === "Paid" ? "bg-green-100 text-green-700" :
                      tx.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{tx.status}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
