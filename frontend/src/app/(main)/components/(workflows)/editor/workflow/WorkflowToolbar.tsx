"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Play,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface WorkflowToolbarProps {
  onSave: () => void;
  isSaving: boolean;
  lastSaved?: Date;
  nodeCount: number;
}

export function WorkflowToolbar({
  onSave,
  isSaving,
  lastSaved,
  nodeCount,
}: WorkflowToolbarProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Implement run logic
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/workflows")}
          title="Back to workflows"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm font-medium">Visual Editor</span>
        <Badge variant="secondary" className="ml-2">
          {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mr-4">
          <Clock className="h-3 w-3" />
          {lastSaved ? (
            <span>
              Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
            </span>
          ) : (
            <span>Not saved</span>
          )}
        </div>

        <Button variant="ghost" size="icon" title="Undo" disabled>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Redo" disabled>
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleRun}
          disabled={isRunning || nodeCount === 0}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running..." : "Run"}
        </Button>

        <Button variant="ghost" size="icon" title="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
