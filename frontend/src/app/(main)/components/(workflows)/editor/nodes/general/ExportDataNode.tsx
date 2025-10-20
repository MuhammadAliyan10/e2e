"use client";

import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import { Download } from "lucide-react";
import type { ExportDataNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const ExportDataNode = memo((props: NodeProps<ExportDataNodeData>) => {
  const { data } = props;

  const config: BaseNodeConfig = {
    icon: <Download className="w-5 h-5 text-black" />,
    iconColor: "#06b6d4",
    nodeName: "Export Data",
    hasDefaultHandles: true,
    handles: [
      {
        id: "input",
        type: "target",
        position: Position.Left,
        style: { left: -7, backgroundColor: "#06b6d4", borderRadius: "50%" },
      },
      {
        id: "output",
        type: "source",
        position: Position.Right,
        style: { right: -7, backgroundColor: "#06b6d4", borderRadius: "50%" },
      },
    ],
    showPowerToggle: true,
    footerContent:
      data.format || data.fileName ? (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-cyan-300 font-medium uppercase">
            {data.format || "json"}
          </p>
          {data.fileName && (
            <p className="text-xs text-gray-400 truncate mt-1">
              {data.fileName}
            </p>
          )}
        </div>
      ) : undefined,
  };

  return <BaseNode {...props} config={config} />;
});

ExportDataNode.displayName = "ExportDataNode";
