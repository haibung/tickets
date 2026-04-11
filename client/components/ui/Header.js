"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ROLE_COLORS = {
  admin: "bg-red-100 text-red-700",
  organizer: "bg-blue-100 text-blue-700",
  user: "bg-green-100 text-green-700",
};

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-neutral-800">
        Welcome back, {user?.name || "Guest"}
      </h1>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
            ROLE_COLORS[user?.role] || "bg-neutral-100 text-neutral-700"
          }`}
        >
          {user?.role || "unknown"}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-neutral-700 hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
