"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Clipboard } from "lucide-react";
import type { ClipboardNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const ClipboardNode = memo((props: NodeProps<ClipboardNodeData>) => {
  const { data } = props;

  const config: BaseNodeConfig = {
    icon: <Clipboard className="w-5 h-5 text-black" />,
    iconColor: "#64748b",
    nodeName: "Clipboard",
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: { left: -7, backgroundColor: "#64748b", borderRadius: "50%" },
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7, backgroundColor: "#64748b", borderRadius: "50%" },
      },
    ],
    showPowerToggle: true,
    footerContent: (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p className="text-xs text-gray-300 capitalize">
          Action: {data.action || "copy"}
        </p>
        {data.targetVariable && (
          <p className="text-xs text-gray-500 mt-1">→ ${data.targetVariable}</p>
        )}
      </div>
    ),
  };

  return <BaseNode {...props} config={config} />;
});

ClipboardNode.displayName = "ClipboardNode";
