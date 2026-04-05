"use client";

import { useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  isAdmin: boolean;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

const PAGE_SIZE = 10;

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  Transport: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
  Entertainment:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  Health: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  Utilities:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Salary:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Freelance: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  Investment:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function TransactionTable({
  transactions,
  isAdmin,
  onEdit,
  onDelete,
}: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginated = transactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Reset to page 1 when transactions change (filter applied)
  // Using key trick in parent is cleaner but this works too
  const safePages = Math.min(page, totalPages);
  if (safePages !== page) setPage(safePages);

  if (transactions.length === 0) {
    return (
      <Card className="border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No transactions found
          </p>
          <p className="text-xs text-zinc-400">
            Try adjusting your filters or search term
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Description
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Type
                </th>
                <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Amount
                </th>
                {isAdmin && (
                  <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginated.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  {/* Date */}
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-200">
                    {t.description}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        categoryColors[t.category] ?? categoryColors.Other,
                      )}
                    >
                      {t.category}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs capitalize",
                        t.type === "income"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
                      )}
                    >
                      {t.type}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-semibold whitespace-nowrap",
                      t.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400",
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {t.amount.toLocaleString("en-IN")}
                  </td>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(t)}
                          className="w-7 h-7 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(t)}
                          className="w-7 h-7 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-400">
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, transactions.length)} of{" "}
          {transactions.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 text-zinc-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="icon"
              onClick={() => setPage(p)}
              className={cn(
                "w-7 h-7 text-xs font-medium",
                page === p
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                  : "text-zinc-400",
              )}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 text-zinc-500"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
