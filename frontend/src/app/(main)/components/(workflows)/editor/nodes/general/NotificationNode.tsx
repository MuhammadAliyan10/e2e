"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Bell } from "lucide-react";
import type { NotificationNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const NotificationNode = memo(
  (props: NodeProps<NotificationNodeData>) => {
    const { data } = props;

    const getTypeColor = () => {
      const colors = {
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      };
      return colors[data.type] || "#64748b";
    };

    const config: BaseNodeConfig = {
      icon: <Bell className="w-5 h-5 text-black" />,
      iconColor: getTypeColor(),
      nodeName: "Notification",
      hasDefaultHandles: true,
      handles: [
        {
          id: "input",
          type: "target",
          position: Position.Left,
          style: {
            left: -7,
            backgroundColor: getTypeColor(),
            borderRadius: "50%",
          },
        },
        {
          id: "output",
          type: "source",
          position: Position.Right,
          style: {
            right: -7,
            backgroundColor: getTypeColor(),
            borderRadius: "50%",
          },
        },
      ],
      showPowerToggle: true,
      footerContent:
        data.title || data.message ? (
          <div className="mt-2 pt-2 border-t border-slate-700">
            {data.title && (
              <p className="text-xs text-white font-medium truncate">
                {data.title}
              </p>
            )}
            {data.message && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {data.message}
              </p>
            )}
          </div>
        ) : undefined,
    };

    return <BaseNode {...props} config={config} />;
  }
);

NotificationNode.displayName = "NotificationNode";
