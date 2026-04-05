import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function InsightCardSkeleton() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-2.5 w-40" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        </div>
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[240px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export default function InsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InsightCardSkeleton />
        <InsightCardSkeleton />
        <InsightCardSkeleton />
        <InsightCardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}