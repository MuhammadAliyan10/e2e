"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentActivity } from "@/lib/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecentActivityFeed() {
  const { data, isLoading, error } = useRecentActivity(8);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "RUNNING":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {data.map((execution) => (
              <div
                key={execution.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() =>
                  (window.location.href = `/dashboard/executions/${execution.id}`)
                }
              >
                <div className="mt-1">{getStatusIcon(execution.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm truncate">
                      {execution.workflow.name}
                    </p>
                    <Badge
                      variant={
                        execution.status === "COMPLETED"
                          ? "default"
                          : execution.status === "FAILED"
                          ? "destructive"
                          : "secondary"
                      }
                      className="shrink-0"
                    >
                      {execution.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(execution.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  {execution.duration && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: {(execution.duration / 1000).toFixed(1)}s
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
