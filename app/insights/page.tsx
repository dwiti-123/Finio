"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  Trophy,
  Calendar,
} from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import InsightCard from "@/components/insights/InsightCard";
import CategoryInsights from "@/components/insights/CategoryInsights";
import MonthlyComparison from "@/components/insights/MonthlyComparison";
import FadeIn from "@/components/ui/FadeIn";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getMonthData(
  transactions: ReturnType<typeof useTransactions>["transactions"],
  offset = 0, // 0 = latest month, 1 = previous
) {
  // Find the latest month in data
  const dates = transactions.map((t) => new Date(t.date));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  const target = new Date(latest.getFullYear(), latest.getMonth() - offset, 1);

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === target.getMonth() &&
      d.getFullYear() === target.getFullYear()
    );
  });

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // Top category
  const catMap: Record<string, number> = {};
  filtered
    .filter((t) => t.type === "expense")
    .forEach(({ category, amount }) => {
      catMap[category] = (catMap[category] ?? 0) + amount;
    });

  const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  return {
    income,
    expenses,
    savings: income - expenses,
    topCategory: topCategory
      ? { name: topCategory[0], amount: topCategory[1] }
      : null,
    label: target.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    }),
  };
}

export default function InsightsPage() {
  const { transactions } = useTransactions();

  const { curr, prev, savingsRate, expenseChange, latestMonthTransactions } =
    useMemo(() => {
      const dates = transactions.map((t) => new Date(t.date));
      const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

      const curr = getMonthData(transactions, 0);
      const prev = getMonthData(transactions, 1);

      const savingsRate =
        curr.income > 0 ? Math.round((curr.savings / curr.income) * 100) : 0;

      const expenseChange =
        prev.expenses > 0
          ? Math.round(((curr.expenses - prev.expenses) / prev.expenses) * 100)
          : 0;

      const latestMonthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === latest.getMonth() &&
          d.getFullYear() === latest.getFullYear()
        );
      });

      return {
        curr,
        prev,
        savingsRate,
        expenseChange,
        latestMonthTransactions,
      };
    }, [transactions]);

  // Smart observations derived from data
  const topCatPct =
    curr.topCategory && curr.expenses > 0
      ? Math.round((curr.topCategory.amount / curr.expenses) * 100)
      : 0;

  const savingsObs =
    savingsRate >= 30
      ? `Great discipline! You're saving ${savingsRate}% of your income this month.`
      : savingsRate >= 10
        ? `You're saving ${savingsRate}% of income. Aim for 30% for a stronger safety net.`
        : curr.savings < 0
          ? `Expenses exceeded income by ${formatINR(Math.abs(curr.savings))} this month.`
          : `Low savings rate of ${savingsRate}%. Consider reviewing your expenses.`;

  const expenseObs =
    expenseChange > 20
      ? `Expenses rose ${expenseChange}% vs last month — worth reviewing what changed.`
      : expenseChange < -10
        ? `Nice! Expenses dropped ${Math.abs(expenseChange)}% compared to last month.`
        : `Expenses are fairly stable compared to last month (${expenseChange > 0 ? "+" : ""}${expenseChange}%).`;

  return (
    <div className="flex flex-col gap-6">
      {/* Insight Cards — 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FadeIn delay={0}>
          <InsightCard
            title="Monthly Savings"
            value={formatINR(curr.savings)}
            subtitle={`${curr.label} · ${savingsRate}% savings rate`}
            icon={PiggyBank}
            variant={curr.savings >= 0 ? "success" : "danger"}
            observation={savingsObs}
          />
        </FadeIn>
        <FadeIn delay={100}>
          <InsightCard
            title="Highest Spending"
            value={curr.topCategory?.name ?? "—"}
            subtitle={
              curr.topCategory
                ? `${formatINR(curr.topCategory.amount)} · ${topCatPct}% of expenses`
                : "No expense data"
            }
            icon={Trophy}
            variant="warning"
            observation={
              curr.topCategory
                ? `${curr.topCategory.name} accounts for ${topCatPct}% of your total spending this month.`
                : undefined
            }
          />
        </FadeIn>
        <FadeIn delay={200}>
          <InsightCard
            title="Expense Change"
            value={`${expenseChange > 0 ? "+" : ""}${expenseChange}%`}
            subtitle={`vs ${prev.label}`}
            icon={expenseChange > 0 ? TrendingUp : TrendingDown}
            variant={
              expenseChange > 20
                ? "danger"
                : expenseChange < 0
                  ? "success"
                  : "default"
            }
            observation={expenseObs}
          />
        </FadeIn>
        <FadeIn delay={300}>
          <InsightCard
            title="Income vs Expenses"
            value={formatINR(curr.income)}
            subtitle={`Spent ${formatINR(curr.expenses)} · Surplus ${formatINR(curr.savings)}`}
            icon={curr.savings >= 0 ? Calendar : AlertTriangle}
            variant={curr.savings >= 0 ? "default" : "danger"}
            observation={
              curr.savings >= 0
                ? `You have a surplus of ${formatINR(curr.savings)} this month.`
                : `You're in deficit by ${formatINR(Math.abs(curr.savings))}. Income needs to increase or expenses to drop.`
            }
          />
        </FadeIn>
      </div>

      {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <FadeIn delay={400} className="h-full">
    <CategoryInsights transactions={latestMonthTransactions} />
  </FadeIn>
  <FadeIn delay={500} className="h-full">
    <MonthlyComparison transactions={transactions} />
  </FadeIn>
</div>
    </div>
  );
}
