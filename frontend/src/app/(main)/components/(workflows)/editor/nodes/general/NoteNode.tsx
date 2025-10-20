"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";
import { StickyNote } from "lucide-react";
import type { NoteNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode, BaseNodeConfig } from "../BaseNode";

export const NoteNode = memo((props: NodeProps<NoteNodeData>) => {
  const { data } = props;

  const config: BaseNodeConfig = {
    icon: <StickyNote className="w-5 h-5 text-black" />,
    iconColor: data.color || "#fbbf24",
    nodeName: "Note",
    hasDefaultHandles: false,
    showPowerToggle: false,
    footerContent: data.content ? (
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p
          className="text-xs text-gray-300 italic line-clamp-3"
          style={{ fontSize: data.fontSize || 12 }}
        >
          {data.content}
        </p>
      </div>
    ) : undefined,
  };

  return <BaseNode {...props} config={config} />;
});

NoteNode.displayName = "NoteNode";
