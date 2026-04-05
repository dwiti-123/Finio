"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Transaction, TransactionAction, TransactionState } from "@/types/transactions";
import { mockTransactions } from "@/data/mockTransaction";
import { TransactionContextType } from "@/types/context";


// ---------- Reducer ----------
function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case "HYDRATE":
      return { transactions: action.payload };

    case "ADD_TRANSACTION":
      return { transactions: [action.payload, ...state.transactions] };

    case "EDIT_TRANSACTION":
      return {
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}



const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// ---------- Provider ----------
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: mockTransactions,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      try {
        const parsed: Transaction[] = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
      } catch {
        // Corrupted data — fall back to mock
      }
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  // Named helpers
  const addTransaction = (t: Transaction) =>
    dispatch({ type: "ADD_TRANSACTION", payload: t });

  const editTransaction = (t: Transaction) =>
    dispatch({ type: "EDIT_TRANSACTION", payload: t });

  const deleteTransaction = (id: string) =>
    dispatch({ type: "DELETE_TRANSACTION", payload: id });

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        dispatch,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// ---------- Hook ----------
export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}