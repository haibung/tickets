import RoleGuard from "@/components/auth/RoleGuard";
import StatCard from "@/components/ui/StatCard";

export default function AdminDashboard() {
  return (
    <RoleGuard role="admin">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Admin Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Users" value="1,240" icon="👥" color="primary" />
          <StatCard title="Total Events" value="85" icon="🎭" color="secondary" />
          <StatCard title="Total Transactions" value="3,572" icon="��" color="green" />
          <StatCard title="Total Revenue" value="Rp 142M" icon="💰" color="yellow" />
        </div>
      </div>
    </RoleGuard>
  );
}
