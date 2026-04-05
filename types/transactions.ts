export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;          // always positive — type determines sign
  type: TransactionType;
  category: TransactionCategory;
  date: string;            // ISO string: "2024-01-15"
}

export type UserRole = "admin" | "viewer";
export type Theme = "light" | "dark";

// For filters on Transactions page
export interface TransactionFilters {
  search: string;
  type: TransactionType | "all";
  category: TransactionCategory | "all";  
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}


// ---------- State ----------
export interface TransactionState {
  transactions: Transaction[];
}

// ---------- Actions ----------
export type TransactionAction =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "EDIT_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "HYDRATE"; payload: Transaction[] };
