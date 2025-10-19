"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Play,
  Download,
  Upload,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { WorkflowGraph } from "@/lib/types/workflow-nodes.types";

interface WorkflowNavbarProps {
  workflowId: string;
  workflowName: string;
  nodeCount: number;
  isSaving: boolean;
  lastSaved?: Date;
  onSave: () => void;
  onRun: () => void;
  onExport: () => void;
  onImport: (graph: WorkflowGraph) => void;
}

export function WorkflowNavbar({
  workflowName,
  nodeCount,
  isSaving,
  lastSaved,
  onSave,
  onRun,
  onExport,
  onImport,
}: WorkflowNavbarProps) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );

  useEffect(() => {
    if (isSaving) {
      setSaveStatus("saving");
    } else if (lastSaved) {
      setSaveStatus("saved");
    }
  }, [isSaving, lastSaved]);

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

  return (
    <div className="h-14 border-b border-slate-800 bg-[#0f1419] flex items-center justify-between px-4 shrink-0 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/workflows")}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate max-w-[200px]">
            {workflowName}
          </span>
          <Badge
            variant="secondary"
            className="h-5 text-[10px] bg-slate-800 text-slate-300 border-slate-700"
          >
            {nodeCount} nodes
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Auto-save status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
          {saveStatus === "saving" ? (
            <>
              <Clock className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveStatus === "saved" && lastSaved ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span>
                Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </span>
            </>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImport}
          className="gap-1.5 h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Upload className="h-3 w-3" />
          Import
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="gap-1.5 h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Download className="h-3 w-3" />
          Export
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-700 mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-1.5 h-8 text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          <Save className="h-3 w-3" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <Button
          onClick={onRun}
          size="sm"
          className="gap-1.5 h-8 text-xs bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
        >
          <Play className="h-3 w-3" />
          Execute
        </Button>
      </div>
    </div>
  );
}
