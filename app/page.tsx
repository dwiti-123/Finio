"use client";

import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, WalletCards } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import DashboardCard from "@/components/dashboard/DashboardCard";
import BalanceChart from "@/components/dashboard/BalanceChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import LastTransactions from "@/components/dashboard/LastTransaction";
import EmptyState from "@/components/ui/EmptyState";
import FadeIn from "@/components/ui/FadeIn";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";

function getMonthTotals(
  transactions: ReturnType<typeof useTransactions>["transactions"],
  month: number,
  year: number,
) {
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

function calcTrend(current: number, previous: number) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function DashboardPage() {
  const { transactions } = useTransactions();

  const { cards } = useMemo(() => {
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    const curr = getMonthTotals(transactions, currMonth, currYear);
    const prev = getMonthTotals(transactions, prevMonth, prevYear);

    // Fall back to latest month in data if current month has no data
    const latest = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      return d > acc ? d : acc;
    }, new Date(0));

    const dataMonth = latest.getMonth();
    const dataYear = latest.getFullYear();
    const dataPrevMonth = dataMonth === 0 ? 11 : dataMonth - 1;
    const dataPrevYear = dataMonth === 0 ? dataYear - 1 : dataYear;

    const main =
      curr.income + curr.expense === 0
        ? getMonthTotals(transactions, dataMonth, dataYear)
        : curr;
    const compare =
      curr.income + curr.expense === 0
        ? getMonthTotals(transactions, dataPrevMonth, dataPrevYear)
        : prev;

    const totalBalance = transactions.reduce(
      (s, t) => (t.type === "income" ? s + t.amount : s - t.amount),
      0,
    );

    return {
      cards: {
        balance: totalBalance,
        income: main.income,
        expense: main.expense,
        incomeTrend: calcTrend(main.income, compare.income),
        expenseTrend: calcTrend(main.expense, compare.expense),
        balanceTrend: calcTrend(main.balance, compare.balance),
      },
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={WalletCards}
        title="No transactions yet"
        description="Add your first transaction to see your financial summary, charts and insights."
        actionLabel="Go to Transactions"
        actionHref="/transactions"
      />
    );
  }

 return (
  <div className="flex flex-col gap-6">

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FadeIn delay={0}>
        <DashboardCard title="Total Balance" amount={cards.balance} trend={cards.balanceTrend} icon={Wallet} type="balance" />
      </FadeIn>
      <FadeIn delay={100}>
        <DashboardCard title="Total Income" amount={cards.income} trend={cards.incomeTrend} icon={TrendingUp} type="income" />
      </FadeIn>
      <FadeIn delay={200}>
        <DashboardCard title="Total Expenses" amount={cards.expense} trend={cards.expenseTrend} icon={TrendingDown} type="expense" />
      </FadeIn>
    </div>

    {/* Charts — 2 columns */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <FadeIn delay={400}>
        <BalanceChart transactions={transactions} />
      </FadeIn>
      <FadeIn delay={500}>
        <CategoryChart transactions={transactions} />
      </FadeIn>
    </div>
    
    {/* Health Score — own row */}
    <FadeIn delay={300}>
      <HealthScoreCard transactions={transactions} />
    </FadeIn>

    {/* Last 5 Transactions */}
    <FadeIn delay={600}>
      <LastTransactions transactions={transactions} />
    </FadeIn>

  </div>
);
}
