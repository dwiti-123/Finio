import { Theme, Transaction, TransactionAction, UserRole } from "./transactions";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean; // convenience boolean — avoids role === "admin" checks everywhere
}


// ---------- Context Type ----------
export interface TransactionContextType {
  transactions: Transaction[];
  dispatch: React.Dispatch<TransactionAction>;
  // Named helpers
  addTransaction: (t: Transaction) => void;
  editTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
}