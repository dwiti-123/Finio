import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;      
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: Props) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 gap-3 text-center",
      className
    )}>
      <div className="p-4 rounded-full bg-violet-50 dark:bg-violet-950">
        <Icon className="w-8 h-8 text-violet-400 dark:text-violet-500" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {title}
        </p>
        <p className="text-xs text-zinc-400 max-w-xs">
          {description}
        </p>
      </div>
      {actionLabel && actionHref && (
        <Button
          asChild
          size="sm"
          className="mt-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}