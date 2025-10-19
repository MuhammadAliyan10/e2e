"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { getNodeDefinition } from "@/lib/utils/node-registry";
import { getNodeIcon } from "@/lib/utils/get-node-icon";
import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";

// Import all panels
import { TriggerPanel } from "./panels/TriggerPanel";
import { AIAgentPanel } from "./panels/AIAgentPanel";
import { NavigatePanel } from "./panels/NavigatePanel";
import { ClickPanel } from "./panels/ClickPanel";
import { TypePanel } from "./panels/TypePannel";
import { ExtractPanel } from "./panels/ExtractPanel";
import { ScreenshotPanel } from "./panels/ScreenshotPanel";
import { ScrollPanel } from "./panels/ScrollPanel";
import { HoverPanel } from "./panels/HoverPanel";
import { SelectPanel } from "./panels/SelectPanel";
import { UploadFilePanel } from "./panels/UploadFilePanel";

import { ConditionPanel } from "./panels/ConditionPanel";
import { LoopPanel } from "./panels/LoopPanel";
import { SwitchPanel } from "./panels/SwitchPanel";
import { MergePanel } from "./panels/MergePanel";
import { TransformPanel } from "./panels/TransformPanel";
import { FilterPanel } from "./panels/FilterPanel";
import { SetVariablePanel } from "./panels/SetVariablePanel";
import { WebhookPanel } from "./panels/WebhookPanel";

interface NodeSettingsPanelProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeSettingsPanel({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: NodeSettingsPanelProps) {
  if (!node) return null;

  const definition = getNodeDefinition(node.type);
  const IconComponent = getNodeIcon(definition.icon);

  const handleUpdate = (data: Partial<WorkflowNode["data"]>) => {
    onUpdate(node.id, data);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${node.data.label}" node?`)) {
      onDelete(node.id);
    }
  };

  const handleDone = () => {
    onClose();
  };

  const renderPanel = () => {
    switch (node.type) {
      case "trigger":
        return <TriggerPanel node={node} onUpdate={handleUpdate} />;
      case "aiAgent":
        return <AIAgentPanel node={node} onUpdate={handleUpdate} />;
      case "navigate":
        return <NavigatePanel node={node} onUpdate={handleUpdate} />;
      case "click":
        return <ClickPanel node={node} onUpdate={handleUpdate} />;
      case "type":
        return <TypePanel node={node} onUpdate={handleUpdate} />;
      case "extract":
        return <ExtractPanel node={node} onUpdate={handleUpdate} />;
      case "screenshot":
        return <ScreenshotPanel node={node} onUpdate={handleUpdate} />;
      case "scroll":
        return <ScrollPanel node={node} onUpdate={handleUpdate} />;
      case "hover":
        return <HoverPanel node={node} onUpdate={handleUpdate} />;
      case "select":
        return <SelectPanel node={node} onUpdate={handleUpdate} />;
      case "uploadFile":
        return <UploadFilePanel node={node} onUpdate={handleUpdate} />;
      // case "httpRequest":
      //   return <HttpRequestPanel node={node} onUpdate={handleUpdate} />;
      case "condition":
        return <ConditionPanel node={node} onUpdate={handleUpdate} />;
      case "loop":
        return <LoopPanel node={node} onUpdate={handleUpdate} />;
      case "switch":
        return <SwitchPanel node={node} onUpdate={handleUpdate} />;
      case "merge":
        return <MergePanel node={node} onUpdate={handleUpdate} />;
      case "transform":
        return <TransformPanel node={node} onUpdate={handleUpdate} />;
      case "filter":
        return <FilterPanel node={node} onUpdate={handleUpdate} />;
      case "setVariable":
        return <SetVariablePanel node={node} onUpdate={handleUpdate} />;
      case "webhook":
        return <WebhookPanel node={node} onUpdate={handleUpdate} />;
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground">
            Configuration panel not implemented for {definition.label}
          </div>
        );
    }
  };

  // Trigger node should not be deletable
  const isTriggerNode = node.type === "trigger";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${definition.color}15`,
                  color: definition.color,
                }}
              >
                <IconComponent className="h-4 w-4" />
              </div>
              {definition.label}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6">{renderPanel()}</div>

        <SheetFooter className="border-t pt-4 flex justify-between">
          {!isTriggerNode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            onClick={handleDone}
            className={isTriggerNode ? "w-full" : ""}
          >
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
