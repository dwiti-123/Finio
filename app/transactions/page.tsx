"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context/TransactionContext";
import { useRole } from "@/context/RoleContext";
import { Transaction, TransactionFilters } from "@/types/transactions";
import TransactionFilter from "@/components/traansactions/TransactionFilter";
import TransactionTable from "@/components/traansactions/TransactionTable";
import TransactionModal from "@/components/traansactions/TransactionModal";
import DeleteConfirmDialog from "@/components/traansactions/DeleteConfirmDialog";
import { exportAsCSV, exportAsJSON } from "@/utils/exportTransactions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { toast } from "sonner";
import FadeIn from "@/components/ui/FadeIn";

const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export default function TransactionsPage() {
  const { transactions, addTransaction, editTransaction, deleteTransaction } =
    useTransactions();
  const { isAdmin } = useRole();

  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  // Add these to existing state
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // Filter + sort

  const filtered = useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    // Type filter ← was missing
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === "date") {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return filters.sortOrder === "desc" ? diff : -diff;
      } else {
        const diff = b.amount - a.amount;
        return filters.sortOrder === "desc" ? diff : -diff;
      }
    });

    return result;
  }, [transactions, filters]);

  const handleEdit = (t: Transaction) => {
    setEditTarget(t);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleSave = (t: Transaction) => {
    if (editTarget) {
      editTransaction(t);
      toast.success("Transaction updated");
    } else {
      addTransaction(t);
      toast.success("Transaction added");
    }
  };

  // Replace onDelete handler passed to table
  const handleDeleteRequest = (t: Transaction) => setDeleteTarget(t);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id);
      toast.error("Transaction deleted");
      setDeleteTarget(null);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <FadeIn delay={0}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-zinc-400">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
            {filters.type !== "all" && ` · ${filters.type}`}
          </p>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              >
                <DropdownMenuItem
                  onClick={() => exportAsCSV(filtered)}
                  className="text-sm cursor-pointer"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportAsJSON(filtered)}
                  className="text-sm cursor-pointer"
                >
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAdmin && (
              <Button
                onClick={handleAdd}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Filter bar */}
      <FadeIn delay={100}>
        <TransactionFilter filters={filters} onChange={setFilters} />
      </FadeIn>

      {/* Table */}
      <FadeIn delay={200}>
        <TransactionTable
          transactions={filtered}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </FadeIn>

      {/* Modals */}
      {isAdmin && (
        <>
          <TransactionModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initial={editTarget}
          />
          <DeleteConfirmDialog
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            description={deleteTarget?.description}
          />
        </>
      )}
    </div>
  );
}
