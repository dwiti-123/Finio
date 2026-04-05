"use client";

import { Search, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Transaction,
  TransactionFilters,
  TransactionCategory,
} from "@/types/transactions";

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
  { label: "Amount (High)", value: "amount-desc" },
  { label: "Amount (Low)", value: "amount-asc" },
];

const CATEGORIES: TransactionCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export default function TransactionFilter({ filters, onChange }: Props) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc";

  const reset = () =>
    onChange({
      search: "",
      type: "all",
      category: "all",
      sortBy: "date",
      sortOrder: "desc",
    });
  const sortValue = `${filters.sortBy}-${filters.sortOrder}`;

  const handleSort = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      TransactionFilters["sortBy"],
      TransactionFilters["sortOrder"],
    ];
    onChange({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Search by description or category..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
        />
        {filters.search && (
          <button
            title="serach button"
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Type filter */}
      <Select
        value={filters.type}
        onValueChange={(v) =>
          onChange({ ...filters, type: v as TransactionFilters["type"] })
        }
      >
        <SelectTrigger className="w-full sm:w-36 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Category filter */}
      <Select
        value={filters.category}
        onValueChange={(v) =>
          onChange({ ...filters, category: v as TransactionCategory | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          sideOffset={4}
          className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        >
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sortValue} onValueChange={handleSort}>
        <SelectTrigger className="w-full sm:w-44 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-zinc-400" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-zinc-400 hover:text-zinc-600 shrink-0"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
