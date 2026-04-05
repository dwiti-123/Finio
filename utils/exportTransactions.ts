import { Transaction } from "@/types/transactions";

export function exportAsCSV(transactions: Transaction[]) {
  const headers = ["Date", "Description", "Category", "Type", "Amount (INR)"];

  const rows = transactions.map((t) => [
    // Format date as "01 Mar 2024" — Excel won't auto-format this as a date column
    `"${new Date(t.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", 
      year: "numeric",
    })}"`,
    `"${t.description.replace(/"/g, '""')}"`,  // escape any quotes in description
    t.category,
    t.type,
    t.amount,
  ]);

  // Add BOM for Excel to correctly read UTF-8 (fixes ₹ symbol too)
  const BOM = "\uFEFF";
  const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  download(csv, "transactions.csv", "text/csv;charset=utf-8");
}

export function exportAsJSON(transactions: Transaction[]) {
  const json = JSON.stringify(transactions, null, 2);
  download(json, "transactions.json", "application/json");
}

function download(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}