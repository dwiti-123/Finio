"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/types/transactions";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import BudgetModal from "./BudgetModal";
import { useBudget } from "@/context/BudgetContext";
import { toast } from "sonner";

interface Props {
  category: TransactionCategory;
  spent: number;
  isAdmin: boolean;
}

const categoryColors: Record<string, string> = {
  Food:          "bg-orange-500",
  Transport:     "bg-blue-500",
  Shopping:      "bg-pink-500",
  Entertainment: "bg-purple-500",
  Health:        "bg-red-500",
  Utilities:     "bg-yellow-500",
  Salary:        "bg-emerald-500",
  Freelance:     "bg-teal-500",
  Investment:    "bg-violet-500",
  Other:         "bg-zinc-500",
};

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function BudgetCard({ category, spent, isAdmin }: Props) {
  const { budgets, setBudget, removeBudget } = useBudget();
  const [modalOpen, setModalOpen] = useState(false);

  const budget = budgets[category];
  const pct = budget ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = budget ? spent > budget : false;
  const isNearing = budget ? pct >= 80 && !isOver : false;

  const barColor =
    isOver    ? "bg-red-500" :
    isNearing ? "bg-amber-500" :
                (categoryColors[category] ?? "bg-violet-500");

  const status =
    !budget   ? "No budget set" :
    isOver    ? `Over by ${formatINR(spent - budget)}` :
    isNearing ? `${Math.round(100 - pct)}% remaining` :
                `${formatINR(budget - spent)} remaining`;

  const statusColor =
    isOver    ? "text-red-500" :
    isNearing ? "text-amber-500" :
                "text-emerald-600 dark:text-emerald-400";

  return (
    <>
      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full", categoryColors[category] ?? "bg-zinc-500")} />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {category}
              </span>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalOpen(true)}
                className="w-7 h-7 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* Amounts */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-zinc-400">Spent</p>
              <p className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                {formatINR(spent)}
              </p>
            </div>
            {budget && (
              <div className="text-right">
                <p className="text-xs text-zinc-400">Budget</p>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {formatINR(budget)}
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {budget ? (
            <div className="flex flex-col gap-1">
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", barColor)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-medium", statusColor)}>
                  {status}
                </span>
                <span className="text-xs text-zinc-400">
                  {Math.round(pct)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">
              {isAdmin ? "Click ⚙ to set a budget" : "No budget set"}
            </p>
          )}

        </CardContent>
      </Card>

      {isAdmin && (
        <BudgetModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          category={category}
          currentBudget={budget}
          onSave={(amount) => {
            setBudget(category, amount);
            toast.success(`Budget set for ${category}`);
          }}
          onRemove={() => {
            removeBudget(category);
            toast.info(`Budget removed for ${category}`);
          }}
        />
      )}
    </>
  );
}