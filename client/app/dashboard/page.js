"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ROLE_REDIRECT = {
  admin: "/dashboard/admin",
  organizer: "/dashboard/organizer",
  user: "/dashboard/user",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(ROLE_REDIRECT[user.role] || "/login");
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-neutral-700">Redirecting...</p>
    </div>
  );
}
