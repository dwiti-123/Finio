"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { useMemo } from "react";
import EmptyState from "../ui/EmptyState";
import { PieChartIcon } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function buildCategoryData(transactions: Transaction[]) {
  // Find latest month in data
  const dates = transactions.map((t) => new Date(t.date));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Filter to latest month only
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === latest.getMonth() &&
      d.getFullYear() === latest.getFullYear()
    );
  });

  const map: Record<string, number> = {};
  thisMonth
    .filter((t) => t.type === "expense")
    .forEach(({ category, amount }) => {
      map[category] = (map[category] ?? 0) + amount;
    });

  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300">{name}</p>
      <p className="text-zinc-500">₹{value.toLocaleString("en-IN")}</p>
    </div>
  );
};

export default function CategoryChart({ transactions }: Props) {
  const data = useMemo(() => buildCategoryData(transactions), [transactions]);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={PieChartIcon}
            title="No spending data"
            description="Add expenses to see your spending breakdown."
            className="py-10"
          />
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-zinc-400">Total Spent</span>
              <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                ₹{(total / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
