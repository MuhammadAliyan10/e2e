import { Suspense } from "react";
import { Metadata } from "next";
import { WorkflowsHeader } from "../components/(workflows)/header/WorkflowsHeader";
import { WorkflowsTableSkeleton } from "../components/(workflows)/WorkflowsTableSkeleton";
import { WorkflowsTable } from "../components/(workflows)/WorkflowTable";

export const metadata: Metadata = {
  title: "Workflows | e2e",
  description: "Manage your automation workflows",
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <WorkflowsHeader />
      <Suspense fallback={<WorkflowsTableSkeleton />}>
        <WorkflowsTable />
      </Suspense>
    </div>
  );
}
