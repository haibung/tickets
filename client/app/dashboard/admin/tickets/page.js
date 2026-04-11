import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_TICKETS = [
  { id: "TK001", organizer: "EventPro", event: "Jazz Night", price: "Rp 150,000", stock: 200, sold: 180 },
  { id: "TK002", organizer: "TechOrg", event: "Tech Conf 2025", price: "Rp 500,000", stock: 500, sold: 423 },
  { id: "TK003", organizer: "ArtSpace", event: "Art Expo", price: "Rp 75,000", stock: 300, sold: 115 },
  { id: "TK004", organizer: "FoodFest", event: "Food Festival", price: "Rp 100,000", stock: 1000, sold: 872 },
];

export default function AdminTicketsPage() {
  return (
    <RoleGuard role="admin">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Organizer Tickets</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "Organizer", "Event", "Price", "Stock", "Sold"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((tk, i) => (
                <tr key={tk.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{tk.id}</td>
                  <td className="px-4 py-3">{tk.organizer}</td>
                  <td className="px-4 py-3 font-semibold">{tk.event}</td>
                  <td className="px-4 py-3">{tk.price}</td>
                  <td className="px-4 py-3">{tk.stock}</td>
                  <td className="px-4 py-3">{tk.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
