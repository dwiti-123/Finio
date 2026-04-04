"use client";


import { mockTransactions } from "@/data/mockTransaction";
import { calculateSummary } from "@/utils/analytics";

export default function DashboardCards() {
  const summary = calculateSummary(mockTransactions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Total Balance" value={`$${summary.balance}`} />
      <Card title="Total Income" value={`$${summary.totalIncome}`} />
      <Card title="Total Expenses" value={`$${summary.totalExpenses}`} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}