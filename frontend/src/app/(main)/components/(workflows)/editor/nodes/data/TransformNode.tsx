"use client";

import { memo } from "react";
import { NodeProps } from "reactflow";

import type { TransformNodeData } from "@/lib/types/workflow-nodes.types";
import { BaseNode } from "../BaseNode";

export const TransformNode = memo((props: NodeProps<TransformNodeData>) => {
  const { data } = props;

  return (
    <BaseNode
      {...props}
      icon="Wand2"
      iconBgColor="bg-sky-500"
      iconTextColor="text-white"
      dotColor="fill-sky-400 text-sky-400"
      handleColor="bg-sky-400"
    >
      {data.transformations && data.transformations.length > 0 && (
        <div className="truncate">
          {data.transformations.length} transformation
          {data.transformations.length !== 1 ? "s" : ""}
        </div>
      )}
    </BaseNode>
  );
});

TransformNode.displayName = "TransformNode";
