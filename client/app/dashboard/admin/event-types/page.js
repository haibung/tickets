import RoleGuard from "@/components/auth/RoleGuard";

const MOCK_EVENT_TYPES = [
  { id: 1, name: "Concert", description: "Live music events", eventsCount: 12 },
  { id: 2, name: "Conference", description: "Professional & tech conferences", eventsCount: 8 },
  { id: 3, name: "Exhibition", description: "Art & product exhibitions", eventsCount: 5 },
  { id: 4, name: "Festival", description: "Food, culture & lifestyle festivals", eventsCount: 15 },
  { id: 5, name: "Workshop", description: "Hands-on learning sessions", eventsCount: 20 },
];

export default function AdminEventTypesPage() {
  return (
    <RoleGuard role="admin">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Event Types</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                {["#", "Name", "Description", "Events"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_EVENT_TYPES.map((et, i) => (
                <tr key={et.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-4 py-3 text-neutral-700">{et.id}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">{et.name}</td>
                  <td className="px-4 py-3 text-neutral-700">{et.description}</td>
                  <td className="px-4 py-3">{et.eventsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
