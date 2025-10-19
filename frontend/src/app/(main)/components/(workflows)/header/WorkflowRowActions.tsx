"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Play,
  Eye,
  Archive,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import type { WorkflowListItem } from "@/lib/types/workflow.types";
import { useDuplicateWorkflow } from "@/lib/hooks/use-workflow";
import { DeleteWorkflowDialog } from "./DeleteWorkflowDialog";

interface WorkflowRowActionsProps {
  workflow: WorkflowListItem;
}

export function WorkflowRowActions({ workflow }: WorkflowRowActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const duplicateMutation = useDuplicateWorkflow();

  const handleDuplicate = async () => {
    duplicateMutation.mutate(workflow.id);
  };

  const handleRun = () => {
    router.push(`/workflows/${workflow.id}/run`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/workflows/${workflow.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/workflows/${workflow.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRun}>
            <Play className="mr-2 h-4 w-4" />
            Run Now
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteWorkflowDialog
        workflow={workflow}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}
