"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

import type { WorkflowNode } from "@/lib/types/workflow-editor.types";

import { ClickPanel } from "./panels/ClickPanel";
import { FillFormPanel } from "./panels/FillFormPanel";
import { ExtractPanel } from "./panels/ExtractPanel";
import { ConditionPanel } from "./panels/ConditionPanel";
import { LoopPanel } from "./panels/LoopPanel";
import { ScriptPanel } from "./panels/ScriptPanel";
import { WaitPanel } from "./panels/WaitPanel";
import { ApiPanel } from "./panels/ApiPanel";
import { NotificationPanel } from "./panels/NotificationPanel";
import { NavigatePanel } from "./panels/NavigatePanel";

interface WorkflowConfigPanelProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
}

export function WorkflowConfigPanel({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: WorkflowConfigPanelProps) {
  if (!node) return null;

  const handleUpdate = (data: Partial<WorkflowNode["data"]>) => {
    onUpdate(node.id, data);
  };

  const handleDelete = () => {
    if (confirm("Delete this node?")) {
      onDelete(node.id);
    }
  };

  const renderPanel = () => {
    switch (node.type) {
      case "navigate":
        return <NavigatePanel node={node} onUpdate={handleUpdate} />;
      case "click":
        return <ClickPanel node={node} onUpdate={handleUpdate} />;
      case "fillForm":
        return <FillFormPanel node={node} onUpdate={handleUpdate} />;
      case "extract":
        return <ExtractPanel node={node} onUpdate={handleUpdate} />;
      case "condition":
        return <ConditionPanel node={node} onUpdate={handleUpdate} />;
      case "loop":
        return <LoopPanel node={node} onUpdate={handleUpdate} />;
      case "apiCall":
        return <ApiPanel node={node} onUpdate={handleUpdate} />;
      case "script":
        return <ScriptPanel node={node} onUpdate={handleUpdate} />;
      case "wait":
        return <WaitPanel node={node} onUpdate={handleUpdate} />;
      case "notification":
        return <NotificationPanel node={node} onUpdate={handleUpdate} />;
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground">
            No configuration available
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{node.data.label}</SheetTitle>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Copy className="h-3 w-3" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">{renderPanel()}</div>
      </SheetContent>
    </Sheet>
  );
}
