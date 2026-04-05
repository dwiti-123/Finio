import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-36 flex-1" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-20 ml-auto" />
    </div>
  );
}

export default function TransactionsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>

      {/* Table */}
      <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-28 flex-1" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20 ml-auto" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </Card>
    </div>
  );
}