import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-px w-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>

      {/* Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
