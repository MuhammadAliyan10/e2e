"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Calendar, Webhook, Hand } from "lucide-react";
import type { TriggerNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const TriggerNode = memo((props: NodeProps<TriggerNodeData>) => {
  const { data } = props;

  const getTriggerInfo = () => {
    switch (data.type) {
      case "schedule":
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span className="truncate">
              {data.schedule || "Not configured"}
            </span>
          </div>
        );
      case "webhook":
        return (
          <div className="flex items-center gap-1.5">
            <Webhook className="w-3 h-3 text-purple-400" />
            <span className="truncate">
              {data.webhookUrl
                ? new URL(data.webhookUrl).pathname
                : "Not configured"}
            </span>
          </div>
        );
      case "manual":
      default:
        return (
          <div className="flex items-center gap-1.5">
            <Hand className="w-3 h-3 text-green-400" />
            <span className="truncate">Manual execution</span>
          </div>
        );
    }
  };

  return (
    <BaseNode
      {...props}
      icon="Play"
      iconColor="#22c55e" // Green icon
      dotColor="#22c55e" // Green dot
      handleColor="#22c55e" // Green handle
      hasInputHandle={false}
      roundedLeft={true} // Rounded left corners
    >
      {getTriggerInfo()}
    </BaseNode>
  );
});

TriggerNode.displayName = "TriggerNode";
