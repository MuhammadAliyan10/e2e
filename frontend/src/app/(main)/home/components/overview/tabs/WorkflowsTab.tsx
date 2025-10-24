"use client";

import {
  FileText,
  Bot,
  Loader2,
  Clock,
  Tag,
  MoreVertical,
  Copy,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getWorkflows,
  duplicateWorkflow,
  deleteWorkflow,
} from "@/lib/actions/workflow.actions";
import type { Workflow } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WorkflowsTabProps {
  userName: string;
}

interface WorkflowWithCount extends Workflow {
  _count?: {
    executions: number;
  };
}

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  PAUSED: {
    label: "Paused",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

function generateWorkflowId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function WorkflowCardSkeleton() {
  return (
    <Card className="h-64 w-full animate-pulse border-border/50 bg-[#2a2a2a]">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded bg-muted/20" />
          <div className="h-6 w-3/4 rounded bg-muted/20" />
          <div className="h-4 w-full rounded bg-muted/20" />
          <div className="h-4 w-2/3 rounded bg-muted/20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted/20" />
          <div className="h-4 w-16 rounded bg-muted/20" />
        </div>
      </div>
    </Card>
  );
}

function WorkflowCard({
  workflow,
  onDelete,
}: {
  workflow: WorkflowWithCount;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDuplicating(true);
    const result = await duplicateWorkflow(workflow.id);
    setIsDuplicating(false);

    if (result.success && result.data) {
      toast.success("Workflow duplicated successfully");
      router.push(`/workflows/${result.data.id}`);
    } else {
      toast.error(result.error || "Failed to duplicate workflow");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this workflow?")) return;

    setIsDeleting(true);
    const result = await deleteWorkflow(workflow.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success("Workflow deleted successfully");
      onDelete();
    } else {
      toast.error(result.error || "Failed to delete workflow");
    }
  };

  const statusConfig =
    STATUS_CONFIG[workflow.status as keyof typeof STATUS_CONFIG];

  return (
    <Card
      onClick={() => router.push(`/workflows/${workflow.id}`)}
      className="group relative h-64 w-full cursor-pointer border-border/50 bg-[#2a2a2a] transition-all hover:border-primary/50 hover:bg-[#2f2f2f]"
    >
      <div className="flex h-full flex-col justify-between p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Badge
              variant="outline"
              className={cn("border", statusConfig.className)}
            >
              {statusConfig.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                >
                  {isDuplicating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-400 focus:text-red-400"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
            {workflow.name}
          </h3>

          {workflow.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {workflow.description}
            </p>
          )}

          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workflow.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-muted/20 text-xs text-muted-foreground"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
              {workflow.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-muted/20 text-xs text-muted-foreground"
                >
                  +{workflow.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(workflow.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {workflow._count && (
            <span>{workflow._count.executions} executions</span>
          )}
        </div>
      </div>
    </Card>
  );
}

export function WorkflowsTab({ userName }: WorkflowsTabProps) {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<WorkflowWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getWorkflows(1, 100); // Fetch first 100 workflows

    if (result.success && result.data) {
      setWorkflows(result.data.workflows as WorkflowWithCount[]);
    } else {
      setError(result.error || "Failed to load workflows");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleNewWorkflow = () => {
    const newId = generateWorkflowId();
    router.push(`/workflows/${newId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Your Workflows
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and organize your automation workflows
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <WorkflowCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 pb-20">
        <div className="text-center">
          <p className="text-lg text-red-400">{error}</p>
          <Button onClick={fetchWorkflows} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-8 pb-20">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-medium text-foreground">
            👋 Welcome {userName}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Create your first workflow
          </p>
        </div>

        <div className="flex gap-4">
          <Card
            onClick={handleNewWorkflow}
            className="group flex h-64 w-56 cursor-pointer flex-col items-center justify-center gap-4 border-border/50 bg-[#2a2a2a] transition-all hover:border-primary hover:bg-[#2f2f2f]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/10">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              Start from scratch
            </p>
          </Card>

          <Card
            onClick={() => router.push("/dashboard/workflows/ai-example")}
            className="group flex h-64 w-56 cursor-pointer flex-col items-center justify-center gap-4 border-border/50 bg-[#2a2a2a] transition-all hover:border-primary/50 hover:bg-[#2f2f2f]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/10">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              Test a simple AI
              <br />
              Agent example
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Your Workflows
          </h2>
          <p className="text-sm text-muted-foreground">
            {workflows.length}{" "}
            {workflows.length === 1 ? "workflow" : "workflows"}
          </p>
        </div>
        <Button onClick={handleNewWorkflow} className="gap-2">
          <FileText className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onDelete={fetchWorkflows}
          />
        ))}
      </div>
    </div>
  );
}
