import type {
  Workflow,
  WorkflowCategory,
  WorkflowStatus,
} from "@prisma/client";

export interface WorkflowListItem extends Workflow {
  _count?: {
    executions: number;
  };
}

export interface WorkflowFilters {
  search?: string;
  status?: WorkflowStatus[];
  category?: WorkflowCategory[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface WorkflowSort {
  field: "name" | "createdAt" | "lastRunAt" | "totalRuns" | "successRuns";
  direction: "asc" | "desc";
}

export interface WorkflowTableData {
  workflows: WorkflowListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  category?: WorkflowCategory;
  tags?: string[];
}

export interface UpdateWorkflowInput {
  id: string;
  name?: string;
  description?: string;
  category?: WorkflowCategory;
  tags?: string[];
  status?: WorkflowStatus;
}

export interface BulkWorkflowAction {
  action: "delete" | "archive" | "publish" | "pause";
  workflowIds: string[];
}
