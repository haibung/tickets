import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_SALES = [
  { id: "S001", event: "Jazz Night", date: "2025-06-01", tickets: 45, gross: "Rp 6,750,000", fee: "Rp 337,500", net: "Rp 6,412,500" },
  { id: "S002", event: "Tech Conf 2025", date: "2025-06-03", tickets: 120, gross: "Rp 60,000,000", fee: "Rp 3,000,000", net: "Rp 57,000,000" },
  { id: "S003", event: "Jazz Night", date: "2025-06-10", tickets: 30, gross: "Rp 4,500,000", fee: "Rp 225,000", net: "Rp 4,275,000" },
];

export default function OrganizerSalesPage() {
  return (
    <RoleGuard role="organizer">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Sales Summary</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["ID", "Event", "Date", "Tickets", "Gross", "Fee (5%)", "Net"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_SALES.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3 font-semibold">{s.event}</td>
                  <td className="px-4 py-3 text-neutral-700">{s.date}</td>
                  <td className="px-4 py-3">{s.tickets}</td>
                  <td className="px-4 py-3">{s.gross}</td>
                  <td className="px-4 py-3 text-red-600">{s.fee}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">{s.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
