"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useWorkflows } from "@/lib/hooks/use-workflow";

import { Workflow, CheckCircle2, Clock } from "lucide-react";

export function WorkflowStatsWidget() {
  const { data: publishedData } = useWorkflows(1, 1, { status: ["PUBLISHED"] });
  const { data: draftData } = useWorkflows(1, 1, { status: ["DRAFT"] });
  const { data: allData } = useWorkflows(1, 1);

  const totalPublished = publishedData?.total || 0;
  const totalDraft = draftData?.total || 0;
  const totalAll = allData?.total || 0;

  const stats = [
    {
      label: "Total Workflows",
      value: totalAll,
      icon: Workflow,
      color: "text-blue-500",
    },
    {
      label: "Published",
      value: totalPublished,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "Draft",
      value: totalDraft,
      icon: Clock,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
