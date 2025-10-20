"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Calendar, Webhook, Hand } from "lucide-react";
import type { TriggerNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "./BaseNode";

export const TriggerNode = memo((props: NodeProps<TriggerNodeData>) => {
  const { data } = props;

  const getIcon = () => {
    switch (data.type) {
      case "schedule":
        return <Calendar className="w-5 h-5 text-amber-400" />;
      case "webhook":
        return <Webhook className="w-5 h-5 text-purple-400" />;
      default:
        return <Hand className="w-5 h-5 text-green-400" />;
    }
  };

  const config: BaseNodeConfig = {
    icon: getIcon(),
    iconColor: "#22c55e",
    nodeName: "Trigger Node",
    borderRadius: "2rem 0.5rem 0.5rem 2rem", // Rounded left only
    hasDefaultHandles: false, // Custom handles
    handles: [
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7, backgroundColor: "#22c55e", borderRadius: 0 },
        className: "!rotate-45",
      },
    ],

    showPowerToggle: false, // Triggers can't be disabled
    footerContent: (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          {data.type === "schedule"
            ? `Schedule: ${data.schedule || "Not set"}`
            : data.type === "webhook"
            ? "Webhook configured"
            : "Manual execution"}
        </p>
      </div>
    ),
  };

  return <BaseNode {...props} config={config} />;
});

TriggerNode.displayName = "TriggerNode";
