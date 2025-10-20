"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Check,
  MoreHorizontal,
  Share2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { isTemporaryWorkflowId } from "@/lib/utils/workflow-id";

import type { WorkflowGraph } from "@/lib/types/workflow-nodes.types";
import { cn } from "@/lib/utils";
import { updateWorkflowStatus } from "@/lib/actions/workflow-editor.actions";

interface WorkflowNavbarProps {
  workflowId: string;
  workflowName: string;
  workflowStatus?: "DRAFT" | "PUBLISHED" | "PAUSED" | "ARCHIVED";
  nodeCount: number;
  isSaving: boolean;
  lastSaved?: Date;
  onSave: () => void;
  onRun: () => void;
  onExport: () => void;
  onImport: (graph: WorkflowGraph) => void;
  onNameChange?: (name: string) => void;
}

export function WorkflowNavbar({
  workflowId,
  workflowName,
  workflowStatus = "DRAFT",
  nodeCount,
  isSaving,
  lastSaved,
  onSave,
  onExport,
  onImport,
  onNameChange,
}: WorkflowNavbarProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(workflowStatus === "PUBLISHED");
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(workflowName);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isTemporary = isTemporaryWorkflowId(workflowId);

  useEffect(() => {
    setIsActive(workflowStatus === "PUBLISHED");
  }, [workflowStatus]);

  useEffect(() => {
    setLocalName(workflowName);
  }, [workflowName]);

  const handleStatusToggle = async (checked: boolean) => {
    if (isTemporary) {
      toast.error("Please save your workflow before activating");
      return;
    }

    setIsUpdatingStatus(true);
    const newStatus = checked ? "PUBLISHED" : "DRAFT";

    const result = await updateWorkflowStatus(workflowId, newStatus);

    if (result.success) {
      setIsActive(checked);
      toast.success(checked ? "Workflow activated" : "Workflow deactivated");
    } else {
      toast.error(result.error || "Failed to update status");
      setIsActive(!checked);
    }

    setIsUpdatingStatus(false);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (localName.trim() && localName !== workflowName) {
      onNameChange?.(localName.trim());
    } else if (!localName.trim()) {
      setLocalName(workflowName);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameBlur();
    } else if (e.key === "Escape") {
      setLocalName(workflowName);
      setIsEditingName(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const graph = JSON.parse(text) as WorkflowGraph;
        onImport(graph);
        toast.success("Workflow imported successfully");
      } catch (error) {
        toast.error("Invalid workflow file");
        console.error("Import error:", error);
      }
    };
    input.click();
  };

  const handleShare = () => {
    if (isTemporary) {
      toast.error("Please save your workflow before sharing");
      return;
    }

    const shareUrl = `${window.location.origin}/workflows/${workflowId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Workflow URL copied to clipboard");
  };

  return (
    <div className="h-14 border-b border-[#535456] bg-[#414244] flex items-center justify-between px-4 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/workflows")}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingName ? (
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              autoFocus
              className="h-8 max-w-[300px] bg-[#2a2a2a] border-[#3a3a3a] focus-visible:ring-1 focus-visible:ring-primary"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-medium text-foreground hover:text-foreground/80 truncate max-w-[300px] text-left"
            >
              {localName}
            </button>
          )}
        </div>
      </div>

      {/* Center Section - Tabs */}
      <div className="flex items-center gap-1 absolute left-[40%] top-[5%] z-50  bg-[#535456] px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs rounded-sm text-foreground bg-[#2a2a2a] hover:bg-[#2f2f2f]"
        >
          Editor
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
        >
          Executions
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
        >
          Evaluations
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Clock className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span>
                Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </span>
            </>
          ) : null}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#2a2a2a]">
          <span
            className={cn(
              "text-xs font-medium",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={handleStatusToggle}
            disabled={isUpdatingStatus || isTemporary}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-8 px-3 gap-2 bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#2f2f2f]"
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>

        {/* Save Button */}
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="h-8 px-4 bg-[#ff6b4a] hover:bg-[#ff5530] text-white"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>

        {/* History Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
          disabled={isTemporary}
        >
          <History className="h-4 w-4" />
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onExport}>
              Export workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImport}>
              Import workflow
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400"
              disabled={isTemporary}
            >
              Delete workflow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
