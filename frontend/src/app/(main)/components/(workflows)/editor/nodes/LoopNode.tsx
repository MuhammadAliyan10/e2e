"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { LoopNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "./BaseNode";

export const LoopNode = memo((props: NodeProps<LoopNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Repeat"
      iconBgColor="bg-rose-500"
      iconTextColor="text-white"
      dotColor="fill-rose-400 text-rose-400"
      handleColor="bg-rose-400"
    >
      {data.items && (
        <div className="space-y-0.5">
          <div className="truncate text-[10px]">
            Items: <code>{data.items}</code>
          </div>
          {data.maxIterations && (
            <div className="truncate opacity-70">
              Max {data.maxIterations} iterations
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
});

LoopNode.displayName = "LoopNode";
