import { ExecutionHeatmap } from "../ExecutionHeatmap";
import { LiveMetricsWidget } from "../widgets/LiveMetricsWidget";
import { WorkflowCategoryPie } from "../widgets/WorkFlowCategoryPie";
import { WorkflowPerformanceChart } from "../widgets/WorkFlowPerformanceChart";

export function ChartsSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <WorkflowPerformanceChart />
        <ExecutionHeatmap />
      </div>
      <div className="space-y-4">
        <LiveMetricsWidget />
        <WorkflowCategoryPie />
      </div>
    </div>
  );
}
