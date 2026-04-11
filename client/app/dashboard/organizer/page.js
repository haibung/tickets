import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/ui/StatCard";

export default function OrganizerDashboard() {
  return (
    <RoleGuard role="organizer">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Organizer Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="My Events" value="6" icon="🎭" color="primary" />
          <StatCard title="Tickets Sold" value="1,245" icon="🎟️" color="secondary" />
          <StatCard title="Total Sales" value="Rp 87M" icon="📊" color="green" />
          <StatCard title="Pending Withdrawals" value="Rp 12M" icon="💰" color="yellow" />
        </div>
      </div>
    </RoleGuard>
  );
}
