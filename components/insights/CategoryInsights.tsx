"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { cn } from "@/lib/utils";
import { BarChart2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-red-500", "bg-pink-500",
  "bg-teal-500", "bg-orange-500",
];

export default function CategoryInsights({ transactions }: Props) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach(({ category, amount }) => {
        map[category] = (map[category] ?? 0) + amount;
      });

    const sorted = Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const max = sorted[0]?.value ?? 1;
    return sorted.map((d) => ({ ...d, pct: Math.round((d.value / max) * 100) }));
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {data.length === 0 ? (
          <EmptyState
            icon={BarChart2}
            title="No expense data"
            description="No expenses found for this month."
            className="py-10"
          />
        ) : (
          data.map(({ name, value, pct }, i) => (
            <div key={name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-600 dark:text-zinc-300">
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">
                    {Math.round((value / total) * 100)}% of total
                  </span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                    ₹{value.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", COLORS[i % COLORS.length])}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}