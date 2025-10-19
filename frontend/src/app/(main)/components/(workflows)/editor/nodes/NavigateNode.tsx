"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import { Globe } from "lucide-react";
import type { NavigateNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const NavigateNode = memo((props: NodeProps<NavigateNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Navigation"
      iconBgColor="bg-blue-500"
      iconTextColor="text-white"
      dotColor="fill-blue-400 text-blue-400"
      handleColor="bg-blue-400"
    >
      {data.url && (
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3" />
          <span className="truncate">{data.url}</span>
        </div>
      )}
    </BaseNode>
  );
});

NavigateNode.displayName = "NavigateNode";
