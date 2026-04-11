import RoleGuard from "@/components/auth/RoleGuard";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function DashboardLayout({ children }) {
  return (
    <RoleGuard>
      <div className="flex min-h-screen bg-neutral-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
