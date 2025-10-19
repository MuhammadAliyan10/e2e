"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { HoverNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const HoverNode = memo((props: NodeProps<HoverNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="MousePointer2"
      iconBgColor="bg-lime-500"
      iconTextColor="text-slate-900"
      dotColor="fill-lime-400 text-lime-400"
      handleColor="bg-lime-400"
    >
      {data.selector && (
        <div className="truncate">
          <code className="text-[10px]">{data.selector}</code>
          {data.duration && (
            <span className="ml-2 opacity-70">({data.duration}ms)</span>
          )}
        </div>
      )}
    </BaseNode>
  );
});

HoverNode.displayName = "HoverNode";
