"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser, setUser, removeUser } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserState(getUser());
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    setUserState(userData);
  }

  function logout() {
    removeUser();
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
