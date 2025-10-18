import { QuickActionsCard } from "./QuickActionsCard";
import { RecentActivityFeed } from "./widgets/RecentActivityFeed";
import { TopWorkflowsTable } from "./widgets/TopWorkflowsTable";

export function ActivitySection() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <TopWorkflowsTable />
      </div>
      <div className="space-y-4">
        <QuickActionsCard />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
