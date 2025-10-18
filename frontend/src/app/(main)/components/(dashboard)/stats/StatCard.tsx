"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  description,
  loading = false,
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600 dark:text-green-500";
      case "negative":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-muted animate-pulse rounded mb-1" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <div className="flex items-center gap-2 mt-1">
            {change && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  getTrendColor()
                )}
              >
                {getTrendIcon()}
                <span>{change}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
