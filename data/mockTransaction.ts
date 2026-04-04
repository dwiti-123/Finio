import { Transaction } from "@/types/transactions";


export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-03-01",
    amount: 5000,
    category: "Salary",
    type: "income",
    description: "Monthly salary",
  },
  {
    id: "2",
    date: "2026-03-02",
    amount: 50,
    category: "Food & Dining",
    type: "expense",
    description: "Lunch",
  },
  {
    id: "3",
    date: "2026-03-05",
    amount: 120,
    category: "Transport",
    type: "expense",
  },
  {
    id: "4",
    date: "2026-03-10",
    amount: 300,
    category: "Freelance",
    type: "income",
  },
];