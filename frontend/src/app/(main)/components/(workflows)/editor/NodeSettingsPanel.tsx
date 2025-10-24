// src/app/(main)/components/(workflows)/editor/NodeSettingsPanel.tsx
"use client";

import { OnClickTriggerConfig } from "./dialog/OnClickTriggerConfig";
import { NodeConfigDialog } from "./NodeConfigDialog";

import type { WorkflowNode } from "@/lib/types/workflow-nodes.types";

interface NodeSettingsPanelProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
  onExecute?: (nodeId: string) => Promise<void>;
}

export function NodeSettingsPanel({
  node,
  isOpen,
  onClose,
  onUpdate,

  onExecute,
}: NodeSettingsPanelProps) {
  if (!node) return null;

  const handleUpdate = (data: Partial<WorkflowNode["data"]>) => {
    onUpdate(node.id, data);
  };

  const renderConfig = () => {
    switch (node.type) {
      case "trigger":
        return (
          <OnClickTriggerConfig
            node={node}
            onUpdate={handleUpdate}
            outputData={
              "outputs" in node.data ? node.data.outputs?.data : undefined
            }
          />
        );

      // Add more node configs here
      default:
        return (
          <div className="flex items-center justify-center h-full text-[#919298]">
            Configuration panel for {node.type} coming soon...
          </div>
        );
    }
  };

  return (
    <NodeConfigDialog
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onUpdate={onUpdate}
      onExecute={onExecute}
    >
      {renderConfig()}
    </NodeConfigDialog>
  );
}
