"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import { Calendar } from "lucide-react";
import { getExecutionHeatmap } from "@/lib/actions/dashboard.actions";

interface HeatmapDay {
  date: string;
  count: number;
}

export function ExecutionHeatmap() {
  const [data, setData] = useState<HeatmapDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const result = await getExecutionHeatmap(
        now.getFullYear(),
        now.getMonth() + 1
      );
      if (result.success && result.data) {
        setData(result.data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Execution Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted";
    const ratio = count / maxCount;
    if (ratio < 0.25) return "bg-green-200 dark:bg-green-900";
    if (ratio < 0.5) return "bg-green-400 dark:bg-green-700";
    if (ratio < 0.75) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-300";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Execution Activity (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {data.map((day) => (
            <div
              key={day.date}
              className={`aspect-square rounded ${getIntensity(
                day.count
              )} hover:opacity-80 transition-opacity cursor-pointer`}
              title={`${day.date}: ${day.count} executions`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-muted" />
            <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded bg-green-600 dark:bg-green-500" />
            <div className="w-3 h-3 rounded bg-green-800 dark:bg-green-300" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
