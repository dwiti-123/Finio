"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionCategory } from "@/types/transactions";

interface Props {
  open: boolean;
  onClose: () => void;
  category: TransactionCategory;
  currentBudget?: number;
  onSave: (amount: number) => void;
  onRemove: () => void;
}

export default function BudgetModal({
  open, onClose, category, currentBudget, onSave, onRemove,
}: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(currentBudget ? String(currentBudget) : "");
    setError("");
  }, [currentBudget, open]);

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    onSave(val);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-800 dark:text-zinc-100">
            Set Budget — {category}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <Label className="text-zinc-600 dark:text-zinc-400 text-xs">
            Monthly Budget (₹)
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(""); }}
            placeholder="e.g. 5000"
            min={0}
            className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          {currentBudget && (
            <Button
              variant="ghost"
              onClick={() => { onRemove(); onClose(); }}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 mr-auto"
            >
              Remove
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="text-zinc-500">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Save Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}