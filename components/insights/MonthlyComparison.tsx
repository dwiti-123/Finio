"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { CalendarX2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  transactions: Transaction[];
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

function buildComparisonData(transactions: Transaction[]) {
  const map: Record<string, { income: number; expenses: number }> = {};
  transactions.forEach(({ date, type, amount }) => {
    const label = getMonthLabel(new Date(date));
    if (!map[label]) map[label] = { income: 0, expenses: 0 };
    if (type === "income") map[label].income += amount;
    else map[label].expenses += amount;
  });
  return Object.entries(map)
    .map(([month, vals]) => ({ month, ...vals }))
    .slice(-3)
    .reverse();
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill }} className="font-medium">
          {p.name}: ₹{p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyComparison({ transactions }: Props) {
  const data = useMemo(() => buildComparisonData(transactions), [transactions]);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Monthly Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No comparison data"
            description="Not enough monthly data to compare yet."
            className="py-10"
          />
        ) : (
          <ResponsiveContainer width="100%" height={265}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{value}</span>
                )}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}