// src/app/(main)/components/(workflows)/editor/workflow/WorkflowNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Check,
  MoreHorizontal,
  Share2,
  Undo2,
  Redo2,
  Download,
  Upload,
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
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function WorkflowNavbar({
  workflowId,
  workflowName,
  workflowStatus = "DRAFT",
  isSaving,
  lastSaved,
  onSave,
  onExport,
  onImport,
  onNameChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
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

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const graph = JSON.parse(text) as WorkflowGraph;

        // Validate JSON structure
        if (!graph.nodes || !Array.isArray(graph.nodes)) {
          throw new Error("Invalid workflow format: missing nodes array");
        }

        onImport(graph);
        toast.success(`Imported ${graph.nodes.length} nodes successfully`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Invalid workflow file";
        toast.error(message);
        console.error("[WorkflowNavbar] Import error:", error);
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
          className="h-9 w-9 text-white hover:text-white hover:bg-[#535456] shrink-0"
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
              className="h-8 max-w-[300px] bg-[#535456] border-[#6a6a6c] text-white focus-visible:ring-1 focus-visible:ring-primary"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-medium text-white hover:text-white/80 truncate max-w-[300px] text-left"
              title={localName}
            >
              {localName || "Untitled Workflow"}
            </button>
          )}
        </div>

        {/* Undo/Redo Buttons */}
      </div>

      {/* Center Section - Tabs
      <div className="flex items-center gap-1 bg-[#535456] px-2 py-1.5 rounded-md">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-3 text-xs rounded-sm text-white bg-[#414244] hover:bg-[#4a4a4c]"
        >
          Editor
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-3 text-xs text-[#919298] hover:text-white hover:bg-[#414244]"
        >
          Executions
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-3 text-xs text-[#919298] hover:text-white hover:bg-[#414244]"
        >
          Evaluations
        </Button>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 text-white hover:text-white hover:bg-[#535456] disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 text-white hover:text-white hover:bg-[#535456] disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#919298]">
          {isSaving ? (
            <>
              <Clock className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-sx">
                Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </span>
            </>
          ) : null}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#535456]">
          <span
            className={cn(
              "text-xs font-medium",
              isActive ? "text-white" : "text-[#919298]"
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

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8 px-3 gap-2 bg-[#535456] border-[#6a6a6c] text-white hover:bg-[#5f5f61] hover:text-white"
        >
          <Download className="h-3 w-3" />
          Export
        </Button>

        {/* Import Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="h-8 px-3 gap-2 bg-[#535456] border-[#6a6a6c] text-white hover:bg-[#5f5f61] hover:text-white"
        >
          <Upload className="h-3 w-3" />
          Import
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-8 px-3 gap-2 bg-[#535456] border-[#6a6a6c] text-white hover:bg-[#5f5f61] hover:text-white"
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

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-white hover:bg-[#535456]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#2a2a2a] border-[#3a3a3a]"
          >
            <DropdownMenuItem
              onClick={onExport}
              className="text-white hover:bg-[#3a3a3a]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export workflow
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleImportClick}
              className="text-white hover:bg-[#3a3a3a]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import workflow
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3a3a3a]" />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400 hover:bg-[#3a3a3a]"
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
