"use client";

import { useState } from "react";

export default function Header() {
  const [role, setRole] = useState("viewer");

  return (
    <header className="w-full border-b p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <select
        title="Select Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </header>
  );
}