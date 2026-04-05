"use client";

import { useMemo } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { useRole } from "@/context/RoleContext";
import { TransactionCategory } from "@/types/transactions";
import BudgetCard from "@/components/budget/BudgetCard";
import FadeIn from "@/components/ui/FadeIn";
import { useBudget } from "@/context/BudgetContext";
import { ShieldAlert } from "lucide-react";

const ALL_CATEGORIES: TransactionCategory[] = [
  "Food", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Investment", "Other",
];

function getLatestMonthSpending(
  transactions: ReturnType<typeof useTransactions>["transactions"]
): Partial<Record<TransactionCategory, number>> {
  if (transactions.length === 0) return {};

  const dates = transactions.map((t) => new Date(t.date));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

  const map: Partial<Record<TransactionCategory, number>> = {};
  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getMonth() === latest.getMonth() &&
        d.getFullYear() === latest.getFullYear()
      );
    })
    .forEach(({ category, amount }) => {
      map[category] = (map[category] ?? 0) + amount;
    });

  return map;
}

export default function BudgetPage() {
  const { transactions } = useTransactions();
  const { isAdmin } = useRole();
  const { budgets } = useBudget();

  const spending = useMemo(
    () => getLatestMonthSpending(transactions),
    [transactions]
  );

  // Sort: over budget first → nearing → has budget → no budget
  const sorted = useMemo(() => {
    return [...ALL_CATEGORIES].sort((a, b) => {
      const spentA = spending[a] ?? 0;
      const spentB = spending[b] ?? 0;
      const budgetA = budgets[a];
      const budgetB = budgets[b];

      const scoreA = !budgetA ? 0 : spentA > budgetA ? 3 : spentA / budgetA >= 0.8 ? 2 : 1;
      const scoreB = !budgetB ? 0 : spentB > budgetB ? 3 : spentB / budgetB >= 0.8 ? 2 : 1;

      return scoreB - scoreA;
    });
  }, [spending, budgets]);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <FadeIn delay={0}>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isAdmin
                ? "Set monthly budgets per category. Viewer can track progress."
                : "Track your spending against monthly budgets."}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-3 py-1.5 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin — click ⚙ on any card to set a budget
            </div>
          )}
        </div>
      </FadeIn>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((category, i) => (
          <FadeIn key={category} delay={i * 60}>
            <BudgetCard
              category={category}
              spent={spending[category] ?? 0}
              isAdmin={isAdmin}
            />
          </FadeIn>
        ))}
      </div>

    </div>
  );
}