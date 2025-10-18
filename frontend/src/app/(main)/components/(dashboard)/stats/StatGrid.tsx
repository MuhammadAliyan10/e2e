import { Suspense } from "react";
import { Workflow, Play, CheckCircle2, Globe } from "lucide-react";

import { getDashboardStats } from "@/lib/actions/global.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "./StatCard";

async function StatsContent() {
  const result = await getDashboardStats();

  if (!result.success || !result.data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCard key={i} title="" value="" icon={<div />} loading />
        ))}
      </div>
    );
  }

  const { workflows, executions, sites } = result.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Workflows"
        value={workflows.total}
        icon={<Workflow className="h-4 w-4" />}
        change={`${workflows.active} active`}
        changeType="positive"
        description="Published workflows"
      />
      <StatCard
        title="Total Executions"
        value={executions.total}
        icon={<Play className="h-4 w-4" />}
        change={`${executions.today} today`}
        changeType="positive"
        description="All-time runs"
      />
      <StatCard
        title="Success Rate"
        value={executions.successRate}
        icon={<CheckCircle2 className="h-4 w-4" />}
        change={`${executions.successful}/${executions.total}`}
        changeType={
          parseFloat(executions.successRate) >= 90
            ? "positive"
            : parseFloat(executions.successRate) < 70
            ? "negative"
            : "neutral"
        }
      />
      <StatCard
        title="Discovered Sites"
        value={sites.total}
        icon={<Globe className="h-4 w-4" />}
        description="Analyzed websites"
      />
    </div>
  );
}

export function StatsGrid() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      }
    >
      <StatsContent />
    </Suspense>
  );
}
