import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_MY_TRANSACTIONS = [
  { id: "TXN101", event: "Jazz Night", date: "2025-06-01", tickets: 2, amount: "Rp 300,000", status: "Confirmed" },
  { id: "TXN102", event: "Tech Conf 2025", date: "2025-06-03", tickets: 1, amount: "Rp 500,000", status: "Confirmed" },
  { id: "TXN103", event: "Art Expo", date: "2025-07-15", tickets: 2, amount: "Rp 150,000", status: "Upcoming" },
  { id: "TXN104", event: "Food Festival", date: "2025-05-10", tickets: 1, amount: "Rp 100,000", status: "Used" },
];

export default function UserTransactionsPage() {
  return (
    <RoleGuard role="user">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">My Tickets</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "Event", "Date", "Qty", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_MY_TRANSACTIONS.map((tx, i) => (
                <tr key={tx.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 font-semibold">{tx.event}</td>
                  <td className="px-4 py-3 text-neutral-700">{tx.date}</td>
                  <td className="px-4 py-3">{tx.tickets}</td>
                  <td className="px-4 py-3">{tx.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tx.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      tx.status === "Upcoming" ? "bg-blue-100 text-blue-700" :
                      "bg-neutral-100 text-neutral-700"
                    }`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
