"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RoleGuard({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role && user.role !== role) {
      router.replace("/unauthorized");
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-700">Loading...</div>
      </div>
    );
  }

  if (!user) return null;
  if (role && user.role !== role) return null;

  return children;
}
