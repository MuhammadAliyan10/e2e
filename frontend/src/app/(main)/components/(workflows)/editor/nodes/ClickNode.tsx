"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { ClickNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const ClickNode = memo((props: NodeProps<ClickNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="MousePointer"
      iconBgColor="bg-indigo-500"
      iconTextColor="text-white"
      dotColor="fill-indigo-400 text-indigo-400"
      handleColor="bg-indigo-400"
    >
      {data.selector && (
        <div className="truncate">
          <span className="opacity-70">Click: </span>
          <code className="text-[10px]">{data.selector}</code>
        </div>
      )}
    </BaseNode>
  );
});

ClickNode.displayName = "ClickNode";
