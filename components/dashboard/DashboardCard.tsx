import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  amount: number;
  trend: number; // % change vs last month, can be negative
  icon: LucideIcon;
  type: "balance" | "income" | "expense";
}

const colorMap = {
  balance: {
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    amount: "text-zinc-800 dark:text-zinc-100",
  },
  income: {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    amount: "text-emerald-600 dark:text-emerald-400",
  },
  expense: {
    icon: "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400",
    amount: "text-red-500 dark:text-red-400",
  },
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardCard({
  title,
  amount,
  trend,
  icon: Icon,
  type,
}: DashboardCardProps) {
  const colors = colorMap[type];

  const TrendIcon =
    trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  const trendColor =
    trend > 0
      ? type === "expense"
        ? "text-red-500"       // more expenses = bad
        : "text-emerald-500"   // more income/balance = good
      : trend < 0
      ? type === "expense"
        ? "text-emerald-500"   // less expenses = good
        : "text-red-500"
      : "text-zinc-400";

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </span>
            <span className={cn("text-2xl font-bold tracking-tight", colors.amount)}>
              {formatINR(amount)}
            </span>
            {/* Trend */}
            <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>
                {Math.abs(trend)}% vs last month
              </span>
            </div>
          </div>

          {/* Icon */}
          <div className={cn("p-2.5 rounded-xl", colors.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}