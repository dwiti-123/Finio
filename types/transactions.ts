export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description?: string;
};