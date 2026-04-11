import { useEffect } from "react";
import { useRouter } from "next/router";
import { getRole, isAuthenticated, dashboardPath } from "@/lib/auth";

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth/login?redirect=/dashboard");
      return;
    }
    router.replace(dashboardPath(getRole()));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-500 text-sm">Redirecting to your dashboard…</p>
      </div>
    </div>
  );
}
