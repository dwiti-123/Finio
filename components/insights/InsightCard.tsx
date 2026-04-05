import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant: "default" | "success" | "warning" | "danger";
  observation?: string; // smart text insight
}

const variantStyles = {
  default: {
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    value: "text-zinc-800 dark:text-zinc-100",
    obs: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
  success: {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
    obs: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
    obs: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  danger: {
    icon: "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400",
    value: "text-red-500 dark:text-red-400",
    obs: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
};

export default function InsightCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  observation,
}: Props) {
  const styles = variantStyles[variant];

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              {title}
            </span>
            <span className={cn("text-xl font-bold", styles.value)}>
              {value}
            </span>
            <span className="text-xs text-zinc-400">{subtitle}</span>
          </div>
          <div className={cn("p-2.5 rounded-xl shrink-0", styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Smart observation */}
        {observation && (
          <p className={cn(
            "text-xs rounded-lg px-3 py-2 font-medium leading-relaxed",
            styles.obs
          )}>
            💡 {observation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}