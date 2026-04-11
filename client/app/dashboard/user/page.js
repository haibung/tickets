import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/ui/StatCard";

export default function UserDashboard() {
  return (
    <RoleGuard role="user">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">My Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
          <StatCard title="Tickets Purchased" value="7" icon="🎫" color="primary" />
          <StatCard title="Upcoming Events" value="3" icon="📅" color="secondary" />
        </div>
      </div>
    </RoleGuard>
  );
}
