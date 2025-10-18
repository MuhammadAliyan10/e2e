"use client";

import { useRouter } from "next/navigation";
import {
  Workflow,
  TrendingUp,
  Play,
  Globe,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "../components/header/PageHeader";
import { StatCard } from "../components/(dashboard)/stats/StatCard";
import { WorkflowPerformanceChart } from "../components/(dashboard)/widgets/WorkFlowPerformanceChart";
import { LiveMetricsWidget } from "../components/(dashboard)/widgets/LiveMetricsWidget";
import { TopWorkflowsTable } from "../components/(dashboard)/widgets/TopWorkflowsTable";
import { WorkflowCategoryPie } from "../components/(dashboard)/widgets/WorkFlowCategoryPie";
import { Button } from "@/components/ui/button";
interface DashboardClientProps {
  initialStats: any;
  error: string | null | undefined;
}

export function DashboardClient({ initialStats, error }: DashboardClientProps) {
  const router = useRouter();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="AI-powered automation analytics and insights"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to Load Dashboard</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>{error}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.refresh()}
                className="gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Sign In Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = initialStats || {
    workflows: { total: 0, active: 0, draft: 0 },
    executions: { total: 0, today: 0, successful: 0, successRate: "0.0%" },
    sites: { total: 0 },
  };

  const isEmptyState =
    stats.workflows.total === 0 &&
    stats.executions.total === 0 &&
    stats.sites.total === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Comprehensive analytics and performance insights for your automation workflows"
        primaryAction={{
          label: "Create Workflow",
          icon: <Workflow className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/workflows/new"),
        }}
        secondaryActions={[
          {
            label: "View Analytics",
            icon: <TrendingUp className="h-4 w-4" />,
            onClick: () => router.push("/dashboard/analytics"),
          },
        ]}
      />

      {isEmptyState && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Welcome to e2e!</AlertTitle>
          <AlertDescription>
            Get started by creating your first workflow or discovering a
            website.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Workflows"
          value={stats.workflows.total}
          icon={<Workflow className="h-4 w-4" />}
          change={`${stats.workflows.active} active`}
          changeType="positive"
          description="Published workflows"
        />
        <StatCard
          title="Total Executions"
          value={stats.executions.total}
          icon={<Play className="h-4 w-4" />}
          change={`${stats.executions.today} today`}
          changeType="positive"
          description="All-time runs"
        />
        <StatCard
          title="Success Rate"
          value={stats.executions.successRate}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={`${stats.executions.successful}/${stats.executions.total}`}
          changeType={
            parseFloat(stats.executions.successRate) >= 90
              ? "positive"
              : parseFloat(stats.executions.successRate) < 70
              ? "negative"
              : "neutral"
          }
        />
        <StatCard
          title="Discovered Sites"
          value={stats.sites.total}
          icon={<Globe className="h-4 w-4" />}
          description="Analyzed websites"
        />
      </div>

      {!isEmptyState && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WorkflowPerformanceChart />
            </div>
            <div className="lg:col-span-1">
              <LiveMetricsWidget />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TopWorkflowsTable />
            <WorkflowCategoryPie />
          </div>
        </>
      )}
    </div>
  );
}
