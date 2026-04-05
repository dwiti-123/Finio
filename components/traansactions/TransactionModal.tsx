"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "@/types/transactions";

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

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  initial?: Transaction | null; // null = add mode, Transaction = edit mode
}

const empty: Omit<Transaction, "id"> = {
  description: "",
  amount: 0,
  type: "expense",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({
  open,
  onClose,
  onSave,
  initial,
}: Props) {
  const [form, setForm] = useState<Omit<Transaction, "id">>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof empty, string>>
  >({});

  // Populate form when editing
  useEffect(() => {
    if (initial) {
      const { id, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [initial, open]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || form.amount <= 0)
      e.amount = "Amount must be greater than 0";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: initial?.id ?? crypto.randomUUID(),
      amount: Number(form.amount),
    });
    onClose();
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-800 dark:text-zinc-100">
            {initial ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
              Description
            </Label>
            <Input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Monthly Salary"
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
              Amount (₹)
            </Label>
            <Input
              type="number"
              value={form.amount || ""}
              onChange={(e) => set("amount", parseFloat(e.target.value))}
              placeholder="0"
              min={0}
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount}</p>
            )}
          </div>
          {/* Type + Category row */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1.5 min-w-0">
              <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
                Type
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v as TransactionType)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                  className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                >
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v as TransactionCategory)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                  className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                >
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>{" "}
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
              Date
            </Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-500">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {initial ? "Save Changes" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
