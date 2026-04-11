import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_TICKETS = [
  { id: "TK001", event: "Jazz Night", type: "Regular", price: "Rp 150,000", stock: 200, sold: 180, status: "Active" },
  { id: "TK002", event: "Jazz Night", type: "VIP", price: "Rp 350,000", stock: 50, sold: 48, status: "Active" },
  { id: "TK003", event: "Tech Conf 2025", type: "Early Bird", price: "Rp 300,000", stock: 100, sold: 100, status: "Sold Out" },
];

export default function OrganizerTicketsPage() {
  return (
    <RoleGuard role="organizer">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Tickets</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
            + Add Ticket
          </button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "Event", "Type", "Price", "Stock", "Sold", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((tk, i) => (
                <tr key={tk.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{tk.id}</td>
                  <td className="px-4 py-3 font-semibold">{tk.event}</td>
                  <td className="px-4 py-3">{tk.type}</td>
                  <td className="px-4 py-3">{tk.price}</td>
                  <td className="px-4 py-3">{tk.stock}</td>
                  <td className="px-4 py-3">{tk.sold}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tk.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>{tk.status}</span>
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
