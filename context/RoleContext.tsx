"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types/transactions";
import { RoleContextType } from "@/types/context";


const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("role") as UserRole) ?? "viewer";
    }
    return "viewer";
  });

  const setRole = (newRole: UserRole) => {
    localStorage.setItem("role", newRole);
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isAdmin: role === "admin" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}