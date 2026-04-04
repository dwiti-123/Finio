import { Transaction } from "@/types/transactions";

export function calculateSummary(transactions: Transaction[]) {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expenses += t.amount;
    }
  });

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses,
  };
}