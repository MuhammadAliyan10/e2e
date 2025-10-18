"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExecutionTrends } from "@/lib/hooks/use-dashboard-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function WorkflowPerformanceChart() {
  const { data, isLoading, error } = useExecutionTrends(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load execution trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Trends (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelFormatter={(value) =>
                format(new Date(value), "MMM dd, yyyy")
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="successful"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorSuccessful)"
              name="Successful"
            />
            <Area
              type="monotone"
              dataKey="failed"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorFailed)"
              name="Failed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
