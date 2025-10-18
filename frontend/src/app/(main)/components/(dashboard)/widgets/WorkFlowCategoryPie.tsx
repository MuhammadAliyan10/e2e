"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryDistribution } from "@/lib/hooks/use-dashboard-data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface CategoryData {
  category: string;
  count: number;
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  category: string;
  count: number;
}

export function WorkflowCategoryPie() {
  const { data, isLoading, error } = useCategoryDistribution();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            No workflow categories to display
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderLabel = (props: PieLabelProps) => {
    const { category, percent } = props;
    return `${category}: ${(percent * 100).toFixed(0)}%`;
  };

  const formatTooltip = (value: number, name: string) => {
    return [`${value} workflows`, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="category"
            >
              {data.map((entry: CategoryData, index: number) => (
                <Cell
                  key={`cell-${entry.category}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: 600,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
