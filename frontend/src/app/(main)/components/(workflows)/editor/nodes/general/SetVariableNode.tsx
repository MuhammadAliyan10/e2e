"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Variable } from "lucide-react";
import type { SetVariableNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const SetVariableNode = memo((props: NodeProps<SetVariableNodeData>) => {
  const { data } = props;

  const config: BaseNodeConfig = {
    icon: <Variable className="w-5 h-5 text-black" />,
    iconColor: "#8b5cf6",
    nodeName: "Set Variable",
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: { left: -7, backgroundColor: "#8b5cf6", borderRadius: "50%" },
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7, backgroundColor: "#8b5cf6", borderRadius: "50%" },
      },
    ],
    showPowerToggle: true,
    footerContent: data.variableName ? (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p className="text-xs text-purple-300 font-mono">
          ${data.variableName}
        </p>
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {data.variableType || "string"} • {data.scope || "workflow"}
        </p>
      </div>
    ) : undefined,
  };

  return <BaseNode {...props} config={config} />;
});

SetVariableNode.displayName = "SetVariableNode";
