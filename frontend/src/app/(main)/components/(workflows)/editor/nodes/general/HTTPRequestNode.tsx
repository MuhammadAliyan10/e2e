"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Globe } from "lucide-react";
import type { HTTPRequestNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeData>) => {
  const { data } = props;

  const getMethodColor = () => {
    const colors = {
      GET: "#10b981",
      POST: "#3b82f6",
      PUT: "#f59e0b",
      DELETE: "#ef4444",
      PATCH: "#8b5cf6",
    };
    return colors[data.method] || "#64748b";
  };

  const config: BaseNodeConfig = {
    icon: <Globe className="w-5 h-5 text-black" />,
    iconColor: getMethodColor(),
    nodeName: "HTTP Request",
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: {
          left: -7,
          backgroundColor: getMethodColor(),
          borderRadius: "50%",
        },
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: {
          right: -7,
          backgroundColor: getMethodColor(),
          borderRadius: "50%",
        },
      },
    ],
    showPowerToggle: true,
    footerContent: (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold"
            style={{ color: getMethodColor() }}
          >
            {data.method || "GET"}
          </span>
          {data.url && (
            <span className="text-xs text-gray-400 truncate max-w-[8rem]">
              {data.url}
            </span>
          )}
        </div>
        {data.responseVariable && (
          <p className="text-xs text-gray-500 mt-1">
            → {data.responseVariable}
          </p>
        )}
      </div>
    ),
  };

  return <BaseNode {...props} config={config} />;
});

HTTPRequestNode.displayName = "HTTPRequestNode";
