"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Clock } from "lucide-react";
import type { DelayNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const DelayNode = memo((props: NodeProps<DelayNodeData>) => {
  const { data } = props;

  const getDelayLabel = () => {
    if (data.delayType === "fixed" && data.delayMs) {
      const unit = data.unit || "ms";
      const value =
        unit === "s"
          ? data.delayMs / 1000
          : unit === "m"
          ? data.delayMs / 60000
          : data.delayMs;
      return `${value}${unit}`;
    }
    if (data.delayType === "random" && data.minDelayMs && data.maxDelayMs) {
      return `${data.minDelayMs}-${data.maxDelayMs}ms`;
    }
    return "Not configured";
  };

  const config: BaseNodeConfig = {
    icon: <Clock className="w-5 h-5 text-black" />,
    iconColor: "#f59e0b",
    nodeName: "Delay",
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: { left: -7, backgroundColor: "#f59e0b", borderRadius: "50%" },
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7, backgroundColor: "#f59e0b", borderRadius: "50%" },
      },
    ],
    showPowerToggle: true,
    footerContent: (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p className="text-xs text-gray-300 capitalize">
          Type: {data.delayType || "fixed"}
        </p>
        <p className="text-xs text-amber-300 font-medium mt-1">
          {getDelayLabel()}
        </p>
      </div>
    ),
  };

  return <BaseNode {...props} config={config} />;
});

DelayNode.displayName = "DelayNode";
