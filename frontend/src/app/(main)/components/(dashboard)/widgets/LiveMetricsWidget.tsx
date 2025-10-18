"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealTimeMetrics } from "@/lib/hooks/use-dashboard-data";
import { Activity, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveMetricsWidget() {
  const { data, isLoading } = useRealTimeMetrics();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500 animate-pulse" />
            Live Metrics
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-blue-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Running</span>
              </div>
              <span className="text-2xl font-bold">{data?.running || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-yellow-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Queued</span>
              </div>
              <span className="text-2xl font-bold">{data?.queued || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-green-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Active Schedules</span>
              </div>
              <span className="text-2xl font-bold">
                {data?.activeSchedules || 0}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
