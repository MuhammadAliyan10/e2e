"use client";

import { Button } from "@/components/ui/button";

import { Trash2, Archive, Play, Pause, X } from "lucide-react";
import { useState } from "react";
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
import { useBulkWorkflowAction } from "@/lib/hooks/use-workflow";

interface WorkflowActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function WorkflowActions({
  selectedIds,
  onClearSelection,
}: WorkflowActionsProps) {
  const bulkMutation = useBulkWorkflowAction();
  const [action, setAction] = useState<string | null>(null);

  const handleAction = (
    actionType: "delete" | "archive" | "publish" | "pause"
  ) => {
    setAction(actionType);
  };

  const confirmAction = () => {
    if (!action) return;

    bulkMutation.mutate(
      {
        action: action as any,
        workflowIds: selectedIds,
      },
      {
        onSuccess: () => {
          onClearSelection();
          setAction(null);
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-7"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("publish")}
            disabled={bulkMutation.isPending}
          >
            <Play className="h-3 w-3 mr-1" />
            Publish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("pause")}
            disabled={bulkMutation.isPending}
          >
            <Pause className="h-3 w-3 mr-1" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("archive")}
            disabled={bulkMutation.isPending}
          >
            <Archive className="h-3 w-3 mr-1" />
            Archive
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction("delete")}
            disabled={bulkMutation.isPending}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={!!action} onOpenChange={() => setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "delete" ? "Delete" : "Update"} {selectedIds.length}{" "}
              workflows?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "delete"
                ? "This action cannot be undone. All workflow data and execution history will be permanently deleted."
                : `This will ${action} ${selectedIds.length} selected workflows.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={action === "delete" ? "bg-destructive" : ""}
            >
              {bulkMutation.isPending ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
