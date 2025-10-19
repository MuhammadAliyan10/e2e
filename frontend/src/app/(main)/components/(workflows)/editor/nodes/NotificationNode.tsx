"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Badge } from "@/components/ui/badge";
import type { NotificationNodeData } from "@/lib/types/workflow-editor.types";
import { BaseNode } from "./BaseNode";

export const NotificationNode = memo(
  (props: NodeProps<NotificationNodeData>) => {
    const { data } = props;

    const typeConfig = {
      email: { label: "Email", color: "bg-blue-500/10 text-blue-500" },
      slack: { label: "Slack", color: "bg-purple-500/10 text-purple-500" },
      webhook: { label: "Webhook", color: "bg-green-500/10 text-green-500" },
    };

    const config = typeConfig[data.type];

    return (
      <BaseNode {...props} icon="Bell" color="#06b6d4">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className={`text-[10px] h-5 ${config.color}`}
          >
            {config.label}
          </Badge>
          {data.recipient && (
            <div className="text-xs">
              <span className="text-muted-foreground">To:</span>{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
                {data.recipient}
              </code>
            </div>
          )}
          {data.message && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {data.message}
            </p>
          )}
        </div>
      </BaseNode>
    );
  }
);

NotificationNode.displayName = "NotificationNode";
