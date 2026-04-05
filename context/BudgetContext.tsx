"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TransactionCategory } from "@/types/transactions";

type BudgetMap = Partial<Record<TransactionCategory, number>>;

interface BudgetContextType {
  budgets: BudgetMap;
  setBudget: (category: TransactionCategory, amount: number) => void;
  removeBudget: (category: TransactionCategory) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<BudgetMap>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("budgets") ?? "{}");
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const setBudget = (category: TransactionCategory, amount: number) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  const removeBudget = (category: TransactionCategory) => {
    setBudgets((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  };

  return (
    <BudgetContext.Provider value={{ budgets, setBudget, removeBudget }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}