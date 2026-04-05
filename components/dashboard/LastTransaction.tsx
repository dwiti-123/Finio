import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transactions";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

interface Props {
  transactions: Transaction[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function LastTransactions({ transactions }: Props) {
  const last5 = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Recent Transactions
        </CardTitle>
        <Link
          href="/transactions"
          className="text-xs text-violet-600 hover:underline font-medium"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {last5.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-6">No transactions yet</p>
        ) : (
          last5.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              {/* Icon + description */}
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${
                  t.type === "income"
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950"
                    : "bg-red-100 text-red-500 dark:bg-red-950"
                }`}>
                  {t.type === "income"
                    ? <ArrowUpRight className="w-3.5 h-3.5" />
                    : <ArrowDownRight className="w-3.5 h-3.5" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 leading-tight">
                    {t.description}
                  </p>
                  <p className="text-xs text-zinc-400">{timeAgo(t.date)}</p>
                </div>
              </div>

              {/* Amount + category */}
              <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-semibold ${
                  t.type === "income" ? "text-emerald-600" : "text-red-500"
                }`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {t.category}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}