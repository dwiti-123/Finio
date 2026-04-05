"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { calculateHealthScore } from "@/utils/healthScore";

interface Props {
  transactions: Transaction[];
}

const colorMap = {
  red:   { ring: "text-red-500",   bg: "bg-red-500",   light: "bg-red-50 dark:bg-red-950",   text: "text-red-600 dark:text-red-400"   },
  amber: { ring: "text-amber-500", bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400" },
  green: { ring: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" },
};

// SVG Gauge
function Gauge({ score, color }: { score: number; color: "red" | "amber" | "green" }) {
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;
  const strokeColor = color === "green" ? "#10b981" : color === "amber" ? "#f59e0b" : "#ef4444";

  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      {/* Background arc */}
      <path
        d="M 13 76 A 54 54 0 0 1 127 76"
        fill="none"
        stroke="#e4e4e7"
        strokeWidth="10"
        strokeLinecap="round"
        className="dark:stroke-zinc-700"
      />
      {/* Progress arc */}
      <path
        d="M 13 76 A 54 54 0 0 1 127 76"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      {/* Score text */}
      <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill={strokeColor}>
        {score}
      </text>
    </svg>
  );
}

export default function HealthScoreCard({ transactions }: Props) {
  const health = useMemo(() => calculateHealthScore(transactions), [transactions]);
  const colors = colorMap[health.color];

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-500" />
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">

        {/* Gauge */}
        <div className="flex flex-col items-center gap-1">
          <Gauge score={health.score} color={health.color} />
          <span className={cn("text-sm font-bold", colors.text)}>
            {health.label}
          </span>
        </div>

        {/* Breakdown */}
        <div className="w-full flex flex-col gap-2">
          {[
            { label: "Savings Rate", value: health.breakdown.savingsScore, detail: `${health.breakdown.savingsRate}% of income saved` },
            { label: "Expense Ratio", value: health.breakdown.expenseScore, detail: `${health.breakdown.expenseRatio}% of income spent` },
            { label: "Income Consistency", value: health.breakdown.consistencyScore, detail: "Based on last 2 months" },
          ].map(({ label, value, detail }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{value}/100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", colors.bg)}
                  style={{ width: `${value}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400">{detail}</p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}