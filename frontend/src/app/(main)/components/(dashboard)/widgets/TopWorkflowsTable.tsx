"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkflowPerformance } from "@/lib/hooks/use-dashboard-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  totalRuns: number;
  successRate: number;
  avgDuration: number;
  lastRunAt: string | null;
}

export function TopWorkflowsTable() {
  const { data, isLoading, error } = useWorkflowPerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Workflows</CardTitle>
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
          <CardTitle>Top Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No workflow data to display
          </p>
        </CardContent>
      </Card>
    );
  }

  const topWorkflows = data.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Workflows</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
              <TableHead className="text-right">Avg Duration</TableHead>
              <TableHead className="text-right">Last Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topWorkflows.map((workflow: Workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.name}</TableCell>
                <TableCell className="text-right">
                  {workflow.totalRuns}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {workflow.successRate >= 90 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : workflow.successRate < 70 ? (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    ) : null}
                    <Badge
                      variant={
                        workflow.successRate >= 90
                          ? "default"
                          : workflow.successRate < 70
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {workflow.successRate}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {(workflow.avgDuration / 1000).toFixed(1)}s
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {workflow.lastRunAt
                    ? formatDistanceToNow(new Date(workflow.lastRunAt), {
                        addSuffix: true,
                      })
                    : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
