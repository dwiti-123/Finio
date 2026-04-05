"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { useMemo } from "react";
import EmptyState from "../ui/EmptyState";
import { TrendingUp } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

function buildChartData(transactions: Transaction[]) {
  const monthMap: Record<string, { income: number; expenses: number }> = {};
  transactions.forEach(({ date, type, amount }) => {
    const month = new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 };
    if (type === "income") monthMap[month].income += amount;
    else monthMap[month].expenses += amount;
  });
  return Object.entries(monthMap)
    .map(([month, { income, expenses }]) => ({ month, Income: income, Expenses: expenses }))
    .reverse();
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: ₹{p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

export default function BalanceChart({ transactions }: Props) {
  const data = useMemo(() => buildChartData(transactions), [transactions]);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Balance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* ← THIS is the correct placement */}
        {data.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No trend data"
            description="Add transactions to see your balance trend."
            className="py-10"
          />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}