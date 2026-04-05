import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function CardSkeleton() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[240px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-7 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Recent transactions */}
      <Card className="border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <TransactionRowSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}