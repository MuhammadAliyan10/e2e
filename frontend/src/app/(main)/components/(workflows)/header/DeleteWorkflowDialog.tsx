"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteWorkflow } from "@/lib/hooks/use-workflow";

import type { WorkflowListItem } from "@/lib/types/workflow.types";

interface DeleteWorkflowDialogProps {
  workflow: WorkflowListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: DeleteWorkflowDialogProps) {
  const deleteMutation = useDeleteWorkflow();

  const handleDelete = () => {
    deleteMutation.mutate(workflow.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{workflow.name}</strong>?
            <br />
            <br />
            This action cannot be undone. All workflow configurations and
            execution history ({workflow._count?.executions || 0} executions)
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Workflow"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
