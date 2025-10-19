"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { ScrollNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const ScrollNode = memo((props: NodeProps<ScrollNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="ArrowDown"
      iconBgColor="bg-teal-500"
      iconTextColor="text-white"
      dotColor="fill-teal-400 text-teal-400"
      handleColor="bg-teal-400"
    >
      {data.direction && (
        <div className="truncate capitalize">
          {data.direction === "toElement"
            ? `To: ${data.selector}`
            : `${data.direction} ${data.distance || 0}px`}
        </div>
      )}
    </BaseNode>
  );
});

ScrollNode.displayName = "ScrollNode";
