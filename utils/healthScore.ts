import { Transaction } from "@/types/transactions";

export interface HealthScore {
  score: number;
  label: "At Risk" | "Fair" | "Good" | "Excellent";
  color: "red" | "amber" | "green";
  breakdown: {
    savingsScore: number;
    expenseScore: number;
    consistencyScore: number;
    savingsRate: number;
    expenseRatio: number;
  };
}

function getLatestMonthData(transactions: Transaction[], offset = 0) {
  const dates = transactions.map((t) => new Date(t.date));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  const target = new Date(latest.getFullYear(), latest.getMonth() - offset, 1);

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
  });

  const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses };
}

export function calculateHealthScore(transactions: Transaction[]): HealthScore {
  if (transactions.length === 0) {
    return {
      score: 0,
      label: "At Risk",
      color: "red",
      breakdown: { savingsScore: 0, expenseScore: 0, consistencyScore: 0, savingsRate: 0, expenseRatio: 0 },
    };
  }

  const curr = getLatestMonthData(transactions, 0);
  const prev = getLatestMonthData(transactions, 1);

  // Metric 1 — Savings Rate Score (40%)
  const savingsRate = curr.income > 0 ? (curr.income - curr.expenses) / curr.income : 0;
  const savingsScore =
    savingsRate >= 0.3 ? 100 :
    savingsRate >= 0.2 ? 75 :
    savingsRate >= 0.1 ? 50 :
    savingsRate >= 0   ? 25 : 0;

  // Metric 2 — Expense Ratio Score (40%)
  const expenseRatio = curr.income > 0 ? curr.expenses / curr.income : 1;
  const expenseScore =
    expenseRatio < 0.5  ? 100 :
    expenseRatio < 0.7  ? 75  :
    expenseRatio < 0.9  ? 50  :
    expenseRatio < 1.0  ? 25  : 0;

  // Metric 3 — Income Consistency (20%)
  const consistencyScore =
    curr.income > 0 && prev.income > 0 ? 100 :
    curr.income > 0 || prev.income > 0 ? 50  : 0;

  // Weighted final score
  const score = Math.round(
    savingsScore * 0.4 +
    expenseScore * 0.4 +
    consistencyScore * 0.2
  );

  const label =
    score >= 81 ? "Excellent" :
    score >= 61 ? "Good"      :
    score >= 41 ? "Fair"      : "At Risk";

  const color =
    score >= 61 ? "green" :
    score >= 41 ? "amber" : "red";

  return {
    score,
    label,
    color,
    breakdown: {
      savingsScore,
      expenseScore,
      consistencyScore,
      savingsRate: Math.round(savingsRate * 100),
      expenseRatio: Math.round(expenseRatio * 100),
    },
  };
}